// TODO: Improve search UX: https://remix.run/docs/en/main/start/tutorial#submitting-forms-onchange

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import invariant from "tiny-invariant";
import validator from "validator";

import Filters from "~/components/filters";
import { getVods } from "~/models/vod.server";
import { requireUserId } from "~/session.server";
import { capitalizeWord } from "~/utils";

export const meta: MetaFunction = ({ params }) => {
  const mapName = capitalizeWord(params.mapName!);
  const agentName = capitalizeWord(params.agentName!);
  return [
    {
      title: `Valo Buddy - ${mapName}/${agentName}/vods`,
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
  const q = url.searchParams.get("q");
  // If the user searches for something, then deletes their search, redirect to
  // a URL without the "q" query param.
  if (q !== null && q === "") {
    return redirect("");
  }

  const userId = await requireUserId(request);
  const vods = await getVods({
    userId,
    map: mapName,
    agent: agentName,
    query: q,
  });
  return json({ mapName, agentName, vods, q });
}

export default function Vods() {
  const data = useLoaderData<typeof loader>();
  const submit = useSubmit();

  return (
    <main className="flex flex-col grow space-y-16 p-16">
      <section>
        <Form
          role="search"
          onChange={(event) => {
            const isFirstSearch = data.q === null;
            submit(event.currentTarget, { replace: !isFirstSearch });
          }}
          className="flex flex-col space-y-4"
        >
          <Filters
            filterNames={[
              "Tag One",
              "Tag Two",
              "Tag Three",
              "Tag Four",
              "Tag Five",
              "Tag Six",
            ]}
          />

          <div className="flex space-x-4">
            <input
              type="search"
              name="q"
              placeholder="Search for anything... (Just by title and description for now. Hopefully you'll be able to fuzzy search across all attributes soon)"
              aria-label="Search VODs"
              defaultValue={data.q as string} // TODO: Address this type casting.
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              className="w-full bg-white/10 p-4"
            />
          </div>
        </Form>
      </section>
      <section className="flex flex-col space-y-4">
        {data.vods.length === 0 ? (
          data.q === null ? (
            <p className="text-neutral-400 italic">
              No VODs for {capitalizeWord(data.agentName)} on{" "}
              {capitalizeWord(data.mapName)}
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
              key={vod.title}
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
            <h1 className="text-2xl font-bold">{title}</h1>
            <div className="flex space-x-4">
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
              className="w-max text-blue-500 hover:underline visited:text-purple-500"
            >
              {valoplantLink}
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href={trackerLink}
              className="w-max text-blue-500 hover:underline visited:text-purple-500"
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
