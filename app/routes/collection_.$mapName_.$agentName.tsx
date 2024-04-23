import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, json, useLoaderData } from "@remix-run/react";

import Breadcrumbs from "~/components/breadcrumbs";
import { getMapNameAndAgentName } from "~/security";
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

export function loader({ params }: LoaderFunctionArgs) {
  const { mapName, agentName } = getMapNameAndAgentName(params);
  return json({ mapName, agentName });
}

export default function VodsOrStratsSelect() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <div className="p-4 bg-neutral-900">
        <Breadcrumbs mapName={data.mapName} />
      </div>
      <main className="flex grow text-6xl font-['Druk_Wide_Bold'] uppercase">
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
    </>
  );
}
