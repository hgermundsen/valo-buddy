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
    <main>
      <main className="p-24">
        <ul>
          <li>
            <Link to="vods">Vods</Link>
          </li>
          <li>
            <Link to="strats">Strats</Link>
          </li>
        </ul>
      </main>
    </main>
  );
}
