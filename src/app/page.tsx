import Image from "next/image"
import Ascent from "/public/maps/Ascent.png"

export default function Home() {
  return (
    <main>
      <h2>Dashboard Baby!</h2>
      <Image
        src={Ascent}
        alt='Ascent Map Screen'
        width={370}
        quality={100}
        placeholder='blur'
      />
    </main>
  )
}
