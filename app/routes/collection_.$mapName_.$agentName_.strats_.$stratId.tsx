import { StratSection } from "@prisma/client";
import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import Breadcrumbs from "~/components/breadcrumbs";
import Markdown from "~/components/markdown";
import { EditIcon } from "~/components/svgs";
import { getStrat } from "~/models/strat.server";
import { getMapNameAndAgentName } from "~/security";
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
      <div className="flex flex-col space-y-4 z-10 sticky top-0 p-6 bg-neutral-900 bg-opacity-[96%]">
        <Breadcrumbs
          mapName={data.mapName}
          agentName={data.agentName}
          resourceName="strats"
        />

        <header className="flex flex-col space-y-4">
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
          <div className="space-x-2">
            {sortedTagNames.map((tagName) => (
              <span
                key={tagName}
                className="px-4 py-2 rounded-full bg-neutral-700 text-sm uppercase font-['Space_Mono']"
              >
                {tagName}
              </span>
            ))}
          </div>
        </header>
      </div>

      <main className="flex flex-col space-y-12 px-16 py-4">
        {/* TODO: Create OneColumnSection component. */}
        {data.strat.miscLinks.length > 0 ? (
          <section>
            <h2 className="text-3xl font-['Druk_Wide_Bold'] uppercase">
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
        ) : null}
        <TwoColumnSection
          attackerSideSection={
            StratSection.LINEUPS_AND_ABILITY_TRICKS_ATTACKER_SIDE
          }
          defenderSideSection={
            StratSection.LINEUPS_AND_ABILITY_TRICKS_DEFENDER_SIDE
          }
          title="Lineups and Ability Tricks"
          images={data.strat.images}
          attackerSideNotes={
            data.strat.lineupsAndAbilityTricksAttackerSideNotes
          }
          defenderSideNotes={
            data.strat.lineupsAndAbilityTricksDefenderSideNotes
          }
        />
        <TwoColumnSection
          attackerSideSection={StratSection.EARLY_ROUND_ATTACKER_SIDE}
          defenderSideSection={StratSection.EARLY_ROUND_DEFENDER_SIDE}
          title="Early Round"
          images={data.strat.images}
          attackerSideNotes={data.strat.earlyRoundAttackerSideNotes}
          defenderSideNotes={data.strat.earlyRoundDefenderSideNotes}
        />
        <TwoColumnSection
          attackerSideSection={StratSection.MID_ROUND_ATTACKER_SIDE}
          defenderSideSection={StratSection.MID_ROUND_DEFENDER_SIDE}
          title="Mid Round"
          images={data.strat.images}
          attackerSideNotes={data.strat.midRoundAttackerSideNotes}
          defenderSideNotes={data.strat.midRoundDefenderSideNotes}
        />
        <TwoColumnSection
          attackerSideSection={StratSection.LATE_ROUND_ATTACKER_SIDE}
          defenderSideSection={StratSection.LATE_ROUND_DEFENDER_SIDE}
          title="Late Round"
          images={data.strat.images}
          attackerSideNotes={data.strat.lateRoundAttackerSideNotes}
          defenderSideNotes={data.strat.lateRoundDefenderSideNotes}
        />
        {data.strat.miscNotes !== null ? (
          <section className="flex flex-col space-y-2">
            <h2 className="text-3xl font-['Druk_Wide_Bold'] uppercase">
              Miscellaneous
            </h2>
            <p>{data.strat.miscNotes}</p>
          </section>
        ) : null}
      </main>
    </div>
  );
}

interface StratImage {
  id: string;
  stratSection: StratSection;
  imageURL: string;
}
interface TwoColumnSectionProps {
  attackerSideSection: StratSection;
  defenderSideSection: StratSection;
  title: string;
  images: StratImage[];
  attackerSideNotes: string | null;
  defenderSideNotes: string | null;
}
function TwoColumnSection({
  attackerSideSection,
  defenderSideSection,
  title,
  images,
  attackerSideNotes,
  defenderSideNotes,
}: TwoColumnSectionProps) {
  if (attackerSideNotes === null && defenderSideNotes === null) {
    return null;
  }
  return (
    <section className="flex flex-col space-y-2">
      <h2 className="text-3xl font-['Druk_Wide_Bold'] uppercase">{title}</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col space-y-2">
          <h3 className="text-xl text-neutral-400 font-['Space_Mono'] scale-y-125 uppercase">
            Attacker Side
          </h3>
          {images
            .filter((image) => image.stratSection === attackerSideSection)
            .map((image) => (
              <img
                key={image.id}
                src={image.imageURL}
                // TODO: Come up with a better way to do alt tags. Make the
                // user provide them? Maybe the title attached to imgur
                // upload?
                alt="User-uploaded content"
              />
            ))}

          {attackerSideNotes && attackerSideNotes.length > 0 ? (
            <Markdown content={attackerSideNotes} />
          ) : (
            <p className="text-neutral-400 italic">No content.</p>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <h3 className="text-xl text-neutral-400 font-['Space_Mono'] scale-y-125 uppercase">
            Defender Side
          </h3>
          {images
            .filter((image) => image.stratSection === defenderSideSection)
            .map((image) => (
              <img
                key={image.id}
                src={image.imageURL}
                // TODO: Come up with a better way to do alt tags. Make the
                // user provide them? Maybe the title attached to imgur
                // upload?
                alt="User-uploaded content"
              />
            ))}

          {defenderSideNotes && defenderSideNotes.length > 0 ? (
            <Markdown content={defenderSideNotes} />
          ) : (
            <p className="text-neutral-400 italic">No content.</p>
          )}
        </div>
      </div>
    </section>
  );
}
