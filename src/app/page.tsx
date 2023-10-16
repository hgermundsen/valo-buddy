import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div>
      <h2>This is the home page text</h2>
      <Image
        src={"https://storage.googleapis.com/valo-buddy-storage/wBul4sJpC0BbV6PZLxwG-0.png"}
        alt='A thing'
        width={370}
        height={208}
        quality={100}
        placeholder='blur'
        blurDataURL="https://storage.googleapis.com/valo-buddy-storage/wBul4sJpC0BbV6PZLxwG-0.png"
      />
      <Link href="/ascent">Ascent | </Link>
      <Link href="/bind">Bind | </Link>
      <Link href="/breeze">Breeze | </Link>
      <Link href="/fracture">Fracture | </Link>
      <Link href="/haven">Haven | </Link>
      <Link href="/icebox">Icebox | </Link>
      <Link href="/lotus">Lotus | </Link>
      <Link href="/pearl">Pearl | </Link>
      <Link href="/split">Split | </Link>
      <Link href="/sunset">Sunset</Link>
    </div>
  )
}
