import { Params } from "@remix-run/react";
import invariant from "tiny-invariant";
import validator from "validator";

const MAP_NAMES = [
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
const AGENT_NAMES = [
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

export function getMapName(params: Params<string>): string {
  // TODO: From a security perspective, is this enough?
  //
  // Should we also be sanitizing the input by removing or escaping dangerous
  // characters? Is it possible for there be some kind of JavaScript code
  // injection here?
  //
  // Consider passing the entire request URL through something like
  // https://github.com/braintree/sanitize-url
  const mapName = params.mapName;
  invariant(mapName, "Map name not found");
  const isMapNameValid = validator.isIn(mapName, MAP_NAMES);
  if (!isMapNameValid) {
    // Intentionally being vague with this error message. Something like
    // "Invalid map name" would indicate to attackers that they're on to
    // something here.
    throw new Response("Not Found", { status: 404 });
  }
  return mapName;
}

export function getAgentName(params: Params<string>): string {
  // TODO: From a security perspective, is this enough?
  //
  // Should we also be sanitizing the input by removing or escaping dangerous
  // characters? Is it possible for there be some kind of JavaScript code
  // injection here?
  //
  // Consider passing the entire request URL through something like
  // https://github.com/braintree/sanitize-url
  const agentName = params.agentName;
  invariant(agentName, "Agent name not found");
  const isAgentNameValid = validator.isIn(agentName, AGENT_NAMES);
  if (!isAgentNameValid) {
    // Intentionally being vague with this error message. Something like
    // "Invalid map name" or "Invalid agent name" would indicate to attackers
    // that they're on to something here.
    throw new Response("Not Found", { status: 404 });
  }
  return agentName;
}

export function getMapNameAndAgentName(params: Params<string>): {
  mapName: string;
  agentName: string;
} {
  const mapName = getMapName(params);
  const agentName = getAgentName(params);
  return { mapName, agentName };
}
