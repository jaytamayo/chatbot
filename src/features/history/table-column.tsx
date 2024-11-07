import { MouseEventHandler } from 'react';
import { ArrowUpDown, Ellipsis } from 'lucide-react';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui';
import { ColumnDef } from '@tanstack/react-table';
import { IConversation } from '~/app/hooks/queries/useFetchNextConversation';

import { DeleteconvoPayload } from '~/app/types/history';

export const historyTableColumns = ({
  handleConversationCardClick,
  handleRemoveDialog,
}: {
  handleConversationCardClick: (
    id: string,
    is_new: boolean
  ) => MouseEventHandler<HTMLButtonElement>;
  handleRemoveDialog: (deleteconvoPayload: DeleteconvoPayload) => void;
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
      accessorKey: 'id',
      header: 'Conversation ID',
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const cellData = row.original;

        const deleteconvoPayload: DeleteconvoPayload = {
          dialog_id: cellData?.dialog_id,
          conversation_ids: [cellData?.id],
        };

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
                onClick={() => handleRemoveDialog(deleteconvoPayload)}
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
