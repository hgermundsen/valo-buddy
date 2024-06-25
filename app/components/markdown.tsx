import React, { Suspense } from "react";

// https://stackoverflow.com/a/75527318
//
// Also, have to name this component something weird so it doesn't conflict with
// the function this file is exporting.
const MarkDown = React.lazy(() => import("react-markdown"));

interface MarkdownProps {
  content: string;
}
export default function Markdown(props: MarkdownProps) {
  return (
    <Suspense>
      {/* https://stackoverflow.com/a/74607475 */}
      <MarkDown className="prose prose-invert">{props.content}</MarkDown>
    </Suspense>
  );
}
