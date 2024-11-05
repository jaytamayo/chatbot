import { MouseEventHandler, useCallback, useEffect, useState } from 'react';
import { ArrowUpDown, Ellipsis } from 'lucide-react';
import { useLoaderData } from '@remix-run/react';
import { useQuery } from '@tanstack/react-query';
import { json, LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';

import { useClickDialogCard } from '~/app/hooks/useClickDialogCard';
import { useGetChatSearchParams } from '~/app/hooks/useGetChatSearchParams';
import { useFetchNextConversationList } from '~/app/hooks/queries/useFetchNextConversationList';
import { getRagSessionCookie, requireUserSession } from '~/lib/auth';
import {
  loader as dialogLoader,
  fetchDialogList,
} from '~/app/routes/dialog.list/route';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui';
import { DataTable } from '~/components/data-table';
import { ColumnDef } from '@tanstack/react-table';
import {
  IConversation,
  useFetchNextConversation,
} from '~/app/hooks/queries/useFetchNextConversation';
import { ChatSheet } from '~/features/history/components/chat-sheet';
import { useSetNewConversationRouteParams } from '~/app/hooks/useSetNewConversationRouteParams';
import { IDialog } from '../dialog.list/interface';

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

export default function ChatHistory() {
  const [controller, setController] = useState(new AbortController());
  const [chatSheetDisplay, setChatSheetDisplay] = useState(false);

  const { authorization } = useLoaderData<typeof loader>();
  const { dialogId } = useGetChatSearchParams();

  const { data: dialogListData } = useQuery({
    queryKey: ['dialogList', authorization],
    queryFn: fetchDialogList,
  });

  const { data: conversationList, refetch } = useFetchNextConversationList();
  const { handleClickDialog } = useClickDialogCard();
  const { setNewConversationRouteParams } = useSetNewConversationRouteParams();

  const { refetch: fetchConversationById } = useFetchNextConversation();

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
      fetchConversationById();
      setController((pre) => {
        pre.abort();
        return new AbortController();
      });
      setChatSheetDisplay(true);
    },
    [fetchConversationById, setNewConversationRouteParams]
  );

  const tableColumns = columns({ handleConversationCardClick });

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
      />
    </div>
  );
}

export const columns = ({
  handleConversationCardClick,
}: {
  handleConversationCardClick: (
    id: string,
    is_new: boolean
  ) => MouseEventHandler<HTMLButtonElement>;
}): ColumnDef<IConversation>[] => {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() =>
              column.toggleSorting(column.getNextSortingOrder() === 'asc')
            }
          >
            Chat
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => {
        const cellData = row.original;

        return (
          <div className='capitalize'>
            <Button
              variant='link'
              className='underline cursor-pointer text-white'
              onClick={handleConversationCardClick(
                cellData?.id,
                cellData?.is_new
              )}
            >
              {row.getValue('name')}
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: 'create_date',
      header: 'Date',
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <Ellipsis className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                //delete chat
                onClick={() => row}
              >
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
