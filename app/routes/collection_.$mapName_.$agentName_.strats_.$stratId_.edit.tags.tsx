import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
} from "@remix-run/node";
import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import { CloseIcon, CreateIcon } from "~/components/svgs";
import {
  addExistingTagToStrat,
  createNewTagAndAddItToStrat,
  doesStratBelongToUser,
  getAllStratTags,
  getTagsForStrat,
} from "~/models/strat.server";
import { getMapNameAndAgentName } from "~/security";
import { requireUserId } from "~/session.server";

export const meta: MetaFunction = () => {
  return [{ title: "ValoBuddy - Edit Tags" }];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const { mapName, agentName } = getMapNameAndAgentName(params);
  const stratId = params.stratId;
  invariant(stratId, "Strat ID not found");
  // TODO: Sanitize stratId. Even though it's in the URL, it's still user input.

  const tagsForAllStrats = await getAllStratTags(userId, mapName, agentName);
  const tagsForCurStratResponse = await getTagsForStrat(stratId, userId);
  const tagsForCurStrat = tagsForCurStratResponse.tags;
  return json({ tagsForAllStrats, tagsForCurStrat });
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

  if (formData.get("isAddExistingTagToStratOperation") === "true") {
    const tagId = formData.get("tagId");
    if (typeof tagId !== "string" || tagId.length === 0) {
      return json(
        {
          errors: [
            {
              message: `Tag ID to add to strat ID: ${stratId} was not provided`,
            },
          ],
        },
        { status: 400 },
      );
    }

    await addExistingTagToStrat(stratId, tagId);
    return null;
  }

  const newTagName = formData.get("newTagName");
  // TODO: Abstract this type of error handling away in some kinda helper file.
  if (typeof newTagName !== "string" || newTagName.length === 0) {
    return json(
      { errors: [{ message: "New tag name is required" }] },
      { status: 400 },
    );
  }

  await createNewTagAndAddItToStrat(stratId, newTagName);
  return null;
}

export default function EditStratTagsModal() {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const data = useLoaderData<typeof loader>();

  const sortedTagsForCurStrat = data.tagsForCurStrat.sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const idsForCurStratTags = data.tagsForCurStrat.map((tag) => tag.id);
  const sortedTagsForOtherStrats = data.tagsForAllStrats
    .filter((tag) => !idsForCurStratTags.includes(tag.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="relative z-50">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"></div>

      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex items-center justify-center min-h-full">
          <div className="flex flex-col space-y-4 p-4 w-[480px] lg:w-1/2 bg-neutral-800">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-['Druk_Wide_Bold']">EDIT TAGS</h1>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="p-2 border-2 border-neutral-700 bg-gradient-to-r from-red-600 to-neutral-900 from-50% to-50% bg-right-bottom bg-[length:200%_100%] outline-none hover:bg-left-bottom hover:text-neutral-900 hover:border-valored-500 focus:bg-valored-400 transition-all duration-200 ease-in-out"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex flex-col space-y-2">
              <h2 className="text-lg text-neutral-400 font-['Space_Mono'] scale-y-125">
                ATTACHED
              </h2>
              <div className="flex flex-wrap gap-2">
                {sortedTagsForCurStrat.map((tag) => (
                  <div
                    key={tag.id}
                    className="px-4 py-2 rounded-full bg-neutral-700 text-sm uppercase font-['Space_Mono']"
                  >
                    {tag.name}
                  </div>
                ))}
              </div>
              <fetcher.Form
                method="post"
                className="flex justify-between space-x-2"
              >
                <input
                  type="text"
                  name="newTagName"
                  placeholder="New tag name"
                  aria-label="Create a new tag"
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  className="grow p-3 text-neutral-200 uppercase font-['Space_Mono'] placeholder:text-neutral-400 bg-neutral-700 border-b-2 border-neutral-600 outline-none hover:bg-neutral-600 hover:border-neutral-500 focus:bg-neutral-600 focus:border-neutral-500 transition"
                />
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-4 py-3 text-sm font-['Space_Mono'] text-white bg-gradient-to-r from-red-600 to-valored-500 from-50% to-50% bg-right-bottom bg-[length:200%_100%] outline-none hover:bg-left-bottom hover:text-neutral-900 focus:bg-valored-400 transition-all duration-300 ease-in-out"
                >
                  <CreateIcon />
                  <span>CREATE</span>
                </button>
              </fetcher.Form>
            </div>

            {/* TODO: Revisit this purely for style reasons. */}
            <hr className="border border-neutral-700" />

            <div className="flex flex-col space-y-2">
              <h2 className="text-lg text-neutral-400 font-['Space_Mono'] scale-y-125">
                OTHERS
              </h2>
              <div className="flex flex-wrap gap-2">
                {sortedTagsForOtherStrats.map((tag) => (
                  <fetcher.Form method="post" key={tag.id}>
                    <input
                      type="hidden"
                      name="isAddExistingTagToStratOperation"
                      value="true"
                    />
                    <input type="hidden" name="tagId" value={tag.id} />

                    <button
                      type="submit"
                      className="select-none cursor-pointer px-4 py-2 bg-neutral-800 rounded-full ring-1 ring-neutral-500 text-sm font-['Space_Mono'] uppercase hover:ring-2 hover:ring-green-200 transition"
                    >
                      {tag.name}
                    </button>
                  </fetcher.Form>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
