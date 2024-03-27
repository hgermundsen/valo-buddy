import { Form, Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function Header() {
  const user = useOptionalUser();

  return (
    <header className="flex justify-between p-4">
      <h1 className="font-bold">ValoBuddy</h1>
      <nav className="flex space-x-4 text-sm">
        {user ? (
          <>
            <span>Signed in as {user.email}</span>
            <Form action="logout" method="post">
              <button type="submit">Log out</button>
            </Form>
          </>
        ) : (
          <>
            <Link to="register">Sign Up</Link>
            <Link to="login">Log In</Link>
          </>
        )}
      </nav>
    </header>
  );
}
