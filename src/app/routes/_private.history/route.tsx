import { useCallback, useEffect, useState } from 'react';
import { useActionData, useLoaderData, useSubmit } from '@remix-run/react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import {
  ActionFunctionArgs,
  json,
  LoaderFunction,
  LoaderFunctionArgs,
} from '@remix-run/node';

import { useClickDialogCard } from '~/app/hooks/useClickDialogCard';
import { useGetChatSearchParams } from '~/app/hooks/useGetChatSearchParams';
import { useFetchNextConversationList } from '~/app/hooks/queries/useFetchNextConversationList';
import { getRagSessionCookie, requireUserSession } from '~/lib/auth';
import {
  loader as dialogLoader,
  fetchDialogList,
} from '~/app/routes/dialog.list/route';

import { DataTable } from '~/components/data-table';
import { ChatSheet } from '~/features/history/components/chat-sheet';
import { useSetNewConversationRouteParams } from '~/app/hooks/useSetNewConversationRouteParams';
import { IDialog } from '../dialog.list/interface';
import Chat from '../_private.chat/route';
import { useDeleteConfirmModal } from '~/features/history/components/delete-confirm-modal';
import { toast } from 'sonner';
import { historyTableColumns } from '~/features/history/table-column';

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  await dialogLoader({ request } as LoaderFunctionArgs);

  const { authorization } = await getRagSessionCookie(request);

  const session = await requireUserSession(request);

  if (session) {
    return json({
      authorization,
    });
  }
};

export async function action({ request }: ActionFunctionArgs) {
  const { authorization } = await getRagSessionCookie(request);
  const queryClient = new QueryClient();

  const body = await request.formData();
  const dialogId = JSON.parse(body.get('dialog_id') as string);
  const conversationIds = JSON.parse(body.get('conversation_ids') as string);

  const response = await fetch('http://localhost:9380/v1/conversation/rm', {
    method: 'POST',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dialog_id: dialogId,
      conversation_ids: conversationIds,
    }),
  });

  const data = await response.json();

  if (data.retcode === 0) {
    queryClient.invalidateQueries({ queryKey: ['fetchConversationList'] });

    toast.success('DELETED');
  }

  return json(data);
}

export default function ChatHistory() {
  const { authorization } = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();

  const [controller, setController] = useState(new AbortController());
  const [chatSheetDisplay, setChatSheetDisplay] = useState(false);

  const { dialogId } = useGetChatSearchParams();

  const { data: dialogListData } = useQuery({
    queryKey: ['dialogList', authorization],
    queryFn: fetchDialogList,
  });

  const { data: conversationList, refetch } = useFetchNextConversationList();
  const { handleClickDialog } = useClickDialogCard();
  const { setNewConversationRouteParams } = useSetNewConversationRouteParams();

  const { DeleteConfirmModal, handleRemoveDialog } = useDeleteConfirmModal();

  const submit = useSubmit();

  //change this to use loader featcher with useFetchNextConversationList
  useEffect(() => {
    if (data && data?.retcode === 0) {
      refetch();
    }
  }, [data]);

  useEffect(() => {
    if (dialogListData && dialogListData.length > 0) {
      if (dialogListData.every((dialog: IDialog) => dialog.id !== dialogId)) {
        handleClickDialog(dialogListData[0].id);
      }
    }
  }, [dialogListData, dialogId, handleClickDialog]);

  useEffect(() => {
    refetch(); //trigger refetch of conversationList when dialogId is available
  }, [dialogId, refetch]);

  const handleConversationCardClick = useCallback(
    (conversationId: string, isNew: boolean) => () => {
      setNewConversationRouteParams(conversationId, isNew ? 'true' : '');
      setController((pre) => {
        pre.abort();
        return new AbortController();
      });
      setChatSheetDisplay(true);
    },
    [setNewConversationRouteParams]
  );

  const tableColumns = historyTableColumns({
    handleConversationCardClick,
    handleRemoveDialog,
  });

  return (
    <div className='p-8'>
      <DataTable
        data={conversationList}
        columns={tableColumns}
        filterColumnBy={'name'}
      />
      <ChatSheet
        isOpen={chatSheetDisplay}
        setChatSheetDisplay={() => setChatSheetDisplay((prev) => !prev)}
      >
        <Chat controller={controller} />
      </ChatSheet>
      <DeleteConfirmModal submit={submit} />
    </div>
  );
}
