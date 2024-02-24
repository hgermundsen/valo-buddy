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
            className="opacity-0 animate-rise-and-fade-in"
            style={{ animationDelay: `${0.05 * i}s` }}
          >
            <span className="absolute p-2 bg-white text-slate-900">{name}</span>
            <img src={image} alt={name} />
          </Link>
        ))}
      </div>
    </main>
  );
}
