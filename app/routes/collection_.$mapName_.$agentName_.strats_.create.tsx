import { ActionFunctionArgs, redirect } from "@remix-run/node";

import { createEmptyStrat } from "~/models/strat.server";
import { getMapNameAndAgentName } from "~/security";
import { requireUserId, sessionStorage } from "~/session.server";

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const { mapName, agentName } = getMapNameAndAgentName(params);

  const session = await sessionStorage.getSession(
    request.headers.get("Cookie"),
  );

  const newEmptyStrat = await createEmptyStrat(mapName, agentName, userId);
  // The "edit strats" page looks for this key/value pair on the session cookie.
  // It renders slightly different content if it's present.
  session.set("isNewlyCreatedStrat", true);

  const newEmptyStratPageURL = `/collection/${mapName}/${agentName}/strats/${newEmptyStrat.id}/edit`;
  return redirect(newEmptyStratPageURL, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}
