import Link from "next/link"
import Image from "next/image"
import Logo from "/public/ValorantLogo.png"

export default function Navbar() {
    return (
        <nav>
          <Image
            src={Logo}
            alt="Valorant Logo"
            width={80}
            quality={100}
            placeholder="blur"
          />
          <h1>Valo Buddy</h1>
          <Link href="/">Dashboard</Link>
        </nav>
    )
}