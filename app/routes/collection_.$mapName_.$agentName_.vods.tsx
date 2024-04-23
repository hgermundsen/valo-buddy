// TODO: Improve search UX: https://remix.run/docs/en/main/start/tutorial#submitting-forms-onchange

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { Fragment } from "react";

import { getVodListItems } from "~/models/vod.server";
import { getMapNameAndAgentName } from "~/security";
import { requireUserId } from "~/session.server";
import { capitalizeWord } from "~/utils";

export const meta: MetaFunction = ({ params }) => {
  const mapName = capitalizeWord(params.mapName!);
  const agentName = capitalizeWord(params.agentName!);
  return [
    {
      title: `ValoBuddy - ${mapName}/${agentName}/vods`,
    },
  ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);

  const { mapName, agentName } = getMapNameAndAgentName(params);

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
  const vods = await getVodListItems({
    userId,
    map: mapName,
    agent: agentName,
    query: q,
    tagIds: selectedTagIds,
  });

  return json({ mapName, agentName, vods, q, selectedTagIds });
}

export default function Vods() {
  const data = useLoaderData<typeof loader>();
  const tags = data.vods.flatMap((vod) => vod.tags);
  const uniqueTags = new Set(tags);
  const sortedAndUniqueTags = Array.from(uniqueTags).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const submit = useSubmit();

  return (
    <main className="flex flex-col grow space-y-16 px-16 py-8">
      <section className="z-10 sticky top-8 w-full p-8 rounded-xl shadow-xl border-solid border-t border-neutral-700 bg-neutral-800">
        <Form
          role="search"
          onChange={(event) => {
            const isFirstSearch = data.q === undefined;
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
              placeholder="Search for anything... (Just by title and description for now. Hopefully you'll be able to fuzzy search across all attributes soon)"
              aria-label="Search VODs"
              defaultValue={data.q as string} // TODO: Address this type casting.
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              className="w-full px-4 py-3 rounded-lg placeholder:italic text-neutral-200 bg-neutral-700 border-t border-neutral-600 outline-none hover:bg-neutral-600 focus:bg-neutral-600 focus:shadow-lg transition"
            />
          </div>
        </Form>
      </section>

      <section className="flex flex-col space-y-4 px-16">
        {data.vods.length === 0 ? (
          data.q === undefined ? (
            <p className="text-neutral-400 italic">
              No VODs for {capitalizeWord(data.agentName)} on{" "}
              {capitalizeWord(data.mapName)}.
            </p>
          ) : (
            <p className="text-neutral-400 italic">
              No VODs for {capitalizeWord(data.agentName)} on{" "}
              {capitalizeWord(data.mapName)} which match that search query.
            </p>
          )
        ) : (
          data.vods.map((vod) => (
            <Vod
              key={vod.id}
              title={vod.title}
              date={new Date(vod.date)}
              rank={vod.rank}
              roundsWon={vod.roundsWon}
              roundsLost={vod.roundsLost}
              kills={vod.kills}
              deaths={vod.deaths}
              assists={vod.assists}
              valoplantLink={vod.valoplantLink}
              trackerLink={vod.trackerLink}
              tags={vod.tags.map((tag) => tag.name)}
              description={vod.description}
              unlistedYoutubeVideoURL={vod.unlistedYoutubeVideoURL}
            />
          ))
        )}
      </section>
    </main>
  );
}

interface VodProps {
  title: string;
  date: Date;
  rank: string;
  roundsWon: number;
  roundsLost: number;
  kills: number;
  deaths: number;
  assists: number;
  valoplantLink: string;
  trackerLink: string;
  tags: string[];
  description: string;
  unlistedYoutubeVideoURL?: string;
}
function Vod({
  title,
  date,
  rank,
  roundsWon,
  roundsLost,
  kills,
  deaths,
  assists,
  valoplantLink,
  trackerLink,
  tags,
  description,
  unlistedYoutubeVideoURL,
}: VodProps) {
  const sortedTags = tags.sort();

  return (
    <div className="flex space-x-4">
      {unlistedYoutubeVideoURL ? (
        <iframe
          width="640"
          height="270"
          src={unlistedYoutubeVideoURL}
          title={title}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      ) : (
        <div className="flex justify-center items-center bg-white/10 w-[560px] h-[315px] text-white/40 italic">
          VOD Thumbnail
        </div>
      )}
      <div className="w-full flex flex-col space-y-2">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <h1 className="font-['Space_Mono'] text-2xl">{title}</h1>
            <div className="flex space-x-4 font-['Space_Mono']">
              <span className="text-white/40">{date.toDateString()}</span>
              <span className="text-white/40">{rank}</span>
              <span className="text-white/40">
                {roundsWon}/{roundsLost}
              </span>
              <span className="text-white/40">
                {kills}/{deaths}/{assists}
              </span>
            </div>
            <a
              target="_blank"
              rel="noreferrer"
              href={valoplantLink}
              className="w-max font-['Space_Mono'] text-blue-500 hover:underline visited:text-purple-500"
            >
              {valoplantLink}
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href={trackerLink}
              className="w-max font-['Space_Mono'] text-blue-500 hover:underline visited:text-purple-500"
            >
              {trackerLink}
            </a>
          </div>
          <div className="flex-none space-x-2">
            {sortedTags.map((tag) => (
              <span key={tag} className="px-4 py-2 rounded-full bg-white/10">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <p>{description}</p>
      </div>
    </div>
  );
}
