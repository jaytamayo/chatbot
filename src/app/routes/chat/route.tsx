import { useCallback, useEffect, useRef, useState } from "react";
import { Form, useActionData, useFetcher } from "@remix-run/react";
import {
  ActionFunction,
  ActionFunctionArgs,
  json,
  LoaderFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
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
import { v4 as uuid } from "uuid";
import { EventSourceParserStream } from "eventsource-parser/stream";
import { useSendMessageWithSse } from "~/app/hooks/logic-hooks";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

interface IProps {
  controller: AbortController;
}

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData();

  const message = formData.get("message") as string;

  let controller = new AbortController();

  const dockerHost = process.env.DOCKER_HOST || "localhost";
  const ragflowPort = process.env.RAGFLOW_PORT || "9380";
  const ragflowUrl = `http://${dockerHost}:${ragflowPort}`;

  try {
    const response = await fetch(`${ragflowUrl}/v1/conversation/completion`, {
      method: "POST",
      headers: {
        ["Authorization"]:
          "ImY0MDZkMjI0OGMyYzExZWZhYTNiMDI0MmFjMTIwMDA1Ig.ZxByCQ.248f8FrLVPnXM7tVkVqnRROupk4",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversation_id: "b6876d62dee8431eb7d002b5004751f1",
        messages: [
          {
            content: "Hi! I'm your assistant, what can I do for you?\n\n",
            id: "assistant_assistant_assistant_assistant_assistant_assistant_64fa5c78-5870-45a8-8209-96142d0da3d9",
            role: "assistant",
          },
          {
            id: uuid(),
            content: message,
            role: "user",
            doc_ids: [],
          },
        ],
      }),
      // signal: controller?.signal,
    });

    const reader = response?.body
      ?.pipeThrough(new TextDecoderStream())
      .pipeThrough(new EventSourceParserStream())
      .getReader();

    const data = await reader?.read();
    const test = data?.value?.data && JSON.parse(data?.value?.data);

    const messages = [
      { role: "user", content: message },
      {
        role: "bot",
        content: test?.data?.answer,
      },
    ];

    return json({ messages });
  } catch (e) {
    return { success: false, error: e };
  }
};

export default function Chat({ controller }: IProps) {
  const actionData = useActionData<typeof action>();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Chatbot</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {actionData?.messages.map((message, index) => (
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
            <Button
              type="submit"
              // onClick={() => {
              //   send({
              //     conversation_id: "b6876d62dee8431eb7d002b5004751f1",
              //     messages: [
              //       {
              //         content:
              //           "Hi! I'm your assistant, what can I do for you?\n\n",
              //         id: "assistant_assistant_assistant_assistant_assistant_assistant_64fa5c78-5870-45a8-8209-96142d0da3d9",
              //         role: "assistant",
              //       },
              //       {
              //         id: uuid(),
              //         content: "What?",
              //         role: "user",
              //         doc_ids: [],
              //       },
              //     ],
              //   });
              // }}
            >
              <Send className="w-4 h-4" />
              <span className="sr-only">Send</span>
            </Button>
          </Form>
        </CardFooter>
      </Card>
    </div>
  );
}
