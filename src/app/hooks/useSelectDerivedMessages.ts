import { useCallback, useState } from 'react';
import { useScrollToBottom } from './useScrollToBottom';
import { MessageType } from './useSendNextMessage';
import { buildMessageUuid } from '~/utils/chat/buildMessageUuid';
import { getMessagePureId } from '~/utils/chat/getMessagePureId';
import { IReference } from '~/features/chat/components/types';

export interface Message {
  content: string;
  role: MessageType;
  doc_ids?: string[];
  prompt?: string;
  id?: string;
  audio_binary?: string;
}

export interface IMessage extends Message {
  id: string;
  reference?: IReference; // the latest news has reference
}

export const useSelectDerivedMessages = () => {
  const [derivedMessages, setDerivedMessages] = useState<IMessage[]>([]);

  const ref = useScrollToBottom(derivedMessages);

  const addNewestQuestion = useCallback(
    (message: Message, answer: string = '') => {
      setDerivedMessages((pre) => {
        return [
          ...pre,
          {
            ...message,
            id: buildMessageUuid(message),
          },
          {
            role: MessageType.Assistant,
            content: answer,
            id: buildMessageUuid({ ...message, role: MessageType.Assistant }),
          },
        ];
      });
    },
    []
  );

  // Add the streaming message to the last item in the message list
  const addNewestAnswer = useCallback((answer: IAnswer) => {
    setDerivedMessages((pre) => {
      return [
        ...(pre?.slice(0, -1) ?? []),
        {
          role: MessageType.Assistant,
          content: answer.answer,
          reference: answer.reference,
          id: buildMessageUuid({
            id: answer.id,
            role: MessageType.Assistant,
          }),
          prompt: answer.prompt,
          audio_binary: answer.audio_binary,
        },
      ];
    });
  }, []);

  const removeLatestMessage = useCallback(() => {
    setDerivedMessages((pre) => {
      const nextMessages = pre?.slice(0, -2) ?? [];
      return nextMessages;
    });
  }, []);

  const removeMessageById = useCallback(
    (messageId: string) => {
      setDerivedMessages((pre) => {
        const nextMessages =
          pre?.filter(
            (x) => getMessagePureId(x.id) !== getMessagePureId(messageId)
          ) ?? [];
        return nextMessages;
      });
    },
    [setDerivedMessages]
  );

  const removeMessagesAfterCurrentMessage = useCallback(
    (messageId: string) => {
      setDerivedMessages((pre) => {
        const index = pre.findIndex((x) => x.id === messageId);
        if (index !== -1) {
          let nextMessages = pre.slice(0, index + 2) ?? [];
          const latestMessage = nextMessages.at(-1);
          nextMessages = latestMessage
            ? [
                ...nextMessages.slice(0, -1),
                {
                  ...latestMessage,
                  content: '',
                  reference: undefined,
                  prompt: undefined,
                },
              ]
            : nextMessages;
          return nextMessages;
        }
        return pre;
      });
    },
    [setDerivedMessages]
  );

  return {
    ref,
    derivedMessages,
    setDerivedMessages,
    addNewestQuestion,
    addNewestAnswer,
    removeLatestMessage,
    removeMessageById,
    removeMessagesAfterCurrentMessage,
  };
};
