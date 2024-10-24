import {
  isRouteErrorResponse,
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useNavigate,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Button,
  Label,
  Sheet,
  SheetContent,
  SheetTrigger,
} from "~/components/ui";
import "~/tailwind.css";
import { Sidebar } from "~/components";
import { Menu } from "lucide-react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { getSessionCookie } from "~/lib/auth";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = await getSessionCookie(request);

  return json({ user: response?.user });
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { user } = useLoaderData<typeof loader>();
  const location = useLocation();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      })
  );

  const isRestricted = location?.pathname === "/restricted";

  return (
    <QueryClientProvider client={queryClient}>
      {user && !isRestricted ? (
        <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="hidden md:block w-64 bg-white shadow-lg">
            <Sidebar />
          </div>

          <div className="flex-1 flex flex-col">
            <header className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-900 flex items-center">
                  Chat Interface
                </h1>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-64 p-0">
                    <Sidebar />
                  </SheetContent>
                </Sheet>
              </div>
            </header>
            <Outlet />
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </QueryClientProvider>
  );
}

export function ErrorBoundary() {
  const navigate = useNavigate();
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-cover 2xl:bg-center bg-no-repeat bg-gradient-to-br from-blue-300 to-gray-200">
        <div className="flex flex-col mb-2">
          <Label className="font-semibold text-lg text-center">
            Looks like you&apos;ve got lost...
          </Label>

          <Button
            onClick={() => navigate("/")}
            className="bg-indigo-400 p-2 rounded-md text-white"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
