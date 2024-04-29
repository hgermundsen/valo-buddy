import { ActionFunctionArgs, redirect } from "@remix-run/node";

import { createEmptyStrat } from "~/models/strat.server";
import { getMapNameAndAgentName } from "~/security";
import { requireUserId } from "~/session.server";

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const { mapName, agentName } = getMapNameAndAgentName(params);

  const newEmptyStrat = await createEmptyStrat(mapName, agentName, userId);

  const newEmptyStratPageURL = `/collection/${mapName}/${agentName}/strats/${newEmptyStrat.id}/edit`;
  return redirect(newEmptyStratPageURL);
}
