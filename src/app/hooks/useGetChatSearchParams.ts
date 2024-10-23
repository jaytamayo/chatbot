import { useSearchParams } from '@remix-run/react';

export const useGetChatSearchParams = () => {
  const [searchParams] = useSearchParams();

  return {
    dialogId: searchParams.get('dialogId') || '',
    conversationId: searchParams.get('conversationId') || '',
    isNew: searchParams.get('isNew') || '',
  };
};
