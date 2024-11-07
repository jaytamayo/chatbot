import { useQuery } from '@tanstack/react-query';
import { useGetChatSearchParams } from '../useGetChatSearchParams';
import { IConversation } from './useFetchNextConversation';
import { useLoaderData } from '@remix-run/react';
import { loader } from '~/app/routes/_private.chat/route';
import { useSetNewConversationRouteParams } from '../useSetNewConversationRouteParams';

export const useFetchNextConversationList = () => {
  const loaderData = useLoaderData<typeof loader>();
  const { dialogId } = useGetChatSearchParams();

  const { setNewConversationRouteParams } = useSetNewConversationRouteParams();

  const {
    data,
    isFetching: loading,
    refetch,
  } = useQuery<IConversation[]>({
    queryKey: ['fetchConversationList'],
    initialData: [],
    gcTime: 0,
    refetchOnWindowFocus: false,
    enabled: !!dialogId,
    queryFn: async () => {
      const response = await fetch(
        `http://127.0.0.1:9380/v1/conversation/list?dialog_id=${dialogId}`,
        {
          method: 'GET',
          headers: {
            Authorization: loaderData?.authorization,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.retcode === 0 && data.data.length > 0) {
        setNewConversationRouteParams(data.data[0].id, '');
      }
      return data?.data;
    },
  });

  return { data, loading, refetch };
};
