import Link from "next/link";

export default function Page({ params }: { params: { map: string } }) {
    return <div>
      <h2>Current Map: {params.map}</h2>

      <Link href={`/${params.map}/vods`}>VODs | </Link>
      <Link href={`/${params.map}/strats`}>Strats</Link>
    </div>
  }