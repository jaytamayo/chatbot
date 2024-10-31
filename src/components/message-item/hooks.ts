import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useGetChatSearchParams } from '~/app/hooks/useGetChatSearchParams';
import { getMessagePureId } from '~/utils/chat/getMessagePureId';
import { toast } from 'sonner';
import { loader } from '~/app/routes/_private.chat/route';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from '@remix-run/react';
import { useSetModalState } from '~/app/hooks/useSetModalState';
import { IFeedbackRequestBody } from './FeedBackModal';

export const useSendFeedback = (messageId: string) => {
  const { visible, hideModal, showModal } = useSetModalState();
  const { feedback, loading } = useFeedback();

  const onFeedbackOk = useCallback(
    async (params: IFeedbackRequestBody) => {
      const ret = await feedback({
        ...params,
        messageId: getMessagePureId(messageId),
      });

      if (ret === 0) {
        hideModal();
      }
    },
    [feedback, hideModal, messageId]
  );

  return {
    loading,
    onFeedbackOk,
    visible,
    hideModal,
    showModal,
  };
};

export const useFeedback = () => {
  const { conversationId } = useGetChatSearchParams();
  const loaderData = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  const {
    data,
    isPending: loading,
    mutateAsync,
  } = useMutation({
    mutationKey: ['feedback'],
    mutationFn: async (params: IFeedbackRequestBody) => {
      const response = await fetch(
        'http://127.0.0.1:9380/v1//conversation/set',
        {
          method: 'POST',
          headers: {
            Authorization: loaderData?.authorization,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...params,
            conversation_id: conversationId,
          }),
        }
      );

      const data = await response.json();

      if (data.retcode === 0) {
        toast.success(t(`message.operated`));
      }

      return data.retcode;
    },
  });

  return { data, loading, feedback: mutateAsync };
};
