import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import Breadcrumbs from "~/components/breadcrumbs";
import { CancelIcon, SaveIcon } from "~/components/svgs";
import {
  deleteStrat,
  doesStratBelongToUser,
  getStrat,
  updateStrat,
} from "~/models/strat.server";
import { getMapNameAndAgentName } from "~/security";
import { requireUserId, sessionStorage } from "~/session.server";

export const meta: MetaFunction = () => {
  return [
    {
      // TODO: Is this a helpful title?
      title: "ValoBuddy - Edit a Strat",
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

  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );
  const isNewlyCreatedStrat: boolean | null =
    session.get("isNewlyCreatedStrat") || null;
  return json({ mapName, agentName, strat, isNewlyCreatedStrat });
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

  // If it's present, remove the "isNewlyCreatedStrat" key from the session
  // cookie. This is the right time to do it: the user is either saving the
  // changes they've made to the newly-created blank strat (just creating it as
  // far as they're is concerned), or canceling.
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );

  const formData = await request.formData();

  if (formData.get("_action") === "cancel") {
    if (session.has("isNewlyCreatedStrat")) {
      session.unset("isNewlyCreatedStrat");

      await deleteStrat(stratId, userId);

      // It's safe to just include user input in the form of params here. The page
      // we're redirecting to performs input sanitization and validation.
      const correspondingStratsPageURL = `/collection/${params.mapName}/${params.agentName}/strats`;
      return redirect(correspondingStratsPageURL, {
        // In case we removed the "isNewlyCreatedStrat" key/value pair, make sure
        // that's committed.
        headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
      });
    } else {
      // It's safe to just include user input in the form of params here. The page
      // we're redirecting to performs input sanitization and validation.
      const correspondingStratDetailPageURL = `/collection/${params.mapName}/${params.agentName}/strats/${params.stratId}`;
      return redirect(correspondingStratDetailPageURL);
    }
  }

  // If the user edits a field and ends up retyping the same thing, then that
  // field will appear in this object. The server function handles this.
  const updates = Object.fromEntries(formData);

  // Define the regex pattern to match Markdown image links
  const imageLinkRegex = /!\[.*?\]\((.*?)\)/g;

  // Extract image URLs from attackerSideNotes and defenderSideNotes
  const attackerImageURLs =
    updates.attackerSideNotes
      .toString()
      .match(imageLinkRegex)
      ?.map((match) => match.replace(imageLinkRegex, "$1")) || [];
  const defenderImageURLs =
    updates.defenderSideNotes
      .toString()
      .match(imageLinkRegex)
      ?.map((match) => match.replace(imageLinkRegex, "$1")) || [];

  // Combine both arrays of image URLs
  const allImageURLs = [...attackerImageURLs, ...defenderImageURLs];

  // Append the first 3 image URLs into the stratImageUrls field
  const stratImageUrls = allImageURLs.slice(0, 3);

  // Update the numImages field with the total number of image URLs found
  const numImages = allImageURLs.length;

  const imageUpdates = {
    ...updates,
    stratImageUrls: stratImageUrls,
    numImages: numImages,
  };
  await updateStrat(stratId, imageUpdates);

  if (session.has("isNewlyCreatedStrat")) {
    session.unset("isNewlyCreatedStrat");
  }

  // It's safe to just include user input in the form of params here. The page
  // we're redirecting to performs input sanitization and validation.
  const correspondingStratDetailPageURL = `/collection/${params.mapName}/${params.agentName}/strats/${params.stratId}`;
  return redirect(correspondingStratDetailPageURL, {
    // In case we removed the "isNewlyCreatedStrat" key/value pair, make sure
    // that's committed.
    headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
  });
}

export default function EditStratPage() {
  const navigate = useNavigate();

  const data = useLoaderData<typeof loader>();
  const sortedTagNames = data.strat.tags.map((tag) => tag.name).sort();

  return (
    <>
      <Outlet />

      <Form method="post" className="flex flex-col grow">
        <div className="flex flex-col space-y-2 z-10 sticky top-0 p-4 bg-neutral-900 bg-opacity-[96%]">
          <Breadcrumbs
            disabled
            mapName={data.mapName}
            agentName={data.agentName}
            resourceName="strats"
          />

          <header className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                name="title"
                aria-label="Strat title"
                defaultValue={data.strat.title}
                placeholder="Strat title"
                className="grow text-5xl font-['Druk_Wide_Bold'] uppercase px-2 py-1 text-neutral-200 placeholder:text-neutral-400 bg-neutral-700 border-b-2 border-neutral-600 outline-none hover:bg-neutral-600 hover:border-neutral-500 focus:bg-neutral-600 focus:border-neutral-500 transition"
              />
              <button
                type="submit"
                className="h-min flex space-x-2 px-4 py-3 text-sm font-['Space_Mono'] text-white bg-gradient-to-r from-red-600 to-valored-500 from-50% to-50% bg-right-bottom bg-[length:200%_100%] outline-none hover:bg-left-bottom hover:text-neutral-900 focus:bg-valored-400 transition-all duration-300 ease-in-out"
              >
                <SaveIcon />
                <span>SAVE</span>
              </button>

              {/* If we're currently editing an newly-created strat, then that
                  means we need to delete it if we click the "cancel" button
                  (trigger the action). Otherwise, we can just navigate back one
                  page, which doesn't involve going out to the network, and is
                  much snappier. */}
              {data.isNewlyCreatedStrat ? (
                <Form method="post">
                  <input type="hidden" name="_action" value="cancel" />
                  <button
                    type="submit"
                    className="h-min flex space-x-2 px-4 py-3 text-sm font-['Space_Mono'] text-white bg-gradient-to-r from-red-600 to-valored-500 from-50% to-50% bg-right-bottom bg-[length:200%_100%] outline-none hover:bg-left-bottom hover:text-neutral-900 focus:bg-valored-400 transition-all duration-300 ease-in-out"
                  >
                    <CancelIcon />
                    <span>CANCEL</span>
                  </button>
                </Form>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="h-min flex space-x-2 px-4 py-3 text-sm font-['Space_Mono'] text-white bg-gradient-to-r from-red-600 to-valored-500 from-50% to-50% bg-right-bottom bg-[length:200%_100%] outline-none hover:bg-left-bottom hover:text-neutral-900 focus:bg-valored-400 transition-all duration-300 ease-in-out"
                >
                  <CancelIcon />
                  <span>CANCEL</span>
                </button>
              )}
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
              <Link
                to="tags"
                className="px-4 py-2 rounded-full bg-valored-500 text-sm font-['Space_Mono'] text-white bg-gradient-to-r from-red-600 to-valored-500 from-50% to-50% bg-right-bottom bg-[length:200%_100%] outline-none hover:bg-left-bottom hover:text-neutral-900 focus:bg-valored-400 transition-all duration-300 ease-in-out"
              >
                EDIT TAGS
              </Link>
            </div>
          </header>
        </div>

        <main className="flex flex-col space-y-12 px-16 py-4">
          <TwoColumnSection
            attackerSideNotes={data.strat.attackerSideNotes}
            defenderSideNotes={data.strat.defenderSideNotes}
          />
          {!data.isNewlyCreatedStrat ? (
            <Link
              to="delete"
              className="h-min px-4 py-3 text-center text-sm font-['Space_Mono'] text-valored-500 border-2 border-neutral-700 bg-gradient-to-t from-red-600 to-neutral-900 from-50% to-50% bg-top bg-[length:100%_200%] outline-none hover:bg-bottom hover:text-neutral-900 hover:border-valored-500 focus:bg-valored-400 transition-all duration-300 ease-in-out"
            >
              DELETE STRAT
            </Link>
          ) : null}
        </main>
      </Form>
    </>
  );
}

const TEXTAREA_MIN_ROWS = 4;
interface TwoColumnSectionProps {
  attackerSideNotes: string | null;
  defenderSideNotes: string | null;
}
function TwoColumnSection(props: TwoColumnSectionProps) {
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
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-['Druk_Wide_Bold'] uppercase">
            Attacker Side
          </h2>
          <textarea
            name={"attackerSideNotes"}
            defaultValue={props.attackerSideNotes || ""}
            placeholder="Write anything. Markdown is supported."
            rows={attackerSideNotesNumRows}
            className="w-full px-2 py-1 text-neutral-200 placeholder:text-neutral-400 placeholder:italic bg-neutral-700 border-b-2 border-neutral-600 outline-none hover:bg-neutral-600 hover:border-neutral-500 focus:bg-neutral-600 focus:border-neutral-500 transition"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-['Druk_Wide_Bold'] uppercase">
            Defender Side
          </h2>
          <textarea
            name={"defenderSideNotes"}
            defaultValue={props.defenderSideNotes || ""}
            placeholder="Write anything. Markdown is supported."
            rows={defenderSideNotesNumRows}
            className="w-full px-2 py-1 text-neutral-200 placeholder:text-neutral-400 placeholder:italic bg-neutral-700 border-b-2 border-neutral-600 outline-none hover:bg-neutral-600 hover:border-neutral-500 focus:bg-neutral-600 focus:border-neutral-500 transition"
          />
        </div>
      </div>
    </section>
  );
}
