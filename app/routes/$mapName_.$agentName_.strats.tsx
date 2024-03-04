import type { MetaFunction } from "@remix-run/node";
import { useParams } from "@remix-run/react";

import { capitalizeWord } from "~/utils";

export const meta: MetaFunction = ({ params }) => {
  const mapName = capitalizeWord(params.mapName!);
  const agentName = capitalizeWord(params.agentName!);
  return [
    {
      title: `Valo Buddy - ${mapName}/${agentName}/strats`,
    },
  ];
};

export default function Strats() {
  const { mapName, agentName } = useParams();

  return (
    <main className="p-24">
      <p>
        Strats for {agentName!} on {mapName!}
      </p>
    </main>
  );
}
