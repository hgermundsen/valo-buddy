import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { capitalizeWord } from "~/utils";

// Agent images: at the bottom of https://valorant.fandom.com/wiki/Iso
// Or from: https://www.valorantpicker.com/#/ (but these are PNGs)
import astra from "../images/agents/astra.webp";
import breach from "../images/agents/breach.webp";
import brimstone from "../images/agents/brimstone.webp";
import chamber from "../images/agents/chamber.webp";
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
  return [{ title: `Valo Buddy - ${mapName}` }];
};

interface Agent {
  name: string;
  image: string;
}

export default function AgentSelect() {
  const agents: Agent[] = [
    { name: "Astra", image: astra },
    { name: "Breach", image: breach },
    { name: "Brimstone", image: brimstone },
    { name: "Chamber", image: chamber },
    { name: "Cypher", image: cypher },
    { name: "Deadlock", image: deadlock },
    { name: "Fade", image: fade },
    { name: "Gekko", image: gekko },
    { name: "Harbor", image: harbor },
    { name: "Iso", image: iso },
    { name: "Jett", image: jett },
    { name: "KAYO", image: kayo },
    { name: "Killjoy", image: killjoy },
    { name: "Neon", image: neon },
    { name: "Omen", image: omen },
    { name: "Phoenix", image: phoenix },
    { name: "Raze", image: raze },
    { name: "Reyna", image: reyna },
    { name: "Sage", image: sage },
    { name: "Skye", image: skye },
    { name: "Sova", image: sova },
    { name: "Viper", image: viper },
    { name: "Yoru", image: yoru },
  ];
  return (
    <main className="h-full flex justify-center items-center">
      <div className="grid grid-cols-9">
        {agents.map(({ name, image }) => (
          <Link
            key={name}
            to={name.toLowerCase()}
            className="p-1 ring-inset ring-2 ring-white/40 hover:ring-4 hover:ring-green-200 transition"
          >
            <img
              src={image}
              alt={name}
              // Have to do this part with raw CSS, Tailwind doesn't have
              // classes for "mask".
              style={{
                // https: //stackoverflow.com/a/68217932
                mask: "linear-gradient(-60deg, black 30%, #0008, black 70%) right/350% 100%",
              }}
              className="hover:animate-[shimmer_0.5s]"
            />
          </Link>
        ))}
      </div>
    </main>
  );
}
