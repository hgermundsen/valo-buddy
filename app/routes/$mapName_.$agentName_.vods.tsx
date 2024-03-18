import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import validator from "validator";

import Filters from "~/components/filters";
import { getVods } from "~/models/vod.server";
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

export async function loader({ params }: LoaderFunctionArgs) {
  // TODO: From a security perspective, is this enough?
  //
  // Should we also be sanitizing the input by removing or escaping dangerous
  // characters? Is it possible for there be some kind of JavaScript code
  // injection here?
  //
  // Consider passing the entire request URL through something like
  // https://github.com/braintree/sanitize-url
  invariant(params.mapName, "Map name not found");
  invariant(params.agentName, "Agent name not found");
  const isMapNameValid = validator.isIn(params.mapName, mapNames);
  const isAgentNameValid = validator.isIn(params.agentName, agentNames);
  if (!isMapNameValid || !isAgentNameValid) {
    // Intentionally being vague with this error message. Something like
    // "Invalid map name" or "Invalid agent name" would indicate to attackers
    // that they're on to something here.
    throw new Response("Not Found", { status: 404 });
  }

  const vods = await getVods({ map: params.mapName, agent: params.agentName });
  return json({ vods });
}

export default function Vods() {
  const data = useLoaderData<typeof loader>();

  return (
    <main className="flex flex-col space-y-16 p-16">
      <section>
        <Form className="flex flex-col space-y-4">
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
              type="text"
              placeholder="Search for anything..."
              className="w-full bg-white/10 p-4"
            />
            <button className="relative px-6 bg-red-400 font-medium font-['Impact'] uppercase tracking-wider bottom-0 left-0 hover:bottom-1 hover:left-1 hover:shadow-[-4px_4px_0_white] transition-all duration-500ms">
              Search
            </button>
          </div>
        </Form>
      </section>
      <section className="flex flex-col space-y-4">
        {data.vods.length === 0 ? (
          <PlaceholderVods />
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

function PlaceholderVods() {
  return (
    <>
      <Vod
        title="VOD Title"
        date={new Date()}
        rank="Diamond 3"
        roundsWon={13}
        roundsLost={15}
        kills={18}
        deaths={21}
        assists={6}
        valoplantLink="https://valoplant.gg/strategy-id"
        trackerLink="https://tracker.gg/valorant/match/aff15759-5c28-4ade-8f7b-93ec72d4b066"
        tags={["Tag Four"]}
        description="Good 1v1s, but overheated too often. Textbook examples of playing off contact. Map awareness sucked in the second half. Pay attention to the enemy's util usage, and reposition depending on who's where."
        unlistedYoutubeVideoURL="https://www.youtube.com/embed/dQw4w9WgXcQ?si=lQBlzJaRwljhksGZ"
      />
      <Vod
        title="VOD Title 2"
        date={new Date()}
        rank="Diamond 2"
        roundsWon={13}
        roundsLost={6}
        kills={12}
        deaths={14}
        assists={11}
        valoplantLink="https://valoplant.gg/strategy-id"
        trackerLink="https://tracker.gg/valorant/match/09131180-fdc6-4254-9b37-9d00bfd25e7e"
        tags={["Tag One", "Tag Five"]}
        description="Got carried ngl but got mine most of the time. Quickly recognized what my job and my place were on our team, and didn't overstep."
        unlistedYoutubeVideoURL="https://www.youtube.com/embed/zf3ETYZl6So?si=u-5MXQPs_wpobi3a"
      />
      <Vod
        title="VOD Title 3"
        date={new Date()}
        rank="Diamond 3"
        roundsWon={13}
        roundsLost={4}
        kills={21}
        deaths={9}
        assists={4}
        valoplantLink="https://valoplant.gg/strategy-id"
        trackerLink="https://tracker.gg/valorant/match/aff15759-5c28-4ade-8f7b-93ec72d4b066"
        tags={["Tag Two"]}
        description="Textbook examples of playing an entry fragger, really demonstrated the fundamentals well. Had good comms re. shot calling and early-round IGLing. We played numbers advantage well."
        unlistedYoutubeVideoURL="https://www.youtube.com/embed/Yg1cviz76dk?si=13sm8KN6udCUsy-9"
      />
    </>
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
            {tags.map((tag) => (
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
