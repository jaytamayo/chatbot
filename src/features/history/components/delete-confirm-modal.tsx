import { useState } from 'react';
import { DeleteconvoPayload } from '~/app/types/history';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui';

export function useDeleteConfirmModal() {
  const [deleteModalDisplay, setDeleteModalDisplay] = useState(false);
  const [deletePayload, setDeleteconvoPayload] = useState({});

  const handleRemoveDialog = (deleteconvoPayload: DeleteconvoPayload) => {
    setDeleteconvoPayload(deleteconvoPayload);

    setDeleteModalDisplay((prevVal) => !prevVal);
  };

  const DeleteConfirmModal = ({ submit }) => {
    return (
      <AlertDialog
        open={deleteModalDisplay}
        onOpenChange={setDeleteModalDisplay}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const formData = new FormData();

                Object.entries(deletePayload).forEach(([key, value]) => {
                  formData.append(key, JSON.stringify(value));
                });

                submit(formData, { method: 'POST' });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return {
    DeleteConfirmModal,
    deleteModalDisplay,
    setDeleteModalDisplay,
    handleRemoveDialog,
  };
}
