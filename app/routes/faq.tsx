import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "ValoBuddy - FAQ" }];

export default function FAQ() {
  return (
    <div className="flex-col grow p-6 lg:p-16">
      <div className="flex-col">
        <h1 className="text-center text-3xl font-['Druk_Wide_Bold'] uppercase">
          Frequently Asked Questions
        </h1>
        <hr className="text-center mt-3 mb-6 mx-auto w-1/2"></hr>
        <h2 className="text-center mt-12 mb-6 text-xl font-['Druk_Wide_Bold']">
          What is ValoBuddy?
        </h2>
        <p className="mx-80 text-lg">
          ValoBuddy (patent pending) is your new one-stop shop for hosting and
          consolidating all of your favorite lineups, strategies, and VODs. Our
          platform was designed from the ground up with a focus on being easy to
          use and intuitive for Valorant players, so you can focus on improving
          and climbing instead of fighting with a spreadsheet.
        </p>
        <h2 className="text-center mt-12 mb-6 text-xl font-['Druk_Wide_Bold']">
          Who the hell are you guys?
        </h2>
        <p className="mx-80 text-lg">
          TODO: Fill this out with actual text... Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Morbi laoreet metus et ante auctor
          scelerisque a sed tellus. Sed ornare fringilla sem, non tincidunt
          magna sollicitudin sed. Suspendisse eget suscipit ipsum, in tempor
          eros. Mauris eget orci non nunc elementum porttitor non ac magna. Ut
          at nisi sit amet tellus gravida convallis id id purus. Sed bibendum,
          risus quis mollis cursus, lacus nulla pretium augue, a congue augue
          leo at enim. Etiam consequat sodales dapibus. Curabitur dignissim leo
          sed lectus imperdiet, eget rhoncus elit rhoncus.
        </p>
        <h2 className="text-center mt-12 mb-6 text-xl font-['Druk_Wide_Bold']">
          Why did you make ValoBuddy?
        </h2>
        <p className="mx-80 text-lg">
          In short, because it was something that we wanted ourselves.
          We&apos;ve tried every strategy we could think of for organizing and
          maintaining the resources that make improving in Valorant easier, be
          it spreadsheets with fancy formulas, Powerpoints with links for
          different maps/agents, word documents with tables of contents, and
          even a private dedicated Discord servers. While these worked to an
          extent, they felt clunky, forced, and it was apparent that a different
          solution was needed... yet nothing existed. Seeing online coaches
          consistently recommend keeping an organized place with your VODs (and
          review notes), Lineups, and Strategies made us realize that there
          needed to be a way to consolidate all of these invaluable resources,
          and thus ValoBuddy was born.
        </p>
        <div className="flex justify-center">
          <h2 className="text-center mt-12 mb-6 text-xl font-['Druk_Wide_Bold']">
            Will this&nbsp;
            <span className="underline decoration-4 underline-offset-8">
              finally
            </span>
            &nbsp;get me out of &#123;insert rank here&#125;?
          </h2>
        </div>
        <p className="mx-80 text-lg">
          No promises on that one, but we firmly believe that having a
          well-defined plan, strategies, and an understanding of areas to
          improve in your gameplay is the best way for someone to climb the
          ranked ladder. You might not be able to control the&nbsp;
          <span className="line-through">bots</span>&nbsp;teammates that you get
          matched with, but focusing on{" "}
          <span className="underline decoration-3 underline-offset-8">
            your
          </span>{" "}
          personal performance and improvement will undoubtedly lead to
          long-term gains.
        </p>
      </div>
    </div>
  );
}
