import { ActionFunctionArgs } from '@remix-run/node';
import { useGetChatSearchParams } from '~/app/hooks/useGetChatSearchParams';
import { getRagSessionCookie } from '~/lib/auth';
import { buildMessageListWithUuid } from '~/utils/chat/buildMessageListWithUuid';

export const isConversationIdExist = (conversationId: string) => {
  return conversationId !== 'empty' && conversationId !== '';
};

export async function loader({ params, request }: ActionFunctionArgs) {
  const { authorization } = await getRagSessionCookie(request);

  const body = await request.formData();

  console.log('params', params);

  // const { isNew, conversationId } = useGetChatSearchParams();
  const { isNew, conversationId } = params;

  if (isNew !== 'true' && isConversationIdExist(conversationId)) {
    // const { data } = await chatService.getConversation({ conversationId });

    const response = await fetch('http://localhost:9380/v1//conversation/get', {
      method: 'GET',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversationId,
      }),
    });

    console.log('response', response);

    // const conversation = data?.data ?? {};

    // const messageList = buildMessageListWithUuid(conversation?.message);

    // console.log('{ ...conversation, message: messageList }', {
    //   ...conversation,
    //   message: messageList,
    // });
    // return { ...conversation, message: messageList };
  }
  // return { message: [] };

  return null;
}
