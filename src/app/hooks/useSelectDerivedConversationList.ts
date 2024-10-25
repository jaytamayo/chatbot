import { useCallback, useEffect, useState } from 'react';
import { useLoaderData } from '@remix-run/react';
import { useQuery } from '@tanstack/react-query';

import { useGetChatSearchParams } from './useGetChatSearchParams';
import { useSetNewConversationRouteParams } from './useSetNewConversationRouteParams';
import { MessageType } from './useSendNextMessage';
import { IConversation } from './queries/useFetchNextConversation';
import { useFetchNextConversationList } from './queries/useFetchNextConversationList';
import { loader } from '~/app/routes/_private.chat/route';
import { fetchDialogList } from '../routes/dialog.list/route';
import { getConversationId } from '~/utils/chat/getConversationId';

export const useSelectDerivedConversationList = () => {
  const { authorization } = useLoaderData<typeof loader>();

  const { data } = useQuery({
    queryKey: ['dialogList', authorization],
    queryFn: fetchDialogList,
  });

  const currentDialog = data?.[0];

  const [list, setList] = useState<Array<IConversation>>([]);
  const { data: conversationList, loading } = useFetchNextConversationList();

  const { dialogId } = useGetChatSearchParams();
  const prologue = currentDialog?.prompt_config?.prologue ?? '';

  const { setNewConversationRouteParams } = useSetNewConversationRouteParams();

  const addTemporaryConversation = useCallback(() => {
    const conversationId = getConversationId();
    setList((pre) => {
      if (dialogId) {
        setNewConversationRouteParams(conversationId, 'true');

        const nextList = [
          {
            id: conversationId,
            name: 'New conversation',
            dialog_id: dialogId,
            is_new: true,
            message: [
              {
                content: prologue,
                role: MessageType.Assistant,
              },
            ],
          } as any,
          ...conversationList,
        ];
        return nextList;
      }

      return pre;
    });
  }, [conversationList, dialogId, prologue, setNewConversationRouteParams]);

  // When you first enter the page, select the top conversation card

  useEffect(() => {
    setList([...conversationList]);
  }, [conversationList]);

  return { list, addTemporaryConversation, loading };
};
