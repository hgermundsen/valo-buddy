import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import ascent from "../images/ascent.webp";
import icebox from "../images/icebox.webp";
import lotus from "../images/lotus.webp";

export const meta: MetaFunction = () => [{ title: "Valo Buddy" }];

interface Map {
  name: string;
  image: string;
}

export default function MapSelect() {
  const maps: Map[] = [
    { name: "Ascent", image: ascent },
    { name: "Icebox", image: icebox },
    { name: "Lotus", image: lotus },
  ];
  return (
    <main className="p-24">
      <div className="grid gap-6 grid-cols-3 grid-rows-3">
        {maps.map(({ name, image }, i) => (
          <Link
            key={name}
            to={name.toLowerCase()}
            className="group overflow-hidden opacity-0 animate-rise-and-fade-in ring-2 ring-white/40 hover:ring-4 hover:ring-green-200 transition"
            style={{ animationDelay: `${0.05 * i}s` }}
          >
            <span className="z-10 absolute px-6 py-3 bg-white/40 text-xl font-medium">
              {name}
            </span>
            <img
              className="group-hover:scale-110 transition ease-out"
              src={image}
              alt={name}
            />
          </Link>
        ))}
      </div>
    </main>
  );
}
