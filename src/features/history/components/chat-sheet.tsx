import { ReactElement, SetStateAction } from 'react';
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
  children,
}: {
  isOpen?: boolean;
  setChatSheetDisplay?: React.Dispatch<SetStateAction<boolean>>;
  children: ReactElement;
}) {
  return (
    <Sheet open={isOpen} onOpenChange={setChatSheetDisplay}>
      <SheetTitle className='sr-only'>Conversation History</SheetTitle>
      <SheetHeader className='sr-only'>
        <SheetDescription>
          Sheet that shows your previous conversation
        </SheetDescription>
      </SheetHeader>
      <SheetContent>{children}</SheetContent>
    </Sheet>
  );
}
