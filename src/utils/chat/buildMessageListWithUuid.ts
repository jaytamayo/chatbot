import { IMessage, Message } from '~/app/hooks/useSelectDerivedMessages';
import { buildMessageUuid } from './buildMessageUuid';
import { v4 as uuid } from 'uuid';

export const buildMessageListWithUuid = (messages?: Message[]) => {
  return (
    messages?.map((x: Message | IMessage) => ({
      ...x,
      id: buildMessageUuid(x),
    })) ?? []
  );
};

export const getConversationId = () => {
  return uuid().replace(/-/g, '');
};
