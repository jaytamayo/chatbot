import { useQuery } from '@tanstack/react-query';
import { useGetChatSearchParams } from '../useGetChatSearchParams';
import { IMessage, IReference, Message } from '../useSelectDerivedMessages';
import { isConversationIdExist } from '~/app/routes/conversation.get/route';
import { buildMessageListWithUuid } from '~/utils/chat/buildMessageListWithUuid';
import { loader } from '~/app/routes/chat/route';
import { useLoaderData } from '@remix-run/react';

// Hook for fetching the contents of selected existing chat/conversation
export const useFetchNextConversation = () => {
  const { isNew, conversationId } = useGetChatSearchParams();
  const loaderData = useLoaderData<typeof loader>();

  const {
    data,
    isFetching: loading,
    refetch,
  } = useQuery<IClientConversation>({
    queryKey: ['fetchConversation', conversationId],
    initialData: {} as IClientConversation,
    // enabled: isConversationIdExist(conversationId),
    gcTime: 0,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (isNew !== 'true' && isConversationIdExist(conversationId)) {
        const response = await fetch(
          'http://127.0.0.1:9380/v1//conversation/get',
          {
            method: 'GET',
            headers: {
              Authorization: loaderData?.authorization,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              conversationId,
            }),
          }
        );

        const data = await response.json();

        const conversation = data?.data ?? {};

        const messageList = buildMessageListWithUuid(conversation?.message);

        return { ...conversation, message: messageList };
      }
      return { message: [] };
    },
  });

  return { data, loading, refetch };
};

export interface IConversation {
  create_date: string;
  create_time: number;
  dialog_id: string;
  id: string;
  message: Message[];
  reference: IReference[];
  name: string;
  update_date: string;
  update_time: number;
  is_new: true;
}

export interface IClientConversation extends IConversation {
  message: IMessage[];
}
