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
        <p className="mx-80">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi laoreet
          metus et ante auctor scelerisque a sed tellus. Sed ornare fringilla
          sem, non tincidunt magna sollicitudin sed. Suspendisse eget suscipit
          ipsum, in tempor eros. Mauris eget orci non nunc elementum porttitor
          non ac magna. Ut at nisi sit amet tellus gravida convallis id id
          purus. Sed bibendum, risus quis mollis cursus, lacus nulla pretium
          augue, a congue augue leo at enim. Etiam consequat sodales dapibus.
          Curabitur dignissim leo sed lectus imperdiet, eget rhoncus elit
          rhoncus.
        </p>
        <h2 className="text-center mt-12 mb-6 text-xl font-['Druk_Wide_Bold']">
          Who the hell are you guys?
        </h2>
        <p className="mx-80">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi laoreet
          metus et ante auctor scelerisque a sed tellus. Sed ornare fringilla
          sem, non tincidunt magna sollicitudin sed. Suspendisse eget suscipit
          ipsum, in tempor eros. Mauris eget orci non nunc elementum porttitor
          non ac magna. Ut at nisi sit amet tellus gravida convallis id id
          purus. Sed bibendum, risus quis mollis cursus, lacus nulla pretium
          augue, a congue augue leo at enim. Etiam consequat sodales dapibus.
          Curabitur dignissim leo sed lectus imperdiet, eget rhoncus elit
          rhoncus.
        </p>
        <h2 className="text-center mt-12 mb-6 text-xl font-['Druk_Wide_Bold']">
          Why did you make this?
        </h2>
        <p className="mx-80">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi laoreet
          metus et ante auctor scelerisque a sed tellus. Sed ornare fringilla
          sem, non tincidunt magna sollicitudin sed. Suspendisse eget suscipit
          ipsum, in tempor eros. Mauris eget orci non nunc elementum porttitor
          non ac magna. Ut at nisi sit amet tellus gravida convallis id id
          purus. Sed bibendum, risus quis mollis cursus, lacus nulla pretium
          augue, a congue augue leo at enim. Etiam consequat sodales dapibus.
          Curabitur dignissim leo sed lectus imperdiet, eget rhoncus elit
          rhoncus.
        </p>
        <div className="flex justify-center">
          <h2 className="text-center mt-12 mb-6 text-xl font-['Druk_Wide_Bold']">
            Will this&nbsp;
          </h2>
          <h2 className="text-center underline decoration-4 underline-offset-8 mt-12 mb-6 text-xl font-['Druk_Wide_Bold']">
            finally
          </h2>
          <h2 className="text-center mt-12 mb-6 text-xl font-['Druk_Wide_Bold']">
            &nbsp;get me out of &#123;insert rank here&#125;?
          </h2>
        </div>
        <p className="mx-80">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi laoreet
          metus et ante auctor scelerisque a sed tellus. Sed ornare fringilla
          sem, non tincidunt magna sollicitudin sed. Suspendisse eget suscipit
          ipsum, in tempor eros. Mauris eget orci non nunc elementum porttitor
          non ac magna. Ut at nisi sit amet tellus gravida convallis id id
          purus. Sed bibendum, risus quis mollis cursus, lacus nulla pretium
          augue, a congue augue leo at enim. Etiam consequat sodales dapibus.
          Curabitur dignissim leo sed lectus imperdiet, eget rhoncus elit
          rhoncus.
        </p>
      </div>
    </div>
  );
}
