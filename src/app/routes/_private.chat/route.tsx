import { useCallback, useEffect, useMemo, useState } from "react";
import {
  json,
  LoaderFunctionArgs,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import get from "lodash/get";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  ScrollArea,
} from "~/components/ui";
import { MessageCircle, Send } from "lucide-react";

import {
  loader as dialogLoader,
  fetchDialogList,
} from "~/app/routes/dialog.list/route";
import { useSendNextMessage } from "~/app/hooks/useSendNextMessage";
import { getRagSessionCookie, requireUserSession } from "~/lib/auth";
import { useSelectDerivedConversationList } from "~/app/hooks/useSelectDerivedConversationList";
import { useGetChatSearchParams } from "~/app/hooks/useGetChatSearchParams";
import { useClickDialogCard } from "~/app/hooks/useClickDialogCard";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Chatbot" },
    { name: "description", content: "Chat with AI assistant!" },
  ];
};

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

export default function Chat() {
  const { authorization } = useLoaderData<typeof loader>();

  const { data } = useQuery({
    queryKey: ["dialogList", authorization],
    queryFn: fetchDialogList,
  });

  const { addTemporaryConversation } = useSelectDerivedConversationList();

  const { dialogId } = useGetChatSearchParams();

  const [controller] = useState(new AbortController());

  const {
    ref,
    value,
    sendLoading,
    derivedMessages,
    handleInputChange,
    handlePressEnter,
  } = useSendNextMessage(controller);

  const handleCreateTemporaryConversation = useCallback(() => {
    addTemporaryConversation();
  }, [addTemporaryConversation]);

  const { conversationId } = useGetChatSearchParams();

  const { handleClickDialog } = useClickDialogCard();

  useEffect(() => {
    if (data && data.length > 0) {
      if (data.every((x) => x.id !== dialogId)) {
        handleClickDialog(data[0].id);
      }
    }
  }, [data, dialogId, handleClickDialog]);

  useEffect(() => {
    if (dialogId && !conversationId) {
      handleCreateTemporaryConversation();
    }
  }, [conversationId, dialogId, handleCreateTemporaryConversation]);

  const [fileList, setFileList] = useState<any>([]);

  const isUploadingFile = fileList.some((x) => x.status === "uploading");

  const getFileIds = (fileList: any) => {
    const ids = fileList.reduce((pre, cur) => {
      return pre.concat(get(cur, "response.data", []));
    }, []);

    return ids;
  };

  const isUploadSuccess = (file: any) => {
    const retcode = get(file, "response.retcode");
    return typeof retcode === "number" && retcode === 0;
  };

  const handleSubmit = useCallback(async () => {
    if (isUploadingFile) return;
    const ids = getFileIds(fileList.filter((x) => isUploadSuccess(x)));

    handlePressEnter(ids);
    setFileList([]);
  }, [fileList, handlePressEnter, isUploadingFile]);

  const messages = useMemo(() => {
    if (derivedMessages.length === 0) return [];

    const updatedMessages = [...derivedMessages];
    const lastMessage = updatedMessages[updatedMessages.length - 1];

    if (lastMessage.role === "assistant" && sendLoading) {
      updatedMessages[updatedMessages.length - 1] = {
        ...lastMessage,
        content: "Bot is typing...",
      };
    }

    return updatedMessages;
  }, [derivedMessages, sendLoading]);

  return (
    <div className="flex-1 overflow-hidden p-2 sm:p-4 md:p-6 lg:p-8">
      <Card className="flex flex-col h-full w-full max-w-4xl mx-auto shadow-xl">
        <CardHeader className="p-3 sm:p-4 md:p-6 bg-primary text-primary-foreground">
          <CardTitle className="flex items-center text-base sm:text-lg md:text-xl lg:text-2xl">
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 mr-2" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-2 sm:p-4 md:p-6">
          <ScrollArea className="h-full pr-4">
            <div className="flex flex-col space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start max-w-[80%] ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <Avatar className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8">
                      <AvatarImage
                        src={
                          message.role === "assistant"
                            ? "https://i.pravatar.cc/150?img=1"
                            : "https://i.pravatar.cc/150?img=3"
                        }
                        alt={message.role}
                      />
                      <AvatarFallback>
                        {message.role === "user" ? "U" : "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`mx-1 sm:mx-2 p-1.5 sm:p-2 rounded-lg text-sm sm:text-sm md:text-base ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.role === "assistant" &&
                      sendLoading &&
                      index === messages.length - 1 ? (
                        <span className="animate-pulse">{message.content}</span>
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div ref={ref} />
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-2 sm:p-4 md:p-6 bg-gray-50">
          <Input
            name="chatInput"
            type="text"
            disabled={sendLoading}
            value={value}
            onPressEnter={handlePressEnter}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-grow text-sm sm:text-base"
          />

          <Button
            disabled={sendLoading}
            type="button"
            onClick={handleSubmit}
            className="px-3 sm:px-4 bg-primary transition-colors duration-200"
          >
            <Send className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
