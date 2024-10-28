import { IMessage, useSelectDerivedMessages } from "./useSelectDerivedMessages";

import { useFetchNextConversation } from "./queries/useFetchNextConversation";
import { useGetChatSearchParams } from "./useGetChatSearchParams";
import { useCallback, useEffect } from "react";
import { MessageType } from "./useSendNextMessage";
import { v4 as uuid } from "uuid";
import { useLoaderData } from "@remix-run/react";
import { loader } from "~/app/routes/_private.chat/route";
import { useQuery } from "@tanstack/react-query";
import { fetchDialogList } from "../routes/dialog.list/route";

// Hook for selecting premade or existing chat, and display details on chat/conversation
export const useSelectNextMessages = () => {
  const { authorization } = useLoaderData<typeof loader>();

  const { data } = useQuery({
    queryKey: ["dialogList", authorization],
    queryFn: fetchDialogList,
  });

  const currentDialog = data?.[0];

  const {
    ref,
    setDerivedMessages,
    derivedMessages,
    addNewestAnswer,
    addNewestQuestion,
    removeLatestMessage,
    removeMessageById,
    removeMessagesAfterCurrentMessage,
  } = useSelectDerivedMessages();

  const { data: conversation, loading } = useFetchNextConversation();

  const dialog = currentDialog?.prompt_config?.prologue ?? "";

  const { conversationId, dialogId, isNew } = useGetChatSearchParams();

  const addPrologue = useCallback(() => {
    if (dialogId !== "" && isNew === "true") {
      const nextMessage = {
        role: MessageType.Assistant,
        content: dialog,
        id: uuid(),
      } as IMessage;

      setDerivedMessages([nextMessage]);
    }
  }, [isNew, dialog, dialogId, setDerivedMessages]);

  useEffect(() => {
    addPrologue();
  }, [addPrologue]);

  useEffect(() => {
    if (
      conversationId &&
      isNew !== "true" &&
      conversation.message?.length > 0
    ) {
      setDerivedMessages(conversation.message);
    }

    if (!conversationId) {
      setDerivedMessages([]);
    }
  }, [conversation.message, conversationId, setDerivedMessages, isNew]);

  return {
    ref,
    derivedMessages,
    loading,
    addNewestAnswer,
    addNewestQuestion,
    removeLatestMessage,
    removeMessageById,
    removeMessagesAfterCurrentMessage,
  };
};
