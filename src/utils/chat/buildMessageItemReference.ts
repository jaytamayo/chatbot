import { IMessage } from '~/app/hooks/useSelectDerivedMessages';
import { MessageType } from '~/app/hooks/useSendNextMessage';
import { IReference } from '~/features/chat/types';

export const buildMessageItemReference = (
  conversation: { message: IMessage[]; reference: IReference[] },
  message: IMessage
) => {
  const assistantMessages = conversation.message
    ?.filter((x) => x.role === MessageType.Assistant)
    .slice(1);
  const referenceIndex = assistantMessages.findIndex(
    (x) => x.id === message.id
  );
  const reference = message?.reference
    ? message?.reference
    : (conversation?.reference ?? {})[referenceIndex];

  return reference;
};
