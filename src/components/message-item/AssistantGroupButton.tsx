import { useCallback } from 'react';
import { DislikeOutlined, LikeOutlined } from '@ant-design/icons';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useSendFeedback } from './hooks';
import FeedbackModal from './FeedBackModal';
import CopyToClipboard from '../CopyToClipboard';
import { RadioGroupIndicator } from '@radix-ui/react-radio-group';

interface IProps {
  messageId: string;
  content: string;
  showLikeButton: boolean;
}

export const AssistantGroupButton = ({
  messageId,
  content,
  showLikeButton,
}: IProps) => {
  const { visible, hideModal, showModal, onFeedbackOk, loading } =
    useSendFeedback(messageId);

  const handleLike = useCallback(() => {
    onFeedbackOk({ thumbup: true });
  }, [onFeedbackOk]);

  return (
    <>
      {/* need to fix styles */}
      <RadioGroup>
        <RadioGroupItem id='copy' className='hidden' value='copy'>
          <RadioGroupIndicator className='relative flex size-full items-center justify-center after:block after:size-[11px] after:rounded-full after:bg-violet11' />
        </RadioGroupItem>
        <label htmlFor='copy'>
          <CopyToClipboard text={content} />
        </label>
        {showLikeButton && (
          <>
            <RadioGroupItem
              id='like'
              className='hidden'
              value='like'
              onClick={handleLike}
            >
              <RadioGroupIndicator className='RadioGroupIndicator' />
            </RadioGroupItem>
            <label htmlFor='like'>
              <LikeOutlined />
            </label>
            <RadioGroupItem
              id='dislike'
              className='hidden'
              value='dislike'
              onClick={showModal}
            >
              <RadioGroupIndicator className='RadioGroupIndicator' />
            </RadioGroupItem>
            <label htmlFor='dislike'>
              <DislikeOutlined />
            </label>
          </>
        )}
      </RadioGroup>
      {visible && (
        <FeedbackModal
          visible={visible}
          hideModal={hideModal}
          onOk={onFeedbackOk}
          loading={loading}
        />
      )}
    </>
  );
};
