import { ActionFunctionArgs, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import validator from "validator";

import { prisma } from "~/db.server";
import { doesStratBelongToUser } from "~/models/strat.server";
import { requireUserId } from "~/session.server";

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

export async function action({ request, params }: ActionFunctionArgs) {
  // TODO: Input sanitization. Big time.
  // TODO: Abstract it away in one big function. That function can call other
  // functions inside. The objective is to have a one-liner you can just toss
  // inside all your actions that need it (which is a majority of them).

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
  if (!doesStratBelongToUser({ id: stratId, userId })) {
    // Intentionally being vague with this error message. Something like
    // "Invalid map name" or "Invalid agent name" would indicate to attackers
    // that they're on to something here.
    throw new Response("Not Found", { status: 404 });
  }

  const formData = await request.formData();
  const sectionPrefixForInputNames = formData.get("sectionPrefixForInputNames");
  invariant(
    sectionPrefixForInputNames,
    "sectionPrefixForInputNames not found in the request body",
  );

  const attackerSideNotesColumnName = `${sectionPrefixForInputNames}AttackerSideNotes`;
  const defenderSideNotesColumnName = `${sectionPrefixForInputNames}DefenderSideNotes`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = {};
  data[attackerSideNotesColumnName] = "";
  data[defenderSideNotesColumnName] = "";
  await prisma.strat.update({ where: { id: stratId }, data });

  return redirect(
    `/collection/${params.mapName}/${params.agentName}/strats/${stratId}/edit`,
  );
}
