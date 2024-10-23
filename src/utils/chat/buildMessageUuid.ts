import { MessageType } from '~/app/hooks/useSendNextMessage';
import { v4 as uuid } from 'uuid';
import { IMessage, Message } from '~/app/hooks/useSelectDerivedMessages';

export const buildMessageUuid = (message: Partial<Message | IMessage>) => {
  if ('id' in message && message.id) {
    return message.role === MessageType.User
      ? `${MessageType.User}_${message.id}`
      : `${MessageType.Assistant}_${message.id}`;
  }
  return uuid();
};
