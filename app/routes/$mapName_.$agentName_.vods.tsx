import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form } from "@remix-run/react";
import invariant from "tiny-invariant";
import validator from "validator";

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

// TODO: Move these into some utils file.
const mapNames = [
  "ascent",
  "bind",
  "breeze",
  "fracture",
  "haven",
  "icebox",
  "lotus",
  "pearl",
  "split",
  "sunset",
];
const agentNames = [
  "astra",
  "breach",
  "brimstone",
  "chamber",
  "cypher",
  "deadlock",
  "fade",
  "gekko",
  "harbor",
  "iso",
  "jett",
  "kayo",
  "killjoy",
  "neon",
  "omen",
  "phoenix",
  "raze",
  "reyna",
  "sage",
  "skye",
  "sova",
  "viper",
  "yoru",
];

export async function loader({ params }: LoaderFunctionArgs) {
  // TODO: From a security perspective, is this enough?
  //
  // Should we also be sanitizing the input by removing or escaping dangerous
  // characters? Is it possible for there be some kind of JavaScript code
  // injection here?
  //
  // Consider passing the entire request URL through something like
  // https://github.com/braintree/sanitize-url
  invariant(params.mapName, "Map name not found");
  invariant(params.agentName, "Agent name not found");
  const isMapNameValid = validator.isIn(params.mapName, mapNames);
  const isAgentNameValid = validator.isIn(params.agentName, agentNames);
  if (!isMapNameValid || !isAgentNameValid) {
    // Intentionally being vague with this error message. Something like
    // "Invalid map name" or "Invalid agent name" would indicate to attackers
    // that they're on to something here.
    throw new Response("Not Found", { status: 404 });
  }

  // TODO: Replace with actual vod data.
  return json({ mapName: params.mapName, agentName: params.agentName });
}

export default function Vods() {
  return (
    <main className="flex flex-col space-y-16 p-16">
      <section>
        <Form className="flex flex-col space-y-4">
          <Filters
            filterNames={[
              "Tag One",
              "Tag Two",
              "Tag Three",
              "Tag Four",
              "Tag Five",
              "Tag Six",
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
      <section className="flex flex-col space-y-4">
        <Vod
          title="VOD Title"
          date={new Date()}
          rank="Diamond 3"
          roundsWon={13}
          roundsLost={15}
          tags={["Tag Four"]}
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum elit nunc, rutrum non enim sed, tristique feugiat ipsum. Integer accumsan tellus enim, nec lobortis lorem accumsan non. Phasellus a elementum felis. Duis fermentum risus ipsum, quis commodo erat sodales nec. Nulla ullamcorper eleifend nunc, eu vulputate orci ultricies ut. Mauris porta felis tincidunt, venenatis sem quis, suscipit leo. Nulla lacinia purus ac lorem pellentesque, sed commodo sapien aliquam."
        />
        <Vod
          title="VOD Title 2"
          date={new Date()}
          rank="Diamond 2"
          roundsWon={13}
          roundsLost={6}
          tags={["Tag One", "Tag Five"]}
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum elit nunc, rutrum non enim sed, tristique feugiat ipsum."
        />
        <Vod
          title="VOD Title 3"
          date={new Date()}
          rank="Diamond 3"
          roundsWon={13}
          roundsLost={4}
          tags={["Tag Two"]}
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum elit nunc, rutrum non enim sed, tristique feugiat ipsum. Integer accumsan tellus enim, nec lobortis lorem accumsan non. Phasellus a elementum felis. Duis fermentum risus ipsum, quis commodo erat sodales nec. Nulla ullamcorper eleifend nunc, eu vulputate orci ultricies ut."
        />
      </section>
    </main>
  );
}

interface VodProps {
  title: string;
  date: Date;
  rank: string;
  roundsWon: number;
  roundsLost: number;
  tags: string[];
  description: string;
}
function Vod({
  title,
  date,
  rank,
  roundsWon,
  roundsLost,
  tags,
  description,
}: VodProps) {
  return (
    <div className="flex space-x-4">
      <div className="flex justify-center items-center bg-white/10 w-[427px] h-[240px] text-white/40 italic">
        VOD Thumbnail
      </div>
      <div className="w-full flex flex-col space-y-2">
        <div className="flex justify-between">
          <div className="flex grow flex-col">
            <h1 className="text-2xl font-bold">{title}</h1>
            <span className="text-white/40 italic">
              {date.toDateString()} - {rank} - {roundsWon}/{roundsLost}
            </span>
          </div>
          <div className="flex-none space-x-2">
            {tags.map((tag) => (
              <span key={tag} className="px-4 py-2 rounded-full bg-white/10">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <p>{description}</p>
      </div>
    </div>
  );
}
