import type { MetaFunction } from "@remix-run/node";
import { Form, useParams } from "@remix-run/react";

import Filters from "~/components/filters";
import { capitalizeWord } from "~/utils";

export const meta: MetaFunction = ({ params }) => {
  const mapName = capitalizeWord(params.mapName!);
  const agentName = capitalizeWord(params.agentName!);
  return [
    {
      title: `Valo Buddy - ${mapName}/${agentName}/vods`,
    },
  ];
};

export default function Vods() {
  const { mapName, agentName } = useParams();

  return (
    <main className="p-24">
      <section>
        <Form className="flex flex-col space-y-4">
          <Filters
            filterNames={[
              "Filter One",
              "Filter Two",
              "Filter Three",
              "Filter Four",
              "Filter Five",
              "Filter Six",
            ]}
          />

          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search for anything..."
              className="w-full bg-white/10 p-4"
            />
            <button className="relative px-6 bg-red-400 font-medium font-['Impact'] uppercase tracking-wider bottom-0 left-0 hover:bottom-1 hover:left-1 hover:shadow-[-4px_4px_0_white] transition-all duration-500ms">
              Search
            </button>
          </div>
        </Form>
      </section>
    </main>
  );
}
