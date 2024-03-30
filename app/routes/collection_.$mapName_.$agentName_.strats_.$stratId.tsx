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
      title: `Valo Buddy - ${mapName}/${agentName}/strats/${params.stratId!}`,
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
      <nav className="flex space-x-2 text-neutral-400">
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
          {capitalizeWord(data.mapName)}
        </Link>
        <span>&gt;</span>
        <Link
          to={`/collection/${data.mapName}/${data.agentName}`}
          className="text-blue-500 hover:underline visited:text-purple-500"
        >
          {capitalizeWord(data.agentName)}
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
          <button className="h-min px-4 py-2 rounded-lg font-medium text-white bg-valored-500 border-t border-valored-400 outline-none hover:bg-valored-400 focus:bg-valored-400 focus:shadow-lg transition">
            Edit
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
        <h2 className="text-4xl font-medium font-['Impact'] uppercase">
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

      <section>
        <h2 className="text-4xl font-medium font-['Impact'] uppercase">
          Lineups and Agent Tricks
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-2xl font-medium font-['Impact'] uppercase">
              Attacker Side
            </h3>
            <p>{data.strat.lineupsAndAbilityTricksAttackerSideNotes}</p>
          </div>
          <div>
            <h3 className="text-2xl font-medium font-['Impact'] uppercase">
              Defender Side
            </h3>
            <p>{data.strat.lineupsAndAbilityTricksDefenderSideNotes}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-4xl font-medium font-['Impact'] uppercase">
          Early Round
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-2xl font-medium font-['Impact'] uppercase">
              Attacker Side
            </h3>
            <p>{data.strat.earlyRoundAttackerSideNotes}</p>
          </div>
          <div>
            <h3 className="text-2xl font-medium font-['Impact'] uppercase">
              Defender Side
            </h3>
            <p>{data.strat.earlyRoundDefenderSideNotes}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-4xl font-medium font-['Impact'] uppercase">
          Mid Round
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-2xl font-medium font-['Impact'] uppercase">
              Attacker Side
            </h3>
            <p>{data.strat.midRoundAttackerSideNotes}</p>
          </div>
          <div>
            <h3 className="text-2xl font-medium font-['Impact'] uppercase">
              Defender Side
            </h3>
            <p>{data.strat.midRoundDefenderSideNotes}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-4xl font-medium font-['Impact'] uppercase">
          Late Round
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-2xl font-medium font-['Impact'] uppercase">
              Attacker Side
            </h3>
            <p>{data.strat.lateRoundAttackerSideNotes}</p>
          </div>
          <div>
            <h3 className="text-2xl font-medium font-['Impact'] uppercase">
              Defender Side
            </h3>
            <p>{data.strat.lateRoundDefenderSideNotes}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-4xl font-medium font-['Impact'] uppercase">
          Miscellaneous
        </h2>
        <p>{data.strat.miscNotes}</p>
      </section>
    </main>
  );
}
