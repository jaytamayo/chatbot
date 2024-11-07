import { ActionFunctionArgs, json } from '@remix-run/node';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getRagSessionCookie } from '~/lib/auth';
import { buildMessageListWithUuid } from '~/utils/chat/buildMessageListWithUuid';

export const isConversationIdExist = (conversationId: string) => {
  return conversationId !== 'empty' && conversationId !== '';
};

export async function loader({ request }: ActionFunctionArgs) {
  const queryClient = new QueryClient();

  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversationId') as string;
  const isNew = searchParams.get('isNew') as string;

  const { authorization } = await getRagSessionCookie(request);

  await queryClient.fetchQuery({
    queryKey: ['fetchConversation', conversationId],
    queryFn: () =>
      fetchConversationById({ authorization, conversationId, isNew }),
    gcTime: 0,
  });

  return json({ dehydratedState: dehydrate(queryClient) });
}

export async function fetchConversationById({
  authorization,
  conversationId,
  isNew,
}: {
  authorization: string;
  conversationId: string;
  isNew: string;
}) {
  if (isNew !== 'true' && isConversationIdExist(conversationId)) {
    const response = await fetch(
      `http://127.0.0.1:9380/v1/conversation/get?conversation_id=${conversationId}`,
      {
        method: 'GET',
        headers: {
          Authorization: authorization,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    const conversation = data?.data ?? {};

    const messageList = buildMessageListWithUuid(conversation?.message);

    return { ...conversation, message: messageList };
  }
  return { message: [] };
}
