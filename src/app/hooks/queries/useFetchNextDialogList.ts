import { useQuery } from "@tanstack/react-query";
import { useGetChatSearchParams } from "../useGetChatSearchParams";
import { IDialog } from "~/app/routes/dialog.list/interface";
import { redirect, useLoaderData } from "@remix-run/react";
import { useClickDialogCard } from "../useClickDialogCard";
import { loader } from "~/app/routes/chat/route";

export const useFetchNextDialogList = () => {
  const { handleClickDialog } = useClickDialogCard();
  const { dialogId } = useGetChatSearchParams();
  const loaderData = useLoaderData<typeof loader>();

  const {
    data,
    isFetching: loading,
    refetch,
  } = useQuery<IDialog[]>({
    queryKey: ["fetchDialogList"],
    gcTime: 0,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const response = await fetch("http://localhost:9380/v1/dialog/list", {
        method: "GET",
        headers: {
          Authorization: loaderData?.authorization,
          "Content-Type": "application/json",
        },
      });

      const { data, retcode } = await response.json();

      if (retcode === 0) {
        const list: IDialog[] = data;
        if (list.length > 0) {
          if (list.every((x) => x.id !== dialogId)) {
            handleClickDialog(list[0].id);
          }
        } else {
          throw redirect("/chat");
        }
      }

      return data ?? [];
    },
  });

  return { data, loading, refetch };
};
