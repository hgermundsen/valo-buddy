import { Link } from "@remix-run/react";

export default function Header() {
  return (
    <header className="flex justify-between p-4">
      <h1>ValoBuddy</h1>
      <nav className="flex space-x-4">
        <Link to="join">Sign Up</Link>
        <Link to="login">Log In</Link>
      </nav>
    </header>
  );
}
