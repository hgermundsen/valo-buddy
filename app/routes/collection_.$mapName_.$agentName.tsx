import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { capitalizeWord } from "~/utils";

export const meta: MetaFunction = ({ params }) => {
  const mapName = capitalizeWord(params.mapName!);
  const agentName = capitalizeWord(params.agentName!);
  return [
    {
      title: `Valo Buddy - ${mapName}/${agentName}`,
    },
  ];
};

export default function VodsOrStratsSelect() {
  return (
    <main className="flex grow text-8xl font-medium font-['Impact'] uppercase">
      <Link
        to="vods"
        className="group flex grow justify-center items-center hover:bg-green-400 transition"
      >
        <span className="bg-gradient-to-b from-neutral-300 to-white text-transparent bg-clip-text group-hover:text-white transition">
          Vods
        </span>
      </Link>
      <Link
        to="strats"
        className="group flex grow justify-center items-center hover:bg-red-400 transition"
      >
        <span className="bg-gradient-to-b from-neutral-300 to-white text-transparent bg-clip-text group-hover:text-white transition">
          Strats
        </span>
      </Link>
    </main>
  );
}
