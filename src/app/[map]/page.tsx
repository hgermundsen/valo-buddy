export default function Page({ params }: { params: { map: string } }) {
    return <div>Current Map: {params.map}</div>
  }