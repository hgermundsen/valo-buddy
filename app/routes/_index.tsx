import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";

export const meta: MetaFunction = () => [{ title: "ValoBuddy" }];

const MARQUEE_PHRASES = [
  "Get ValoBuddy",
  "Find lineups",
  "Review your VODs",
  "Study strats",
  "Learn fast",
  "Prep for any scenario",
  "Play with confidence",
  "Climb the ranked ladder",
  "Buy the SEN bundle",
];

const ENCODING_CHARS = ["!", "@", "#", "$", "%", "^", "&", "*", "?"];
const INITIAL_PRODUCT_NAME_TEXT_AS_ARRAY = [
  "_",
  "_",
  "_",
  "_",
  "_",
  "_",
  "_",
  "_",
  "_",
];
const FINAL_PRODUCT_NAME_TEXT_AS_ARRAY = [
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
const WINDOW_SIZE = 8;
const ANIMATION_TICK_DURATION_IN_MILLIS = 75;
const ANIMATION_INTERMISSION_DURATION_IN_MILLIS = 5000;

export default function MapSelect() {
  // Setting this state var's initial value to "ValoBuddy" so that in a
  // situation where JavaScript is being slow to load in or start executing,
  // something still shows up on the page. It's also good for SEO — web crawlers
  // will see "ValoBuddy" in the h1 tag.
  const [productNameText, setProductNameText] = useState("ValoBuddy");

  useEffect(() => {
    let curProductNameTextAsArray = INITIAL_PRODUCT_NAME_TEXT_AS_ARRAY;

    // Sliding window approach to produce the "decoding" animation. Each time
    // the window moves forward by one index, each character inside the window
    // gets a new decode character. Once a character is no longer inside the
    // window, it becomes its final, "decoded" character.
    let startIdx = -1 * (WINDOW_SIZE - 1);
    let endIdx = 0;
    // Fun fact: timeouts and intervals both have the Timeout type.
    let animationInterval: NodeJS.Timeout;
    let animationIntermissionTimeout: NodeJS.Timeout;

    function animationLoop() {
      // Change out every char inside the window.
      for (let i = startIdx; i <= endIdx; i++) {
        if (i < 0 || i >= FINAL_PRODUCT_NAME_TEXT_AS_ARRAY.length) {
          continue;
        }
        const randomEncodingChar =
          ENCODING_CHARS[Math.floor(Math.random() * ENCODING_CHARS.length)];
        curProductNameTextAsArray[i] = randomEncodingChar;
      }
      // For the character that just exited the window, set it to its "final"
      // character.
      const idxThatJustExitedWindow = startIdx - 1;
      if (idxThatJustExitedWindow >= 0) {
        curProductNameTextAsArray[idxThatJustExitedWindow] =
          FINAL_PRODUCT_NAME_TEXT_AS_ARRAY[idxThatJustExitedWindow];
      }
      // Update the product name text with the next "frame".
      setProductNameText(curProductNameTextAsArray.join(""));
      // Slide the window forward.
      startIdx++;
      endIdx++;
      // If the animation/effect is finished, pause for a bit before restarting.
      if (startIdx > curProductNameTextAsArray.length) {
        curProductNameTextAsArray = INITIAL_PRODUCT_NAME_TEXT_AS_ARRAY;
        startIdx = -1 * (WINDOW_SIZE - 1);
        endIdx = 0;

        clearInterval(animationInterval);
        animationIntermissionTimeout = setTimeout(() => {
          animationInterval = setInterval(
            animationLoop,
            ANIMATION_TICK_DURATION_IN_MILLIS,
          );
        }, ANIMATION_INTERMISSION_DURATION_IN_MILLIS);
      }
    }

    animationInterval = setInterval(
      animationLoop,
      ANIMATION_TICK_DURATION_IN_MILLIS,
    );

    // When this component is unmounted, clear this interval (just in case the
    // animation/effect isn't finished when the user navigates away from this
    // page, for instance).
    return () => {
      clearInterval(animationInterval);
      clearTimeout(animationIntermissionTimeout);
    };
  }, []);

  return (
    <main className="flex flex-col space-y-32 grow justify-center items-center">
      <MarqueeRtol phrases={MARQUEE_PHRASES} />
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-5xl lg:text-7xl font-['Space_Mono'] scale-y-110">
          {productNameText}
        </h1>
        <h2 className="lg:text-xl text-center">
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
      <MarqueeLtor phrases={MARQUEE_PHRASES} />
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
