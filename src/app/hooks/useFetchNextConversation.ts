export const useFetchNextConversation = () => {
  const { isNew, conversationId } = useGetChatSearchParams();
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
        const { data } = await chatService.getConversation({ conversationId });

        const conversation = data?.data ?? {};

        const messageList = buildMessageListWithUuid(conversation?.message);

        console.log('{ ...conversation, message: messageList }', {
          ...conversation,
          message: messageList,
        });
        return { ...conversation, message: messageList };
      }
      return { message: [] };
    },
  });

  return { data, loading, refetch };
};
