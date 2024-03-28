import { Form, Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function Header() {
  const user = useOptionalUser();

  return (
    <header className="flex justify-between p-4">
      {/* Redirect to /login since if the user is logged in, the login page will
          redirect them to /collection */}
      <Link to="/login">
        <h1 className="font-bold hover:text-valored-500 transition">
          ValoBuddy
        </h1>
      </Link>
      <nav className="flex space-x-4 text-sm">
        {user ? (
          <>
            <span>Signed in as {user.email}</span>
            <Form action="logout" method="post">
              <button type="submit" className="hover:underline">
                Log out
              </button>
            </Form>
          </>
        ) : (
          <>
            <Link to="register" className="hover:underline">
              Sign Up
            </Link>
            <Link to="login" className="hover:underline">
              Log In
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
