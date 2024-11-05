import { useCallback, useEffect } from "react";
import trim from "lodash/trim";
import { v4 as uuid } from "uuid";

import { useHandleMessageInputChange } from "./useHandleMessageInputChange";
import { useSelectNextMessages } from "./useSelectNextMessages";
import { Message } from "./useSelectDerivedMessages";
import { useSetChatRouteParams } from "./useSetChatRouteParams";
import { useSetConversation } from "./useSetConversation";
import { useSendMessageWithSse } from "./useSendMessageWithSse";
import { useRegenerateMessage } from "./useRegenerateMessage";
import { useGetChatSearchParams } from "./useGetChatSearchParams";

export const useSendNextMessage = (controller: AbortController) => {
  const { setConversation } = useSetConversation();
  const { conversationId, isNew } = useGetChatSearchParams();
  const { handleInputChange, value, setValue } = useHandleMessageInputChange();

  const {
    send,
    answer,
    done = false,
  } = useSendMessageWithSse("http://localhost:9380/v1/conversation/completion");

  const {
    ref,
    derivedMessages,
    loading,
    addNewestAnswer,
    addNewestQuestion,
    removeLatestMessage,
    removeMessageById,
    removeMessagesAfterCurrentMessage,
  } = useSelectNextMessages();

  const { setConversationIsNew } = useSetChatRouteParams();

  const sendMessage = useCallback(
    async ({
      message,
      currentConversationId,
      messages,
    }: {
      message: Message;
      currentConversationId?: string;
      messages?: Message[];
    }) => {
      const res = await send(
        {
          conversation_id: currentConversationId ?? conversationId,
          messages: [...(messages ?? derivedMessages ?? []), message],
        },
        controller
      );

      if (res && (res?.response.status !== 200 || res?.data?.retcode !== 0)) {
        // cancel loading
        setValue(message.content);
        console.info("removeLatestMessage111");
        removeLatestMessage();
      }
    },
    [
      derivedMessages,
      conversationId,
      removeLatestMessage,
      setValue,
      send,
      controller,
    ]
  );

  const { regenerateMessage } = useRegenerateMessage({
    removeMessagesAfterCurrentMessage,
    sendMessage,
    messages: derivedMessages,
  });

  useEffect(() => {
    //  #1289
    if (answer.answer && conversationId && isNew !== "true") {
      addNewestAnswer(answer);
    }
  }, [answer, addNewestAnswer, conversationId, isNew]);

  const handleSendMessage = useCallback(
    async (message: Message) => {
      if (isNew !== "true") {
        sendMessage({ message });
      } else {
        const data = await setConversation(
          message.content,
          true,
          conversationId
        );
        if (data.retcode === 0) {
          setConversationIsNew("");
          const id = data.data.id;

          sendMessage({
            message,
            currentConversationId: id,
            messages: data.data.message,
          });
        }
      }
    },
    [setConversation, sendMessage, setConversationIsNew, conversationId, isNew]
  );

  // Callback used for handleSubmit for chat input
  const handlePressEnter = useCallback(
    (documentIds: string[]) => {
      if (trim(value) === "") return;
      const id = uuid();

      addNewestQuestion({
        content: value,
        doc_ids: documentIds,
        id,
        role: MessageType.User,
      });
      if (done) {
        setValue("");
        handleSendMessage({
          id,
          content: value.trim(),
          role: MessageType.User,
          doc_ids: documentIds,
        });
      }
    },
    [addNewestQuestion, handleSendMessage, done, setValue, value]
  );

  // Callback used for handlePressEnter for suggested questions
  const handlePressQuestion = useCallback(
    (question: string) => {
      if (trim(question) === "") return;

      const id = uuid();

      addNewestQuestion({
        content: question,
        doc_ids: [],
        id,
        role: MessageType.User,
      });
      if (done) {
        setValue("");
        handleSendMessage({
          id,
          content: question.trim(),
          role: MessageType.User,
          doc_ids: [],
        });
      }
    },
    [addNewestQuestion, handleSendMessage, done]
  );

  return {
    handlePressEnter,
    handlePressQuestion,
    handleInputChange,
    handleSendMessage,
    value,
    setValue,
    regenerateMessage,
    sendLoading: !done,
    loading,
    ref,
    derivedMessages,
    removeMessageById,
  };
};

export enum MessageType {
  Assistant = "assistant",
  User = "user",
}
