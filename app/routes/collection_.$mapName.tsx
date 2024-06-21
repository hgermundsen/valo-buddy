import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, json } from "@remix-run/react";

import Breadcrumbs from "~/components/breadcrumbs";
import { getMapName } from "~/security";
import { capitalizeWord } from "~/utils";

// Agent images: at the bottom of https://valorant.fandom.com/wiki/Agents
// Or from: https://www.valorantpicker.com/#/ (but these are PNGs)
import astra from "../images/agents/astra.webp";
import breach from "../images/agents/breach.webp";
import brimstone from "../images/agents/brimstone.webp";
import chamber from "../images/agents/chamber.webp";
import clove from "../images/agents/clove.webp";
import cypher from "../images/agents/cypher.webp";
import deadlock from "../images/agents/deadlock.webp";
import fade from "../images/agents/fade.webp";
import gekko from "../images/agents/gekko.webp";
import harbor from "../images/agents/harbor.webp";
import iso from "../images/agents/iso.webp";
import jett from "../images/agents/jett.webp";
import kayo from "../images/agents/kayo.webp";
import killjoy from "../images/agents/killjoy.webp";
import neon from "../images/agents/neon.webp";
import omen from "../images/agents/omen.webp";
import phoenix from "../images/agents/phoenix.webp";
import raze from "../images/agents/raze.webp";
import reyna from "../images/agents/reyna.webp";
import sage from "../images/agents/sage.webp";
import skye from "../images/agents/skye.webp";
import sova from "../images/agents/sova.webp";
import viper from "../images/agents/viper.webp";
import yoru from "../images/agents/yoru.webp";

export const meta: MetaFunction = ({ params }) => {
  const mapName = capitalizeWord(params.mapName!);
  return [{ title: `ValoBuddy - ${mapName}` }];
};

export function loader({ params }: LoaderFunctionArgs) {
  const mapName = getMapName(params);
  return json({ mapName });
}

interface Agent {
  name: string;
  image: string;
}

export default function AgentSelect() {
  const agents: Agent[] = [
    { name: "astra", image: astra },
    { name: "breach", image: breach },
    { name: "brimstone", image: brimstone },
    { name: "chamber", image: chamber },
    { name: "clove", image: clove },
    { name: "cypher", image: cypher },
    { name: "deadlock", image: deadlock },
    { name: "fade", image: fade },
    { name: "gekko", image: gekko },
    { name: "harbor", image: harbor },
    { name: "iso", image: iso },
    { name: "jett", image: jett },
    { name: "kayo", image: kayo },
    { name: "killjoy", image: killjoy },
    { name: "neon", image: neon },
    { name: "omen", image: omen },
    { name: "phoenix", image: phoenix },
    { name: "raze", image: raze },
    { name: "reyna", image: reyna },
    { name: "sage", image: sage },
    { name: "skye", image: skye },
    { name: "sova", image: sova },
    { name: "viper", image: viper },
    { name: "yoru", image: yoru },
  ];
  return (
    <>
      <div className="p-4 bg-neutral-900">
        <Breadcrumbs />
      </div>
      <main className="flex grow justify-center items-center">
        <div className="grid grid-cols-9">
          {agents.map(({ name, image }) => (
            <Link
              key={name}
              to={name}
              className="p-1 ring-inset ring-2 ring-white/40 hover:ring-4 hover:ring-green-200 transition"
            >
              <img
                src={image}
                alt={name}
                // Have to do this part with raw CSS, Tailwind doesn't have
                // classes for "mask".
                style={{
                  // https://stackoverflow.com/a/68217932
                  mask: "linear-gradient(-60deg, black 30%, #0008, black 70%) right/350% 100%",
                }}
                className="hover:animate-[shimmer_0.5s]"
                draggable={false}
              />
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
