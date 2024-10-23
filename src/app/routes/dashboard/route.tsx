import { type LoaderFunctionArgs } from "@remix-run/node";
import { requireUserSession } from "~/lib/auth";
import { Menu } from "lucide-react";
import { Button, Sheet, SheetContent, SheetTrigger } from "~/components/ui";
import { Sidebar } from "~/components";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await requireUserSession(request);

  return session;
}

const Dashboard = () => {
  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <div className="hidden md:block w-64 bg-white shadow-md">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto py-[22px] px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-lg font-semibold text-gray-900">
                Chat Interface
              </h1>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <Sidebar />
                </SheetContent>
              </Sheet>
            </div>
          </header>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
