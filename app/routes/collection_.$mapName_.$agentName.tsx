import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { capitalizeWord } from "~/utils";

export const meta: MetaFunction = ({ params }) => {
  const mapName = capitalizeWord(params.mapName!);
  const agentName = capitalizeWord(params.agentName!);
  return [
    {
      title: `ValoBuddy - ${mapName}/${agentName}`,
    },
  ];
};

export default function VodsOrStratsSelect() {
  return (
    <main className="flex grow text-8xl font-medium font-['Impact'] uppercase">
      <div className="w-full grid grid-cols-2">
        <Link
          to="vods"
          className="group flex justify-center items-center hover:bg-green-400 transition"
        >
          <span className="bg-gradient-to-b from-neutral-300 to-white text-transparent bg-clip-text group-hover:text-white transition">
            Vods
          </span>
        </Link>
        <Link
          to="strats"
          className="group flex justify-center items-center hover:bg-valored-500 transition"
        >
          <span className="bg-gradient-to-b from-neutral-300 to-white text-transparent bg-clip-text group-hover:text-white transition">
            Strats
          </span>
        </Link>
      </div>
    </main>
  );
}
