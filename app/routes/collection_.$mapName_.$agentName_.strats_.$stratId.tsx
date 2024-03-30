import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import validator from "validator";

import { getStrat } from "~/models/strat.server";
import { requireUserId } from "~/session.server";
import { capitalizeWord } from "~/utils";

export const meta: MetaFunction = ({ params }) => {
  const mapName = capitalizeWord(params.mapName!);
  const agentName = capitalizeWord(params.agentName!);
  return [
    {
      // TODO: Is this a helpful title? You're showing IDs, that's not very
      // human-readable...
      title: `ValoBuddy - ${mapName}/${agentName}/strats/${params.stratId!}`,
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
  const userId = await requireUserId(request);

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

  const stratId = params.stratId;
  invariant(stratId, "Strat ID not found");
  // TODO: Sanitize stratId. Even though it's in the URL, it's still user input.
  const strat = await getStrat({ id: stratId, userId });
  if (!strat) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ mapName, agentName, strat });
}

export default function StratDetailsPage() {
  const data = useLoaderData<typeof loader>();

  const sortedTagNames = data.strat.tags.map((tag) => tag.name).sort();

  return (
    <main className="flex flex-col grow px-16 py-8 space-y-8">
      <nav className="flex space-x-2 text-neutral-400 text-sm font-['Space_Mono'] scale-y-110 uppercase">
        <Link
          to="/collection"
          className="text-blue-500 hover:underline visited:text-purple-500"
        >
          Collection
        </Link>
        <span>&gt;</span>
        <Link
          to={`/collection/${data.mapName}`}
          className="text-blue-500 hover:underline visited:text-purple-500"
        >
          {data.mapName}
        </Link>
        <span>&gt;</span>
        <Link
          to={`/collection/${data.mapName}/${data.agentName}`}
          className="text-blue-500 hover:underline visited:text-purple-500"
        >
          {data.agentName}
        </Link>
        <span>&gt;</span>
        <Link
          to={`/collection/${data.mapName}/${data.agentName}/strats`}
          className="text-blue-500 hover:underline visited:text-purple-500"
        >
          Strats
        </Link>
      </nav>

      <header className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <h1 className="text-6xl font-medium font-['Impact'] uppercase">
            {data.strat.title}
          </h1>
          <button className="h-min flex space-x-2 px-5 py-3 font-['Space_Mono'] text-white bg-gradient-to-r from-valored-500 to-red-600 from-50% to-50% bg-left-bottom bg-[length:200%_100%] outline-none hover:bg-right-bottom hover:text-neutral-900 focus:bg-valored-400 transition-all duration-300 ease-in-out">
            {/* btw this came from https://flowbite.com/icons/ */}
            {/* TODO: Consider moving this into some kind of shared component.
            /components/icons folder, maybe? */}
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="butt"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
              />
            </svg>
            <span>Edit</span>
          </button>
        </div>
        <div className="space-x-2">
          {sortedTagNames.map((tagName) => (
            <span key={tagName} className="px-4 py-2 rounded-full bg-white/10">
              {tagName}
            </span>
          ))}
        </div>
      </header>

      <section>
        <h2 className="text-3xl font-['Space_Mono'] scale-y-125 uppercase">
          Links
        </h2>
        {data.strat.miscLinks.length === 0 ? (
          <p className="text-neutral-400 italic">No content.</p>
        ) : (
          <ul>
            <div className="grid gap-6 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {data.strat.miscLinks.map((link) => (
                <li key={link}>{link}</li>
              ))}
            </div>
          </ul>
        )}
      </section>

      <section className="flex flex-col space-y-2">
        <h2 className="text-3xl font-['Space_Mono'] scale-y-125 uppercase">
          Lineups and Agent Tricks
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <h3 className="text-xl text-neutral-400 font-['Space_Mono'] scale-y-125 uppercase">
              Attacker Side
            </h3>
            <p>{data.strat.lineupsAndAbilityTricksAttackerSideNotes}</p>
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className="text-xl text-neutral-400 font-['Space_Mono'] scale-y-125 uppercase">
              Defender Side
            </h3>
            <p>{data.strat.lineupsAndAbilityTricksDefenderSideNotes}</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col space-y-2">
        <h2 className="text-3xl font-['Space_Mono'] scale-y-125 uppercase">
          Early Round
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <h3 className="text-xl text-neutral-400 font-['Space_Mono'] scale-y-125 uppercase">
              Attacker Side
            </h3>
            <p>{data.strat.earlyRoundAttackerSideNotes}</p>
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className="text-xl text-neutral-400 font-['Space_Mono'] scale-y-125 uppercase">
              Defender Side
            </h3>
            <p>{data.strat.earlyRoundDefenderSideNotes}</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col space-y-2">
        <h2 className="text-3xl font-['Space_Mono'] scale-y-125 uppercase">
          Mid Round
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <h3 className="text-xl text-neutral-400 font-['Space_Mono'] scale-y-125 uppercase">
              Attacker Side
            </h3>
            <p>{data.strat.midRoundAttackerSideNotes}</p>
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className="text-xl text-neutral-400 font-['Space_Mono'] scale-y-125 uppercase">
              Defender Side
            </h3>
            <p>{data.strat.midRoundDefenderSideNotes}</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col space-y-2">
        <h2 className="text-3xl font-['Space_Mono'] scale-y-125 uppercase">
          Late Round
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <h3 className="text-xl text-neutral-400 font-['Space_Mono'] scale-y-125 uppercase">
              Attacker Side
            </h3>
            <p>{data.strat.lateRoundAttackerSideNotes}</p>
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className="text-xl text-neutral-400 font-['Space_Mono'] scale-y-125 uppercase">
              Defender Side
            </h3>
            <p>{data.strat.lateRoundDefenderSideNotes}</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col space-y-2">
        <h2 className="text-3xl font-['Space_Mono'] scale-y-125 uppercase">
          Miscellaneous
        </h2>
        <p>{data.strat.miscNotes}</p>
      </section>
    </main>
  );
}
