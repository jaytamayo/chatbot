import { useCallback, useEffect, useState } from "react";
import { useGetChatSearchParams } from "./useGetChatSearchParams";
import { useSetNewConversationRouteParams } from "./useSetNewConversationRouteParams";
import { getConversationId } from "~/utils/chat/getConversationId";
import { MessageType } from "./useSendNextMessage";
import { IConversation } from "./queries/useFetchNextConversation";
import { useFetchNextConversationList } from "./queries/useFetchNextConversationList";
import { useLoaderData } from "@remix-run/react";
import { loader } from "~/app/routes/chat/route";

export const useSelectDerivedConversationList = () => {
  const loaderData = useLoaderData<typeof loader>();
  const currentDialog = loaderData?.dialogList?.[0];
  const [list, setList] = useState<Array<IConversation>>([]);
  const { data: conversationList, loading } = useFetchNextConversationList();

  const { dialogId } = useGetChatSearchParams();
  const prologue = currentDialog?.prompt_config?.prologue ?? "";
  const { setNewConversationRouteParams } = useSetNewConversationRouteParams();

  const addTemporaryConversation = useCallback(() => {
    const conversationId = getConversationId();
    setList((pre) => {
      if (dialogId) {
        setNewConversationRouteParams(conversationId, "true");

        const nextList = [
          {
            id: conversationId,
            name: "New conversation",
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
