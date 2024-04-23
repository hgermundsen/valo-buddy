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

import Breadcrumbs from "~/components/breadcrumbs";
import { CancelIcon, PlusIcon, SaveIcon } from "~/components/svgs";
import { createStrat } from "~/models/strat.server";
import { getMapNameAndAgentName } from "~/security";
import { requireUserId } from "~/session.server";

export const meta: MetaFunction = () => {
  return [
    {
      title: "ValoBuddy - Create a Strat",
    },
  ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireUserId(request);
  const { mapName, agentName } = getMapNameAndAgentName(params);
  return json({ mapName, agentName });
}

export async function action({ request, params }: ActionFunctionArgs) {
  // TODO: Input sanitization. Big time.

  const userId = await requireUserId(request);
  const { mapName, agentName } = getMapNameAndAgentName(params);
  const formData = await request.formData();
  const content = Object.fromEntries(formData);

  const title = formData.get("title");
  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { body: null, title: "Title is required" } },
      { status: 400 },
    );
  }

  // TODO: Error handling?
  // TODO: Optimistic UI?
  const newStrat = await createStrat(
    userId,
    mapName,
    agentName,
    title,
    content,
  );

  return redirect(
    `/collection/${params.mapName}/${params.agentName}/strats/${newStrat.id}`,
  );
}

// TODO: Handle 400 response from the action when the title is blank/empty.
export default function CreateStratPage() {
  const navigate = useNavigate();

  const data = useLoaderData<typeof loader>();
  const [
    isLineupsAndAbilityTricksSectionPresent,
    setIsLineupsAndAbilityTricksSectionPresent,
  ] = useState(false);
  const [isEarlyRoundSectionPresent, setIsEarlyRoundSectionPresent] =
    useState(false);
  const [isMidRoundSectionPresent, setIsMidRoundSectionPresent] =
    useState(false);
  const [isLateRoundSectionPresent, setIsLateRoundSectionPresent] =
    useState(false);
  const [isMiscNotesSectionPresent, setIsMiscNotesSectionPresent] =
    useState(false);

  return (
    <Form method="post" className="flex flex-col grow">
      <div className="flex flex-col space-y-4 z-10 sticky top-0 p-4 bg-neutral-900 bg-opacity-[96%]">
        <Breadcrumbs
          mapName={data.mapName}
          agentName={data.agentName}
          resourceName="strats"
        />

        <header className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              name="title"
              placeholder="Strat title"
              aria-label="Strat title"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              className="grow text-5xl font-['Druk_Wide_Bold'] uppercase px-2 py-1 text-neutral-200 placeholder:text-neutral-400 bg-neutral-700 border-b-2 border-neutral-600 outline-none hover:bg-neutral-600 hover:border-neutral-500 focus:bg-neutral-600 focus:border-neutral-500 transition"
            />
            <button
              type="submit"
              className="h-min flex space-x-2 px-4 py-3 text-sm font-['Space_Mono'] text-white bg-gradient-to-r from-red-600 to-valored-500 from-50% to-50% bg-right-bottom bg-[length:200%_100%] outline-none hover:bg-left-bottom hover:text-neutral-900 focus:bg-valored-400 transition-all duration-300 ease-in-out"
            >
              <SaveIcon />
              <span>CREATE</span>
            </button>
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="h-min flex space-x-2 px-4 py-3 text-sm font-['Space_Mono'] text-white bg-gradient-to-r from-red-600 to-valored-500 from-50% to-50% bg-right-bottom bg-[length:200%_100%] outline-none hover:bg-left-bottom hover:text-neutral-900 focus:bg-valored-400 transition-all duration-300 ease-in-out"
            >
              <CancelIcon />
              <span>CANCEL</span>
            </button>
          </div>
          <div>
            <span className="px-4 py-2 rounded-full bg-neutral-700 text-sm uppercase font-['Space_Mono']">
              TODO: Let users add tags here
            </span>
          </div>
        </header>
      </div>

      <main className="flex flex-col space-y-12 px-16 py-4">
        <section>
          <h2 className="text-3xl font-['Druk_Wide_Bold'] uppercase">Links</h2>
          <p>TODO: Let users add misc. links here</p>
        </section>
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
        />
        <TwoColumnSection
          sectionPrefixForInputNames="earlyRound"
          isSectionPresent={isEarlyRoundSectionPresent}
          addSection={() => setIsEarlyRoundSectionPresent(true)}
          attackerSideSection={StratSection.EARLY_ROUND_ATTACKER_SIDE}
          defenderSideSection={StratSection.EARLY_ROUND_DEFENDER_SIDE}
          title="Early Round"
        />
        <TwoColumnSection
          sectionPrefixForInputNames="midRound"
          isSectionPresent={isMidRoundSectionPresent}
          addSection={() => setIsMidRoundSectionPresent(true)}
          attackerSideSection={StratSection.MID_ROUND_ATTACKER_SIDE}
          defenderSideSection={StratSection.MID_ROUND_DEFENDER_SIDE}
          title="Mid Round"
        />
        <TwoColumnSection
          sectionPrefixForInputNames="lateRound"
          isSectionPresent={isLateRoundSectionPresent}
          addSection={() => setIsLateRoundSectionPresent(true)}
          attackerSideSection={StratSection.LATE_ROUND_ATTACKER_SIDE}
          defenderSideSection={StratSection.LATE_ROUND_DEFENDER_SIDE}
          title="Late Round"
        />
        <OneColumnSection
          inputName="miscNotes"
          isSectionPresent={isMiscNotesSectionPresent}
          addSection={() => setIsMiscNotesSectionPresent(true)}
          title="Miscellaneous"
        />
      </main>
    </Form>
  );
}

interface OneColumnSectionProps {
  inputName: string;
  isSectionPresent: boolean;
  addSection(): void;

  title: string;
}
function OneColumnSection(props: OneColumnSectionProps) {
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

  return (
    <section className="flex flex-col space-y-2">
      <h2 className="text-3xl font-['Druk_Wide_Bold'] uppercase">
        {props.title}
      </h2>
      <textarea
        name={props.inputName}
        rows={4}
        className="w-full px-2 py-1 text-neutral-200 bg-neutral-700 border-b-2 border-neutral-600 outline-none hover:bg-neutral-600 hover:border-neutral-500 focus:bg-neutral-600 focus:border-neutral-500 transition"
      />
    </section>
  );
}

interface TwoColumnSectionProps {
  sectionPrefixForInputNames: string;
  isSectionPresent: boolean;
  addSection(): void;

  attackerSideSection: StratSection;
  defenderSideSection: StratSection;
  title: string;
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
          <p>TODO: Let users add images</p>
          <textarea
            name={`${props.sectionPrefixForInputNames}AttackerSideNotes`}
            rows={4}
            className="w-full px-2 py-1 text-neutral-200 bg-neutral-700 border-b-2 border-neutral-600 outline-none hover:bg-neutral-600 hover:border-neutral-500 focus:bg-neutral-600 focus:border-neutral-500 transition"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <h3 className="text-xl text-neutral-400 font-['Space_Mono'] scale-y-125 uppercase">
            Defender Side
          </h3>
          <p>TODO: Let users add images</p>
          <textarea
            name={`${props.sectionPrefixForInputNames}DefenderSideNotes`}
            rows={4}
            className="w-full px-2 py-1 text-neutral-200 bg-neutral-700 border-b-2 border-neutral-600 outline-none hover:bg-neutral-600 hover:border-neutral-500 focus:bg-neutral-600 focus:border-neutral-500 transition"
          />
        </div>
      </div>
    </section>
  );
}
