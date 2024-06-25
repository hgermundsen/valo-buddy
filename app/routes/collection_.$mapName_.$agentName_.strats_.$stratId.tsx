import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import Breadcrumbs from "~/components/breadcrumbs";
import Markdown from "~/components/markdown";
import { EditIcon } from "~/components/svgs";
import { getStrat } from "~/models/strat.server";
import { getMapNameAndAgentName } from "~/security";
import { requireUserId } from "~/session.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    {
      // TODO: Is this a helpful title? You're showing IDs, that's not very
      // human-readable...
      title: `${data?.strat.title} - ValoBuddy`,
    },
  ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);

  const { mapName, agentName } = getMapNameAndAgentName(params);

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
    <div className="flex flex-col grow">
      <div className="flex flex-col space-y-2 z-10 sticky top-0 p-4 bg-neutral-900 bg-opacity-[96%]">
        <Breadcrumbs
          mapName={data.mapName}
          agentName={data.agentName}
          resourceName="strats"
        />

        <header className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <h1 className="text-5xl font-['Druk_Wide_Bold'] uppercase">
              {data.strat.title}
            </h1>
            <Link
              to="edit"
              className="h-min flex space-x-2 px-4 py-3 text-sm font-['Space_Mono'] text-white bg-gradient-to-r from-red-600 to-valored-500 from-50% to-50% bg-right-bottom bg-[length:200%_100%] outline-none hover:bg-left-bottom hover:text-neutral-900 focus:bg-valored-400 transition-all duration-300 ease-in-out"
            >
              <EditIcon />
              <span>EDIT</span>
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {sortedTagNames.map((tagName) => (
              <div
                key={tagName}
                className="px-4 py-2 rounded-full bg-neutral-700 text-sm uppercase font-['Space_Mono']"
              >
                {tagName}
              </div>
            ))}
          </div>
        </header>
      </div>

      <main className="flex flex-col space-y-12 px-16 py-4">
        <TwoColumnSection
          attackerSideNotes={data.strat.attackerSideNotes}
          defenderSideNotes={data.strat.defenderSideNotes}
        />
      </main>
    </div>
  );
}
interface TwoColumnSectionProps {
  attackerSideNotes: string | null;
  defenderSideNotes: string | null;
}
function TwoColumnSection({
  attackerSideNotes,
  defenderSideNotes,
}: TwoColumnSectionProps) {
  return (
    <section className="flex flex-col space-y-2">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-['Druk_Wide_Bold'] uppercase underline my-4">
            Attacker Side
          </h2>
          {attackerSideNotes && attackerSideNotes.length > 0 ? (
            <Markdown content={attackerSideNotes}></Markdown>
          ) : (
            <>
              <p className="text-neutral-400 italic">
                No content to show here, add some notes! Markdown is supported.
              </p>
              <img
                alt="Something has gone wrong, there should be something here..."
                src="https://media.tenor.com/EbyOKpncujQAAAAi/john-travolta-tra-jt-transparent.gif"
                className="w-3/4"
              ></img>
            </>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-['Druk_Wide_Bold'] uppercase underline my-4">
            Defender Side
          </h2>
          {defenderSideNotes && defenderSideNotes.length > 0 ? (
            <Markdown content={defenderSideNotes}></Markdown>
          ) : (
            <>
              <p className="text-neutral-400 italic">
                No content to show here, add some notes! Markdown is supported.
              </p>
              <img
                alt="Something has gone wrong, there should be something here..."
                src="https://media.tenor.com/EbyOKpncujQAAAAi/john-travolta-tra-jt-transparent.gif"
                className="w-3/4 scale-x-[-1]"
              ></img>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
