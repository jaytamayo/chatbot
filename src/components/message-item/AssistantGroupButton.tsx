import { useCallback } from "react";
import { DislikeOutlined, LikeOutlined } from "@ant-design/icons";
import { useSendFeedback } from "./hooks";
import FeedbackModal from "./FeedBackModal";
import CopyToClipboard from "../CopyToClipboard";
import {
  RadioGroup,
  RadioGroupItem,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui";

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
      <RadioGroup className="flex items-center ">
        <div className="flex items-start">
          <RadioGroupItem id="copy" value="copy" className="sr-only peer" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <label
                  htmlFor="copy"
                  className="cursor-pointer p-2 rounded-full hover:bg-gray-100 peer-checked:bg-gray-200"
                >
                  <CopyToClipboard text={content} />
                </label>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy to clipboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {showLikeButton && (
          <>
            <div className="flex items-center">
              <RadioGroupItem id="like" value="like" className="sr-only peer" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <label
                      htmlFor="like"
                      className="cursor-pointer p-2 rounded-full hover:bg-gray-100 peer-checked:bg-gray-200"
                    >
                      <LikeOutlined onClick={handleLike} />
                    </label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Like</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex items-center">
              <RadioGroupItem
                id="dislike"
                value="dislike"
                className="sr-only peer"
                onClick={showModal}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <label
                      htmlFor="dislike"
                      className="cursor-pointer p-2 rounded-full hover:bg-gray-100 peer-checked:bg-gray-200"
                    >
                      <DislikeOutlined />
                    </label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Dislike</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
