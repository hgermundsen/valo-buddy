import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link, json, useLoaderData, useSubmit } from "@remix-run/react";
import { Fragment } from "react";
import invariant from "tiny-invariant";
import validator from "validator";

import { getStratListItems } from "~/models/strat.server";
import { requireUserId } from "~/session.server";
import { capitalizeWord } from "~/utils";

export const meta: MetaFunction = ({ params }) => {
  const mapName = capitalizeWord(params.mapName!);
  const agentName = capitalizeWord(params.agentName!);
  return [
    {
      title: `Valo Buddy - ${mapName}/${agentName}/strats`,
    },
  ];
};

// TODO: Move these into some utils file.
const mapNames = [
  "ascent",
  "bind",
  "breeze",
  "fracture",
  "haven",
  "icebox",
  "lotus",
  "pearl",
  "split",
  "sunset",
];
const agentNames = [
  "astra",
  "breach",
  "brimstone",
  "chamber",
  "cypher",
  "deadlock",
  "fade",
  "gekko",
  "harbor",
  "iso",
  "jett",
  "kayo",
  "killjoy",
  "neon",
  "omen",
  "phoenix",
  "raze",
  "reyna",
  "sage",
  "skye",
  "sova",
  "viper",
  "yoru",
];

export async function loader({ request, params }: LoaderFunctionArgs) {
  // TODO: From a security perspective, is this enough?
  //
  // Should we also be sanitizing the input by removing or escaping dangerous
  // characters? Is it possible for there be some kind of JavaScript code
  // injection here?
  //
  // Consider passing the entire request URL through something like
  // https://github.com/braintree/sanitize-url
  const mapName = params.mapName;
  const agentName = params.agentName;
  invariant(mapName, "Map name not found");
  invariant(agentName, "Agent name not found");
  const isMapNameValid = validator.isIn(mapName, mapNames);
  const isAgentNameValid = validator.isIn(agentName, agentNames);
  if (!isMapNameValid || !isAgentNameValid) {
    // Intentionally being vague with this error message. Something like
    // "Invalid map name" or "Invalid agent name" would indicate to attackers
    // that they're on to something here.
    throw new Response("Not Found", { status: 404 });
  }

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
  const userId = await requireUserId(request);
  // TODO: Call a more lightweight function that only returns info about strats
  // that we display on this page.
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
  const data = useLoaderData<typeof loader>();
  const tags = data.strats.flatMap((strat) => strat.tags);
  const uniqueTags = new Set(tags);
  const sortedAndUniqueTags = Array.from(uniqueTags).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const submit = useSubmit();

  return (
    <main className="flex flex-col grow space-y-16 px-16 py-8">
      <section className="sticky top-8 w-full p-8 rounded-xl shadow-xl border-solid border-t border-neutral-700 bg-neutral-800">
        <Form
          role="search"
          onChange={(event) => {
            const isFirstSearch = data.q === null;
            submit(event.currentTarget, { replace: !isFirstSearch });
          }}
          className="flex flex-col space-y-4"
        >
          <div className="flex justify-between">
            {/* The "relative -left-4" styles are necessary because "space-x-4"
                gives every child element margin-left: 1rem, except for the
                first one. In our case, the first element is a hidden checkbox.
                The first _visible_ element is the label, and it has left margin
                on it, which we don't want. These two styles offset that. */}
            <div className="flex space-x-4 relative -left-4">
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
                        ? "select-none cursor-pointer px-4 py-2 bg-white/40 rounded-full ring-2 ring-white/40 hover:ring-4 hover:ring-green-200 transition"
                        : "select-none cursor-pointer px-4 py-2 bg-white/10 rounded-full ring-2 ring-white/40 hover:ring-4 hover:ring-green-200 transition"
                    }
                  >
                    {tag.name}
                  </label>
                </Fragment>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <input
              type="search"
              name="q"
              placeholder="Search for anything... (Just by title for now. Hopefully you'll be able to fuzzy search across all attributes soon)"
              aria-label="Search strats"
              defaultValue={data.q as string} // TODO: Address this type casting.
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              className="w-full px-4 py-3 rounded-lg placeholder:italic text-neutral-200 bg-neutral-700 border-t border-neutral-600 outline-none hover:bg-neutral-600 focus:bg-neutral-600 focus:shadow-lg transition"
            />
          </div>
        </Form>
      </section>

      <section className="flex flex-col space-y-4 px-16">
        {data.strats.length === 0 ? (
          data.q === null ? (
            <p className="text-neutral-400 italic">
              No strats for {capitalizeWord(data.agentName)} on{" "}
              {capitalizeWord(data.mapName)}
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
      <div className="flex justify-center items-center bg-white/10 w-48 h-48 text-white/40 italic">
        {/* TODO: Display all of them in some kind of grid. Will have to figure out
        how to dynamically style this depending on the length of the list. */}
        <img src={imageURLs[0]} alt="TODO: Make better" />
      </div>
      <div className="w-full flex flex-col space-y-2">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <Link to={id} className="hover:underline">
              <h1 className="text-2xl font-bold">{title}</h1>
            </Link>
            <div className="flex space-x-4">
              <span className="text-neutral-400">
                Created on {createdAt.toDateString()}, last updated on{" "}
                {updatedAt.toDateString()}
              </span>
            </div>
          </div>
          <div className="flex-none space-x-2">
            {sortedTags.map((tag) => (
              <span key={tag} className="px-4 py-2 rounded-full bg-white/10">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
