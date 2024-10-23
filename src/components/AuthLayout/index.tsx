import { Link } from "@remix-run/react";
import * as React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  message: string | undefined;
  title: string;
}

export default function AuthLayout({
  children,
  message,
  title,
}: AuthLayoutProps) {
  return (
    <div className="bg-white min-h-screen flex">
      <div
        className="hidden bg-cover lg:block lg:w-2/3"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)",
        }}
      >
        <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
          <div>
            <h1 className="text-4xl font-bold text-white">Chat Bot</h1>
            <p className="max-w-xl mt-3 text-gray-300">
              Welcome to our Chat Bot. Sign in to start your conversation or
              create an account to join our community.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
        <div className="flex-1">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-center text-gray-700">
              {title}
            </h2>
            <p className="mt-3 text-gray-500">
              {title === "Login"
                ? "Sign in to access your account"
                : "Create an account to get started"}
            </p>
          </div>
          <div className="mt-8">{children}</div>
          {message && <p className="mt-4 text-sm text-green-600">{message}</p>}

          <p className="mt-6 text-center text-sm text-gray-500">
            {title === "Login"
              ? "Don't have an account yet?"
              : "Already have an account?"}{" "}
            <Link
              to={title === "Login" ? "/signup" : "/login"}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {title === "Login" ? "Register now" : "Login now"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
