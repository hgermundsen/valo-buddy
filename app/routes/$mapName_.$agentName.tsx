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
    <main className="h-full flex justify-center items-center space-x-8 text-4xl font-medium font-['Impact'] uppercase">
      <Link
        to="vods"
        className="relative p-8 bg-red-400 bottom-0 left-0 hover:bottom-1 hover:left-1 hover:shadow-[-4px_4px_0_white] transition-all"
      >
        Vods
      </Link>
      <Link
        to="strats"
        className="relative p-8 bg-red-400 bottom-0 left-0 hover:bottom-1 hover:left-1 hover:shadow-[-4px_4px_0_white] transition-all"
      >
        Strats
      </Link>
    </main>
  );
}
