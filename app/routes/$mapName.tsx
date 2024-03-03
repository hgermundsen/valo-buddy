import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { capitalizeWord } from "~/utils";

// Agent images: https://www.valorantpicker.com/#/
import sova from "../images/sova.png";

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
    { name: "Sova", image: sova },
    { name: "Sova", image: sova },
    { name: "Sova", image: sova },
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
            <img src={image} alt={name} />
          </Link>
        ))}
      </div>
    </main>
  );
}
