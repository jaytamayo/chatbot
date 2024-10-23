import { useCallback } from 'react';
import { useUpdateNextConversation } from './mutations/useUpdateNextConversation';
import { useGetChatSearchParams } from './useGetChatSearchParams';

export const useSetConversation = () => {
  const { dialogId } = useGetChatSearchParams();
  const { updateConversation } = useUpdateNextConversation();

  const setConversation = useCallback(
    async (
      message: string,
      isNew: boolean = false,
      conversationId?: string
    ) => {
      const data = await updateConversation({
        dialog_id: dialogId,
        name: message,
        is_new: isNew,
        conversation_id: conversationId,
        message: [
          {
            role: 'assistant',
            content: message,
          },
        ],
      });

      return data;
    },
    [updateConversation, dialogId]
  );

  return { setConversation };
};
