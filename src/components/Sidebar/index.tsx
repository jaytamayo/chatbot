import * as React from "react";
import { Form, Link, useNavigate } from "@remix-run/react";
import { LogOut, MessageSquare, BarChart, Users, Settings } from "lucide-react";
import { Button } from "~/components/ui";

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar = ({ onClose }: SidebarProps) => {
  const sidebarData = [
    {
      to: "/chat",
      icon: MessageSquare,
      title: "Chat",
    },
    {
      to: "/analytics",
      icon: BarChart,
      title: "Analytics",
    },
    {
      to: "/users",
      icon: Users,
      title: "Users",
    },
    {
      to: "/settings",
      icon: Settings,
      title: "Settings",
    },
  ];

  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose && onClose();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="ml-8 mt-2 p-2">
        <h1
          onClick={() => navigate("/dashboard")}
          className="text-2xl font-bold text-gray-800 cursor-pointer"
        >
          Dashboard
        </h1>
      </div>
      <nav className="mt-4 flex-1">
        {sidebarData?.map((data, index) => {
          return (
            <React.Fragment key={index}>
              <Link
                to={data.to}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(data.to);
                }}
                className="flex items-center px-4 py-2 text-gray-700  hover:bg-black hover:text-white"
              >
                <data.icon className="w-5 h-5 mr-3" />
                {data.title}
              </Link>
            </React.Fragment>
          );
        })}
      </nav>
      <div className="p-4">
        <Form action="/logout" method="post">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </Form>
      </div>
    </div>
  );
};
