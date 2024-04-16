import { Link } from "@remix-run/react";

interface Props {
  disabled?: boolean;
  mapName: string;
  agentName: string;
  resourceName: "vods" | "strats";
}
export default function Breadcrumbs(props: Props) {
  if (props.disabled) {
    return (
      <div className="flex space-x-2 text-neutral-400 text-sm font-['Space_Mono'] scale-y-110 uppercase">
        <span className="cursor-default">Collection</span>
        <span>&gt;</span>
        <span className="cursor-default">{props.mapName}</span>
        <span>&gt;</span>
        <span className="cursor-default">{props.agentName}</span>
        <span>&gt;</span>
        <span className="cursor-default">{props.resourceName}</span>
      </div>
    );
  }

  return (
    <nav className="flex space-x-2 text-neutral-400 text-sm font-['Space_Mono'] scale-y-110 uppercase">
      <Link
        to="/collection"
        className="text-blue-500 hover:underline visited:text-purple-500"
      >
        Collection
      </Link>
      <span>&gt;</span>
      <Link
        to={`/collection/${props.mapName}`}
        className="text-blue-500 hover:underline visited:text-purple-500"
      >
        {props.mapName}
      </Link>
      <span>&gt;</span>
      <Link
        to={`/collection/${props.mapName}/${props.agentName}`}
        className="text-blue-500 hover:underline visited:text-purple-500"
      >
        {props.agentName}
      </Link>
      <span>&gt;</span>
      <Link
        to={`/collection/${props.mapName}/${props.agentName}/${props.resourceName}`}
        className="text-blue-500 hover:underline visited:text-purple-500"
      >
        {props.resourceName}
      </Link>
    </nav>
  );
}
