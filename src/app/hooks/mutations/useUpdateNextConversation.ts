import { useLoaderData } from '@remix-run/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loader } from '~/app/routes/_private.chat/route';
import { getConversationId } from '~/utils/chat/buildMessageListWithUuid';

export const useUpdateNextConversation = () => {
  const queryClient = useQueryClient();
  const loaderData = useLoaderData<typeof loader>();

  const {
    data,
    isPending: loading,
    mutateAsync,
  } = useMutation({
    mutationKey: ['updateConversation'],
    mutationFn: async (params: Record<string, any>) => {
      const response = await fetch(
        'http://127.0.0.1:9380/v1//conversation/set',
        {
          method: 'POST',
          headers: {
            Authorization: loaderData?.authorization,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...params,
            conversation_id: params.conversation_id
              ? params.conversation_id
              : getConversationId(),
          }),
        }
      );

      const data = await response.json();

      if (data.retcode === 0) {
        queryClient.invalidateQueries({ queryKey: ['fetchConversationList'] });
      }
      return data;
    },
  });

  return { data, loading, updateConversation: mutateAsync };
};
