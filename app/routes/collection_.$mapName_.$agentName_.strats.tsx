import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link, json, useLoaderData, useSubmit } from "@remix-run/react";
import { Fragment } from "react";

import { CreateIcon } from "~/components/svgs";
import { getStratListItems } from "~/models/strat.server";
import { validateMapAndAgentNames } from "~/security";
import { requireUserId } from "~/session.server";
import { capitalizeWord } from "~/utils";

export const meta: MetaFunction = ({ params }) => {
  const mapName = capitalizeWord(params.mapName!);
  const agentName = capitalizeWord(params.agentName!);
  return [
    {
      title: `ValoBuddy - ${mapName}/${agentName}/strats`,
    },
  ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);

  const { mapName, agentName } = validateMapAndAgentNames(params);

  const url = new URL(request.url);
  const q = url.searchParams.get("q") || undefined;
  const selectedTagIds = [];
  // url.searchParams.entries() looks like
  // { ['clu99tnrt0007wu3ohc59as1a', 'on'], ['q', '<search-box-content>'], etc. }
  for (const searchParamEntry of url.searchParams.entries()) {
    const [key, value] = searchParamEntry;
    if (key === "q") {
      continue;
    }
    if (value === "on") {
      selectedTagIds.push(key);
    }
  }
  const strats = await getStratListItems({
    userId,
    map: mapName,
    agent: agentName,
    query: q,
    tagIds: selectedTagIds,
  });

  return json({ mapName, agentName, strats, q, selectedTagIds });
}

export default function Strats() {
  interface Tag {
    id: string;
    name: string;
  }

  function getSortedAndUniqueTags(tags: Tag[]) {
    const seenTagIds = new Set();
    const uniqueTags = tags.filter((tag) => {
      if (!seenTagIds.has(tag.id)) {
        seenTagIds.add(tag.id);
        return true;
      }
      return false;
    });
    return Array.from(uniqueTags).sort((a, b) => a.name.localeCompare(b.name));
  }

  const data = useLoaderData<typeof loader>();
  const tags = data.strats.flatMap((strat) => strat.tags as Tag[]);
  const sortedAndUniqueTags = getSortedAndUniqueTags(tags);

  const submit = useSubmit();

  return (
    <main className="flex flex-col grow">
      {/* When there is no content behind/underneath this box, 96% against
      bg-neutral-800 makes this section's background exactly bg-neutral-900. */}
      <section className="flex flex-col space-y-4 z-10 sticky top-0 p-6 w-full bg-neutral-900 bg-opacity-[96%]">
        <div className="flex justify-between">
          <h1 className="text-5xl font-['Druk_Wide_Bold']">STRATS</h1>
          <Link
            to="create"
            className="h-min flex space-x-2 px-4 py-3 text-sm font-['Space_Mono'] text-white bg-gradient-to-r from-red-600 to-valored-500 from-50% to-50% bg-right-bottom bg-[length:200%_100%] outline-none hover:bg-left-bottom hover:text-neutral-900 focus:bg-valored-400 transition-all duration-300 ease-in-out"
          >
            <CreateIcon />
            <span>CREATE</span>
          </Link>
        </div>

        <Form
          role="search"
          onChange={(event) => {
            const isFirstSearch = data.q === undefined;
            submit(event.currentTarget, { replace: !isFirstSearch });
          }}
          className="flex flex-col space-y-4"
        >
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-neutral-200"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              name="q"
              aria-label="Search strats"
              defaultValue={data.q as string} // TODO: Address this type casting.
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              className="block w-full p-3 ps-10 text-neutral-200 bg-neutral-700 border-b-2 border-neutral-600 outline-none hover:bg-neutral-600 hover:border-neutral-500 focus:bg-neutral-600 focus:border-neutral-500 transition"
            />
          </div>

          {/* The "relative -left-2" styles are necessary because "space-x-2"
                gives every child element margin-left: 1rem, except for the
                first one. In our case, the first element is a hidden checkbox.
                The first _visible_ element is the label, and it has left margin
                on it, which we don't want. These two styles offset that. */}
          <div className="flex space-x-2 relative -left-2">
            {sortedAndUniqueTags.map((tag) => (
              <Fragment key={tag.id}>
                <input
                  type="checkbox"
                  id={tag.id}
                  name={tag.id}
                  className="hidden"
                />
                <label
                  htmlFor={tag.id}
                  className={
                    data.selectedTagIds.includes(tag.id)
                      ? "select-none cursor-pointer h-min px-4 py-2 bg-neutral-700 rounded-full ring-1 ring-neutral-500 text-sm font-['Space_Mono'] uppercase hover:ring-2 hover:ring-green-200 transition"
                      : "select-none cursor-pointer h-min px-4 py-2 bg-neutral-800 rounded-full ring-1 ring-neutral-500 text-sm font-['Space_Mono'] uppercase hover:ring-2 hover:ring-green-200 transition"
                  }
                >
                  {tag.name}
                </label>
              </Fragment>
            ))}
          </div>
        </Form>
      </section>

      <section className="flex flex-col space-y-4 px-16 py-4">
        {data.strats.length === 0 ? (
          data.q === undefined ? (
            <p className="text-neutral-400 italic">
              No strats for {capitalizeWord(data.agentName)} on{" "}
              {capitalizeWord(data.mapName)}.
            </p>
          ) : (
            <p className="text-neutral-400 italic">
              No strats for {capitalizeWord(data.agentName)} on{" "}
              {capitalizeWord(data.mapName)} which match that search query.
            </p>
          )
        ) : (
          data.strats.map((strat) => (
            <Strat
              key={strat.id}
              id={strat.id}
              title={strat.title}
              createdAt={new Date(strat.createdAt)}
              updatedAt={new Date(strat.updatedAt)}
              tags={strat.tags.map((tag) => tag.name)}
              imageURLs={strat.images.map((image) => image.imageURL)}
            />
          ))
        )}
      </section>
    </main>
  );
}

interface StratProps {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  imageURLs: string[];
}
function Strat({
  id,
  title,
  createdAt,
  updatedAt,
  tags,
  imageURLs,
}: StratProps) {
  const sortedTags = tags.sort();

  return (
    <div className="flex space-x-4">
      <ImageGrid imageURLs={imageURLs} />
      <div className="w-full flex flex-col space-y-2">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <Link to={id} className="hover:underline">
              <h1 className="text-2xl uppercase font-['Druk_Wide_Bold']">
                {title}
              </h1>
            </Link>
            <span className="text-neutral-400 text-sm font-['Space_Mono'] scale-y-110">
              Created: {createdAt.toDateString()}
            </span>
            <span className="text-neutral-400 text-sm font-['Space_Mono'] scale-y-110">
              Last updated: {updatedAt.toDateString()}
            </span>
          </div>
          <div className="flex-none space-x-2">
            {sortedTags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full bg-neutral-700 text-sm uppercase font-['Space_Mono']"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ImageGridProps {
  imageURLs: string[];
}
function ImageGrid({ imageURLs }: ImageGridProps) {
  let content = (
    <div className="absolute w-full h-full flex justify-center items-center bg-neutral-900">
      <span>No images</span>
    </div>
  );
  if (imageURLs.length === 1) {
    content = (
      <img
        src={imageURLs[0]}
        // TODO: Come up with a better way to do alt tags. Make the user provide
        // them? Maybe the title attached to imgur upload?
        alt="User-uploaded content"
        className="absolute w-full h-full p-1 object-cover bg-neutral-900"
      />
    );
  } else if (imageURLs.length === 2) {
    content = (
      <div className="absolute w-full h-full p-1 grid grid-rows-2 gap-1 bg-neutral-900">
        <img
          src={imageURLs[0]}
          alt="User-uploaded content"
          className="w-full h-full object-cover"
        />
        <img
          src={imageURLs[1]}
          alt="User-uploaded content"
          className="w-full h-full object-cover"
        />
      </div>
    );
  } else if (imageURLs.length === 3) {
    content = (
      <div className="absolute h-full p-1 grid grid-rows-2 grid-cols-2 gap-1 bg-neutral-900">
        <img
          src={imageURLs[0]}
          alt="User-uploaded content"
          className="h-full object-cover"
        />
        <img
          src={imageURLs[1]}
          alt="User-uploaded content"
          className="h-full object-cover"
        />
        <img
          src={imageURLs[2]}
          alt="User-uploaded content"
          className="w-full h-full col-span-2 object-cover"
        />
      </div>
    );
  } else if (imageURLs.length > 3) {
    content = (
      <div className="absolute h-full p-1 grid grid-rows-2 grid-cols-2 gap-1 bg-neutral-900">
        <img
          src={imageURLs[0]}
          alt="User-uploaded content"
          className="h-full object-cover"
        />
        <img
          src={imageURLs[1]}
          alt="User-uploaded content"
          className="h-full object-cover"
        />
        <img
          src={imageURLs[2]}
          alt="User-uploaded content"
          className="h-full object-cover"
        />
        <div className="flex justify-center items-center">
          <span>+{imageURLs.length - 3} more</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-w-[100px] w-1/4 min-h-[100px] after:content-[''] after:block after:pb-[100%]">
      {content}
    </div>
  );
}
