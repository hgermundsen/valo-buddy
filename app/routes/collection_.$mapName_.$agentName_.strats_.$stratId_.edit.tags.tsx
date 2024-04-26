import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getAllStratTags, getTagsForStrat } from "~/models/strat.server";
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

export default function EditStratTagsModal() {
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
          <div className="flex flex-col space-y-2 p-4 w-[480px] lg:w-1/2 bg-neutral-800">
            <h1 className="text-4xl font-['Druk_Wide_Bold']">TAGS</h1>
            <div className="flex space-x-2">
              {sortedTagsForCurStrat.map((tag) => (
                <div
                  key={tag.id}
                  className="px-4 py-2 rounded-full bg-neutral-700 text-sm uppercase font-['Space_Mono']"
                >
                  {tag.name}
                </div>
              ))}
            </div>
            <hr /> {/* TODO: Revisit this purely for style reasons. */}
            <div className="flex space-x-2">
              {sortedTagsForOtherStrats.map((tag) => (
                <div
                  key={tag.id}
                  className="px-4 py-2 rounded-full bg-neutral-700 text-sm uppercase font-['Space_Mono']"
                >
                  {tag.name}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => navigate(-1)}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
