import { useSelectDerivedMessages } from './useSelectDerivedMessages';

import { useFetchNextConversation } from './queries/useFetchNextConversation';

// Hook for selecting premade or existing chat, and display details on chat/conversation
export const useSelectNextMessages = () => {
  const {
    ref,
    // setDerivedMessages,
    derivedMessages,
    addNewestAnswer,
    addNewestQuestion,
    removeLatestMessage,
    removeMessageById,
    removeMessagesAfterCurrentMessage,
  } = useSelectDerivedMessages();

  const {
    data:
      // conversation,
      loading,
  } = useFetchNextConversation();

  // const { data: dialog } = useFetchNextDialog();
  // const { dialogList, initialMessage } = useLoaderData();

  // console.log('dialogList', dialogList);
  // const { conversationId, dialogId, isNew } = useGetChatSearchParams();

  // const addPrologue = useCallback(() => {
  //   if (dialogId !== '' && isNew === 'true') {
  //     const prologue = dialog.prompt_config?.prologue;

  //     const nextMessage = {
  //       role: MessageType.Assistant,
  //       content: prologue,
  //       id: uuid(),
  //     } as IMessage;

  //     setDerivedMessages([nextMessage]);
  //   }
  // }, [isNew, dialog, dialogId, setDerivedMessages]);

  // useEffect(() => {
  //   addPrologue();
  // }, [addPrologue]);

  // useEffect(() => {
  //   if (
  //     conversationId &&
  //     isNew !== 'true' &&
  //     conversation.message?.length > 0
  //   ) {
  //     console.log('conversation.message setting?', conversation.message);
  //     setDerivedMessages(conversation.message);
  //   }

  //   if (!conversationId) {
  //     setDerivedMessages([]);
  //   }
  // }, [conversation.message, conversationId, setDerivedMessages, isNew]);

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
