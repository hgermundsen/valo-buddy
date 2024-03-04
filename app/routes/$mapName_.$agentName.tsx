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
    <main className="h-full flex justify-center items-center space-x-8 text-4xl font-medium font-['Impact'] uppercase tracking-wide">
      <Link
        to="vods"
        className="px-8 py-6 ring-2 ring-white/40 hover:ring-4 hover:ring-green-200 hover:bg-white/10 transition"
      >
        Vods
      </Link>
      <Link
        to="strats"
        className="px-8 py-6 ring-2 ring-white/40 hover:ring-4 hover:ring-green-200 hover:bg-white/10 transition"
      >
        Strats
      </Link>
    </main>
  );
}
