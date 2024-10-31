import { Message } from '~/app/hooks/useSelectDerivedMessages';

export interface IRemoveMessageById {
  removeMessageById(messageId: string): void;
}

export interface IRegenerateMessage {
  regenerateMessage?: (message: Message) => void;
}

export interface UserGroupButtonProps extends Partial<IRemoveMessageById> {
  messageId: string;
  content: string;
  regenerateMessage?: () => void;
  sendLoading: boolean;
}
