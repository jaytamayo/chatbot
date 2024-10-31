import * as React from "react";
import { Form, Link, useNavigate, useLocation } from "@remix-run/react";
import {
  LogOut,
  MessageSquare,
  BarChart,
  Users,
  Settings,
  Bot,
} from "lucide-react";
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
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose && onClose();
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 animate-gradient relative overflow-hidden">
      <div className="ml-8 mt-2 p-2">
        <h1
          onClick={() => navigate("/dashboard")}
          className="flex text-2xl font-bold text-gray-100 cursor-pointer"
        >
          <Bot className="w-6 h-8 mr-3 " />
          Chatbot
        </h1>
      </div>
      <nav className="flex-1 overflow-y-auto relative z-10 mt-1">
        {sidebarData.map((data, index) => {
          const isActive = location.pathname === data.to;
          return (
            <Link
              key={index}
              to={data.to}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation(data.to);
              }}
              className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 transition-all duration-200 ${
                isActive ? "bg-gray-800 text-white shadow-md" : ""
              }`}
            >
              <data.icon
                className={`w-5 h-5 mr-3 ${isActive ? "text-white" : ""}`}
              />
              <span
                className={`font-medium ${isActive ? "font-semibold" : ""}`}
              >
                {data.title}
              </span>
              {isActive && (
                <div className="ml-auto w-1 h-6 bg-gray-900 rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="relative z-10 p-6 border-t border-gray-700 bg-gray-900 backdrop-blur-sm">
        <Form action="/logout" method="post">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center text-gray-900"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </Form>
      </div>
    </div>
  );
};
