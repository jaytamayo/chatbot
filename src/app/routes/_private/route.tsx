import { Outlet } from "@remix-run/react";
import { Menu, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { Sidebar } from "~/components";
import { Button, Sheet, SheetContent, SheetTrigger } from "~/components/ui";

export default function MarketingLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <div className="hidden md:block w-64 bg-gray-800 shadow-lg">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col bg-gray-800">
        <header className="bg-gray-900 shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-100 flex items-center">
              Chat Interface
            </h1>
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden text-gray-900"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 p-0 bg-gray-800 border-r border-gray-700"
              >
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
