import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "Valo Buddy" }];

export default function MapSelect() {
  return (
    <main className="flex grow justify-center items-center">
      <p className="text-neutral-400 italic">
        TODO: Landing page with marketing copy &amp; fancy graphics goes here.
      </p>
    </main>
  );
}
