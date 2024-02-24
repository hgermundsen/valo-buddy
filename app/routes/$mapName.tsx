import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { capitalizeWord } from "~/utils";

export const meta: MetaFunction = ({ params }) => {
  const mapName = capitalizeWord(params.mapName!);
  return [{ title: `Valo Buddy - ${mapName}` }];
};

export default function AgentSelect() {
  return (
    <main>
      <main className="p-24">
        <ul>
          <li>
            <Link to="sova">Sova</Link>
          </li>
          <li>
            <Link to="killjoy">Killjoy</Link>
          </li>
        </ul>
      </main>
    </main>
  );
}
