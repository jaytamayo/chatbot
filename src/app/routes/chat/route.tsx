import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import get from "lodash/get";

import {
  Avatar,
  AvatarFallback,
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

import { loader as dialogLoader } from "~/app/routes/dialog.list/route";
import { useSendNextMessage } from "~/app/hooks/useSendNextMessage";
import { getRagSessionCookie } from "~/lib/auth";
import { useSelectDerivedConversationList } from "~/app/hooks/useSelectDerivedConversationList";
import { useFetchNextDialogList } from "~/app/hooks/queries/useFetchNextDialogList";
import { useGetChatSearchParams } from "~/app/hooks/useGetChatSearchParams";
import { requireUserSession } from "~/lib/auth";
import { LoaderFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Chatbot" },
    { name: "description", content: "Chat with AI assistant!" },
  ];
};

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const dialogList = await dialogLoader({ request } as LoaderFunctionArgs);
  const { authorization } = await getRagSessionCookie(request);

  const session = await requireUserSession(request);

  if (session) {
    return json({
      dialogList: await dialogList.json(),
      authorization,
    });
  }
};

export default function Chat() {
  const { dialogList } = useLoaderData<typeof loader>();

  const { data: dialogData } = useFetchNextDialogList();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const { list: conversationList, addTemporaryConversation } =
    useSelectDerivedConversationList();

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

  useEffect(() => {
    if (dialogList && conversationList.length < 1 && !conversationId) {
      handleCreateTemporaryConversation();
    }
  }, [dialogList]);

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
    isHydrated && (
      <div className="flex-1 overflow-hidden p-4 sm:p-6 md:p-8">
        <Card className="flex flex-col h-full max-w-4xl mx-auto shadow-xl">
          <CardHeader className="p-4 sm:p-6 bg-black from-primary to-primary-foreground text-white">
            <CardTitle className="flex items-center text-lg sm:text-xl md:text-2xl">
              <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 mr-2" />
              {dialogData?.[0].name}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden p-4 sm:p-6">
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
                        message.role === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
                      }`}
                    >
                      <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
                        <AvatarFallback>
                          {message.role === "user" ? "U" : "B"}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`mx-2 p-2 rounded-lg text-sm sm:text-base ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {message.role === "assistant" &&
                        sendLoading &&
                        index === messages.length - 1 ? (
                          <span className="animate-pulse">
                            {message.content}
                          </span>
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
          <CardFooter className="p-4 sm:p-6 bg-gray-50">
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
              className="px-3 sm:px-4 bg-primary hover:bg-primary-foreground transition-colors duration-200"
            >
              <Send className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  );
}
