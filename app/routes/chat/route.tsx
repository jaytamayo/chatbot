import { useState } from "react";
import { Form, useActionData } from "@remix-run/react";
import { ActionFunctionArgs, json, MetaFunction } from "@remix-run/node";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  ScrollArea,
} from "~/components/ui";
import { Send } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

interface IProps {
  controller: AbortController;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const message = formData.get("message") as string;

  const ragflowUrl = process.env.RAGFLOW_URL || "http://localhost:9380";

  try {
    const ragResponse = "test";

    // Combine the RAG response with a simple chatbot response
    const botResponse = `Based on my knowledge: ${ragResponse}\nHow can I assist you further?`;

    return json({ response: botResponse });
  } catch (error) {
    console.error("Error querying RAGFlow service:", error);
    return json({
      response: "I'm sorry, I couldn't process your request at the moment.",
    });
  }
};

interface MessageInterface {
  content: string;
  role: string;
}

export default function Chat({ controller }: IProps) {
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const actionData = useActionData<typeof action>();

  if (
    actionData?.response &&
    messages[messages.length - 1]?.content !== actionData.response
  ) {
    setMessages([...messages, { role: "bot", content: actionData.response }]);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Chatbot</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {message.content}
                </span>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <Form method="post" className="flex w-full gap-2">
            <Input
              type="text"
              name="message"
              placeholder="Type your message..."
              className="flex-grow"
            />
            <Button type="submit">
              <Send className="w-4 h-4" />
              <span className="sr-only">Send</span>
            </Button>
          </Form>
        </CardFooter>
      </Card>
    </div>
  );
}
