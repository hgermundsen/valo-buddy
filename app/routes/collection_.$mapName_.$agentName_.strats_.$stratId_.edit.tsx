import { StratSection } from "@prisma/client";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import invariant from "tiny-invariant";
import validator from "validator";

import Breadcrumbs from "~/components/breadcrumbs";
import { CancelIcon, PlusIcon, SaveIcon } from "~/components/svgs";
import {
  doesStratBelongToUser,
  getStrat,
  updateStrat,
} from "~/models/strat.server";
import { requireUserId } from "~/session.server";
import { safeRedirect } from "~/utils";

export const meta: MetaFunction = () => {
  return [
    {
      // TODO: Is this a helpful title?
      title: "ValoBuddy - Edit a Strat",
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

export async function action({ request, params }: ActionFunctionArgs) {
  // TODO: Input sanitization. Big time.

  const userId = await requireUserId(request);
  const stratId = params.stratId;
  invariant(stratId, "Strat ID not found");
  if (!doesStratBelongToUser({ id: stratId, userId })) {
    // Intentionally being vague with this error message. Something like
    // "Invalid map name" or "Invalid agent name" would indicate to attackers
    // that they're on to something here.
    throw new Response("Not Found", { status: 404 });
  }

  const formData = await request.formData();
  // If the user edits a field and ends up retyping the same thing, then that
  // field will appear in this object. Your server function needs to handle
  // that.
  const updates = Object.fromEntries(formData);
  // TODO: Error handling?
  // TODO: Optimistic UI?
  await updateStrat(stratId, updates);

  // It's safe to just include user input in the form of params here. The page
  // we're redirecting to performs input sanitization and validation.
  const correspondingStratDetailPageURL = `/collection/${params.mapName}/${params.agentName}/strats/${params.stratId}`;
  return redirect(safeRedirect(correspondingStratDetailPageURL));
}

export default function EditStratPage() {
  const navigate = useNavigate();
  const data = useLoaderData<typeof loader>();
  const sortedTagNames = data.strat.tags.map((tag) => tag.name).sort();
  const [
    isLineupsAndAbilityTricksSectionPresent,
    setIsLineupsAndAbilityTricksSectionPresent,
  ] = useState(
    data.strat.lineupsAndAbilityTricksAttackerSideNotes !== null ||
      data.strat.lineupsAndAbilityTricksDefenderSideNotes !== null,
  );
  const [isEarlyRoundSectionPresent, setIsEarlyRoundSectionPresent] = useState(
    data.strat.earlyRoundAttackerSideNotes !== null ||
      data.strat.earlyRoundDefenderSideNotes !== null,
  );
  const [isMidRoundSectionPresent, setIsMidRoundSectionPresent] = useState(
    data.strat.midRoundAttackerSideNotes !== null ||
      data.strat.midRoundDefenderSideNotes !== null,
  );
  const [isLateRoundSectionPresent, setIsLateRoundSectionPresent] = useState(
    data.strat.lateRoundAttackerSideNotes !== null ||
      data.strat.lateRoundDefenderSideNotes !== null,
  );

  return (
    <Form method="post" className="flex flex-col grow">
      <div className="flex flex-col space-y-4 z-10 sticky top-0 p-6 bg-neutral-900 bg-opacity-[96%]">
        <Breadcrumbs
          disabled
          mapName={data.mapName}
          agentName={data.agentName}
          resourceName="strats"
        />

        <header className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              name="title"
              aria-label="Strat title"
              defaultValue={data.strat.title}
              className="grow text-5xl font-['Druk_Wide_Bold'] uppercase px-2 py-1 text-neutral-200 bg-neutral-700 border-b-2 border-neutral-600 outline-none hover:bg-neutral-600 hover:border-neutral-500 focus:bg-neutral-600 focus:border-neutral-500 transition"
            />
            <button
              type="submit"
              className="h-min flex space-x-2 px-4 py-3 text-sm font-['Space_Mono'] text-white bg-gradient-to-r from-red-600 to-valored-500 from-50% to-50% bg-right-bottom bg-[length:200%_100%] outline-none hover:bg-left-bottom hover:text-neutral-900 focus:bg-valored-400 transition-all duration-300 ease-in-out"
            >
              <SaveIcon />
              <span>SAVE</span>
            </button>
            <button
              onClick={() =>
                navigate(
                  `/collection/${data.mapName}/${data.agentName}/strats/${data.strat.id}`,
                )
              }
              type="button"
              className="h-min flex space-x-2 px-4 py-3 text-sm font-['Space_Mono'] text-white bg-gradient-to-r from-red-600 to-valored-500 from-50% to-50% bg-right-bottom bg-[length:200%_100%] outline-none hover:bg-left-bottom hover:text-neutral-900 focus:bg-valored-400 transition-all duration-300 ease-in-out"
            >
              <CancelIcon />
              <span>CANCEL</span>
            </button>
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
        {data.strat.miscLinks.length > 0 ? (
          <section>
            <h2 className="text-3xl font-['Druk_Wide_Bold'] uppercase">
              Links
            </h2>
            <ul>
              <div className="grid gap-6 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {data.strat.miscLinks.map((link) => (
                  <li key={link}>{link}</li>
                ))}
              </div>
            </ul>
          </section>
        ) : null}
        <TwoColumnSection
          sectionPrefixForInputNames="lineupsAndAbilityTricks"
          isSectionPresent={isLineupsAndAbilityTricksSectionPresent}
          addSection={() => setIsLineupsAndAbilityTricksSectionPresent(true)}
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
          sectionPrefixForInputNames="earlyRound"
          isSectionPresent={isEarlyRoundSectionPresent}
          addSection={() => setIsEarlyRoundSectionPresent(true)}
          attackerSideSection={StratSection.EARLY_ROUND_ATTACKER_SIDE}
          defenderSideSection={StratSection.EARLY_ROUND_DEFENDER_SIDE}
          title="Early Round"
          images={data.strat.images}
          attackerSideNotes={data.strat.earlyRoundAttackerSideNotes}
          defenderSideNotes={data.strat.earlyRoundDefenderSideNotes}
        />
        <TwoColumnSection
          sectionPrefixForInputNames="midRound"
          isSectionPresent={isMidRoundSectionPresent}
          addSection={() => setIsMidRoundSectionPresent(true)}
          attackerSideSection={StratSection.MID_ROUND_ATTACKER_SIDE}
          defenderSideSection={StratSection.MID_ROUND_DEFENDER_SIDE}
          title="Mid Round"
          images={data.strat.images}
          attackerSideNotes={data.strat.midRoundAttackerSideNotes}
          defenderSideNotes={data.strat.midRoundDefenderSideNotes}
        />
        <TwoColumnSection
          sectionPrefixForInputNames="lateRound"
          isSectionPresent={isLateRoundSectionPresent}
          addSection={() => setIsLateRoundSectionPresent(true)}
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
    </Form>
  );
}

interface StratImage {
  id: string;
  stratSection: StratSection;
  imageURL: string;
}
interface TwoColumnSectionProps {
  sectionPrefixForInputNames: string;
  isSectionPresent: boolean;
  addSection(): void;

  attackerSideSection: StratSection;
  defenderSideSection: StratSection;
  title: string;
  images: StratImage[];
  attackerSideNotes: string | null;
  defenderSideNotes: string | null;
}
function TwoColumnSection(props: TwoColumnSectionProps) {
  if (!props.isSectionPresent) {
    return (
      <div>
        <button
          type="button"
          className="h-min flex space-x-2 px-4 py-3 text-sm font-['Space_Mono'] text-white bg-gradient-to-r from-red-600 to-valored-500 from-50% to-50% bg-right-bottom bg-[length:200%_100%] outline-none hover:bg-left-bottom hover:text-neutral-900 focus:bg-valored-400 transition-all duration-300 ease-in-out"
          onClick={() => props.addSection()}
        >
          <PlusIcon />
          <span className="uppercase">Add {props.title} section</span>
        </button>
      </div>
    );
  }

  const TEXTAREA_MIN_ROWS = 4;
  const attackerSideNotesNumLines =
    props.attackerSideNotes?.split("\n").length || 0;
  const defenderSideNotesNumLines =
    props.defenderSideNotes?.split("\n").length || 0;
  const attackerSideNotesNumRows = Math.max(
    TEXTAREA_MIN_ROWS,
    attackerSideNotesNumLines,
  );
  const defenderSideNotesNumRows = Math.max(
    TEXTAREA_MIN_ROWS,
    defenderSideNotesNumLines,
  );

  return (
    <section className="flex flex-col space-y-2">
      <h2 className="text-3xl font-['Druk_Wide_Bold'] uppercase">
        {props.title}
      </h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col space-y-2">
          <h3 className="text-xl text-neutral-400 font-['Space_Mono'] scale-y-125 uppercase">
            Attacker Side
          </h3>
          <div className="pl-4">
            {props.images
              .filter(
                (image) => image.stratSection === props.attackerSideSection,
              )
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
            <textarea
              name={`${props.sectionPrefixForInputNames}AttackerSideNotes`}
              defaultValue={props.attackerSideNotes || ""}
              rows={attackerSideNotesNumRows}
              className="w-full px-2 py-1 text-neutral-200 bg-neutral-700 border-b-2 border-neutral-600 outline-none hover:bg-neutral-600 hover:border-neutral-500 focus:bg-neutral-600 focus:border-neutral-500 transition"
            />
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <h3 className="text-xl text-neutral-400 font-['Space_Mono'] scale-y-125 uppercase">
            Defender Side
          </h3>
          <div className="pl-4">
            {props.images
              .filter(
                (image) => image.stratSection === props.defenderSideSection,
              )
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
            <textarea
              name={`${props.sectionPrefixForInputNames}DefenderSideNotes`}
              defaultValue={props.defenderSideNotes || ""}
              rows={defenderSideNotesNumRows}
              className="w-full px-2 py-1 text-neutral-200 bg-neutral-700 border-b-2 border-neutral-600 outline-none hover:bg-neutral-600 hover:border-neutral-500 focus:bg-neutral-600 focus:border-neutral-500 transition"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
