import { SetStateAction } from 'react';
import Chat from '~/app/routes/_private.chat/route';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '~/components/ui';

export function ChatSheet({
  isOpen,
  setChatSheetDisplay,
}: {
  isOpen?: boolean;
  setChatSheetDisplay?: React.Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Sheet open={isOpen} onOpenChange={setChatSheetDisplay}>
      <SheetTitle className='sr-only'>Conversation History</SheetTitle>
      <SheetHeader className='sr-only'>
        <SheetDescription>
          Sheet that shows your previous conversation
        </SheetDescription>
      </SheetHeader>
      <SheetContent>
        <Chat />
      </SheetContent>
    </Sheet>
  );
}
