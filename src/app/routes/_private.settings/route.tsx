import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Form, json, useLoaderData } from "@remix-run/react";

import { Bell, Menu, MessageSquare, Palette, Sliders } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from "~/components/ui";
import {
  loader as dialogLoader,
  fetchDialogList,
} from "~/app/routes/dialog.list/route";
import {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { getRagSessionCookie, requireUserSession } from "~/lib/auth";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  await dialogLoader({ request } as LoaderFunctionArgs);

  const { authorization } = await getRagSessionCookie(request);

  const session = await requireUserSession(request);

  if (session) {
    return json({
      authorization,
    });
  }
};

export default function Settings() {
  const { authorization } = useLoaderData<typeof loader>();

  const { data, refetch } = useQuery({
    queryKey: ["dialogList", authorization],
    queryFn: fetchDialogList,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const [primaryColor, setPrimaryColor] = useState("#007bff");
  const [fontSize, setFontSize] = useState("16");
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [notificationSound, setNotificationSound] = useState("chime");
  const [aiModel, setAiModel] = useState("gpt-3.5-turbo");
  const [maxTokens, setMaxTokens] = useState("150");
  const [activeTab, setActiveTab] = useState("general");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const tabs = [
    { id: "general", label: "General", icon: <Sliders className="w-4 h-4" /> },
    {
      id: "appearance",
      label: "Appearance",
      icon: <Palette className="w-4 h-4" />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-4 h-4" />,
    },
    {
      id: "ai",
      label: "AI Settings",
      icon: <MessageSquare className="w-4 h-4" />,
    },
  ];

  const TabContent = ({ id }: { id: string }) => {
    switch (id) {
      case "general":
        return (
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure the basic settings for your chatbot.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bot-name">Bot Name</Label>
                <Input
                  type="text"
                  name="botName"
                  id="bot-name"
                  placeholder="Enter bot name"
                  defaultValue={data?.[0]?.name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="welcome-message">Welcome Message</Label>
                <Textarea
                  name="welcomMessage"
                  id="welcome-message"
                  placeholder="Enter welcome message"
                  defaultValue={data?.[0]?.prompt_config?.prologue}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        );
      case "appearance":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look of your chatbot.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <Input
                    id="primary-color"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full sm:w-12 h-12 p-1"
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-grow"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size</Label>
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="14">Small (14px)</SelectItem>
                    <SelectItem value="16">Medium (16px)</SelectItem>
                    <SelectItem value="18">Large (18px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );
      case "notifications":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <Label htmlFor="notifications" className="mb-0">
                  Enable Notifications
                </Label>
                <Switch
                  id="notifications"
                  checked={enableNotifications}
                  onCheckedChange={setEnableNotifications}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notification-sound">Notification Sound</Label>
                <Select
                  value={notificationSound}
                  onValueChange={setNotificationSound}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sound" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chime">Chime</SelectItem>
                    <SelectItem value="bell">Bell</SelectItem>
                    <SelectItem value="ding">Ding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );
      case "ai":
        return (
          <Card>
            <CardHeader>
              <CardTitle>AI Settings</CardTitle>
              <CardDescription>
                Configure the AI model for your chatbot.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-model">AI Model</Label>
                <Select value={aiModel} onValueChange={setAiModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="claude-v1">Claude v1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-tokens">Max Tokens</Label>
                <Input
                  id="max-tokens"
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(e.target.value)}
                  placeholder="Enter max tokens"
                />
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Chatbot Settings</h1>

      <Form method="post">
        <div className="md:hidden">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="mb-4 w-full">
                <Menu className="mr-2 h-4 w-4" />
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Settings Menu</DialogTitle>
                <DialogDescription>
                  Choose a settings category
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsDialogOpen(false);
                    }}
                  >
                    {tab.icon}
                    <span className="ml-2">{tab.label}</span>
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <TabContent id={activeTab} />
        </div>

        <div className="hidden md:flex space-x-6">
          <Card className="w-1/4">
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.icon}
                    <span className="ml-2">{tab.label}</span>
                  </Button>
                ))}
              </nav>
            </CardContent>
          </Card>
          <div className="flex-1">
            <TabContent id={activeTab} />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" className="w-full md:w-auto">
            Save Settings
          </Button>
        </div>
      </Form>
    </div>
  );
}

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();

  return json({ error: "Invalid action" }, { status: 400 });
};
