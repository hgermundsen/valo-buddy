import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";

export const meta: MetaFunction = () => [{ title: "ValoBuddy" }];

export default function MapSelect() {
  const marqueePhrases = [
    "Get ValoBuddy",
    "Watch film",
    "Study strats",
    "Learn fast",
    "Play with confidence",
    "Climb the ranked ladder",
  ];

  // Setting this state var's initial value to "ValoBuddy" so that in a
  // situation where JavaScript is being slow to load in or start executing,
  // something still shows up on the page. It's also good for SEO — web crawlers
  // will see "ValoBuddy" in the h1 tag.
  const [productNameText, setProductNameText] = useState("ValoBuddy");

  useEffect(() => {
    const animationTickDuration = 60; // Milliseconds
    const encodingChars = ["!", "@", "#", "$", "%", "^", "&", "*", "?"];

    // Starting with one character instead of none so that on (very) initial
    // page load, there isn't a pop or a jerk between when the h1 tag is empty
    // and when it suddenly has content.
    const curProductNameTextAsArray = ["$", "", "", "", "", "", "", "", ""];
    const finalProductNameTextAsArray = [
      "V",
      "a",
      "l",
      "o",
      "B",
      "u",
      "d",
      "d",
      "y",
    ];

    // Sliding window approach to produce the "decoding" animation. Each time
    // the window moves forward by one index, each character inside the window
    // gets a new decode character. Once a character is no longer inside the
    // window, it becomes its final, "decoded" character.
    const windowSize = 8;
    let startIdx = -1 * (windowSize - 1);
    let endIdx = 0;
    const textDecodingInterval = setInterval(() => {
      // Change out every char inside the window.
      for (let i = startIdx; i <= endIdx; i++) {
        if (i < 0 || i >= finalProductNameTextAsArray.length) {
          continue;
        }
        const randomEncodingChar =
          encodingChars[Math.floor(Math.random() * encodingChars.length)];
        curProductNameTextAsArray[i] = randomEncodingChar;
      }
      // For the character that just exited the window, set it to its "final"
      // character.
      const idxThatJustExitedWindow = startIdx - 1;
      if (idxThatJustExitedWindow >= 0) {
        curProductNameTextAsArray[idxThatJustExitedWindow] =
          finalProductNameTextAsArray[idxThatJustExitedWindow];
      }
      // Update the product name text with the next "frame".
      setProductNameText(curProductNameTextAsArray.join(""));
      // Slide the window forward.
      startIdx++;
      endIdx++;
      // If the animation/effect is finished, clear this interval.
      if (startIdx > curProductNameTextAsArray.length) {
        clearInterval(textDecodingInterval);
      }
    }, animationTickDuration);

    // When this component is unmounted, clear this interval (just in case the
    // animation/effect isn't finished when the user navigates away from this
    // page, for instance).
    return () => clearInterval(textDecodingInterval);
  }, []);

  return (
    <main className="flex flex-col space-y-32 grow justify-center items-center">
      <MarqueeRtol phrases={marqueePhrases} />
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-7xl font-['Space_Mono'] scale-y-110">
          {productNameText}
        </h1>
        <h2 className="text-xl">
          The <em>ultimate</em> notes system for{" "}
          <span className="text-valored-500 font-bold">
            high-ELO Valorant players
          </span>
        </h2>
        <div className="flex space-x-4">
          <Link
            to="register"
            className="p-5 font-['Space_Mono'] uppercase text-white bg-gradient-to-r from-valored-500 to-red-600 from-50% to-50% bg-left-bottom bg-[length:200%_100%] outline-none hover:bg-right-bottom hover:text-neutral-900 focus:bg-valored-400 transition-all duration-300 ease-in-out"
          >
            Sign up now
          </Link>
          <Link
            to="login"
            className="p-5 font-['Space_Mono'] uppercase text-white bg-gradient-to-r from-red-600 to-neutral-900 from-50% to-50% bg-right-bottom bg-[length:201%_100%] outline-none hover:bg-left-bottom hover:text-neutral-900 focus:bg-valored-400 transition-all duration-[230ms] ease-in-out"
          >
            Log in
          </Link>
        </div>
      </div>
      <MarqueeLtor phrases={marqueePhrases} />
    </main>
  );
}

interface MarqueeProps {
  phrases: string[];
}
function MarqueeRtol({ phrases }: MarqueeProps) {
  // https://play.tailwindcss.com/VJvK9YXBoB?layout=horizontal
  return (
    <div className="w-full relative flex overflow-x-hidden bg-neutral-900">
      <div
        className={`animate-marquee-rtol py-2 whitespace-nowrap font-['Space_Mono'] scale-y-110`}
      >
        {phrases.map((phrase) => (
          <span key={phrase} className="mx-8 text-2xl uppercase">
            {phrase}
          </span>
        ))}
      </div>
      <div
        className={`absolute top-0 animate-marquee-rtol-two py-2 whitespace-nowrap font-['Space_Mono'] scale-y-110`}
      >
        {phrases.map((phrase) => (
          <span key={phrase} className="mx-8 text-2xl uppercase">
            {phrase}
          </span>
        ))}
      </div>
      <div
        className={`absolute top-0 animate-marquee-rtol-three py-2 whitespace-nowrap font-['Space_Mono'] scale-y-110`}
      >
        {phrases.map((phrase) => (
          <span key={phrase} className="mx-8 text-2xl uppercase">
            {phrase}
          </span>
        ))}
      </div>
    </div>
  );
}
function MarqueeLtor({ phrases }: MarqueeProps) {
  // https://play.tailwindcss.com/VJvK9YXBoB?layout=horizontal
  return (
    <div className="w-full relative flex overflow-x-hidden bg-neutral-900">
      <div
        className={`animate-marquee-ltor py-2 whitespace-nowrap font-['Space_Mono'] scale-y-110`}
      >
        {phrases.map((phrase) => (
          <span key={phrase} className="mx-8 text-2xl uppercase">
            {phrase}
          </span>
        ))}
      </div>
      <div
        className={`absolute top-0 animate-marquee-ltor-two py-2 whitespace-nowrap font-['Space_Mono'] scale-y-110`}
      >
        {phrases.map((phrase) => (
          <span key={phrase} className="mx-8 text-2xl uppercase">
            {phrase}
          </span>
        ))}
      </div>
      <div
        className={`absolute top-0 animate-marquee-ltor-three py-2 whitespace-nowrap font-['Space_Mono'] scale-y-110`}
      >
        {phrases.map((phrase) => (
          <span key={phrase} className="mx-8 text-2xl uppercase">
            {phrase}
          </span>
        ))}
      </div>
    </div>
  );
}
