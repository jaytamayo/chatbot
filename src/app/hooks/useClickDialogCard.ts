import { useSearchParams } from "@remix-run/react";
import { useCallback, useMemo } from "react";
import { ChatSearchParams } from "./useSetNewConversationRouteParams";

export const useClickDialogCard = () => {
  const [_, setSearchParams] = useSearchParams();

  const newQueryParameters: URLSearchParams = useMemo(() => {
    return new URLSearchParams();
  }, []);

  const handleClickDialog = useCallback(
    (dialogId: string) => {
      newQueryParameters.set(ChatSearchParams.DialogId, dialogId);
      setSearchParams(newQueryParameters);
    },
    [newQueryParameters, setSearchParams]
  );

  return { handleClickDialog };
};
