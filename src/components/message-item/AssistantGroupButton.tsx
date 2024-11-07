import { useCallback } from "react";
import { useTranslation } from "react-i18next";
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
import { RadioGroupIndicator } from "@radix-ui/react-radio-group";
import { ThumbsDown, ThumbsUp } from "lucide-react";

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
  const { t } = useTranslation();

  const { visible, hideModal, showModal, onFeedbackOk, loading } =
    useSendFeedback(messageId);

  const handleLike = useCallback(() => {
    onFeedbackOk({ thumbup: true });
  }, [onFeedbackOk]);

  return (
    <>
      <RadioGroup className="flex items-center align-middle">
        <RadioGroupItem id="copy" className="hidden" value="copy">
          <RadioGroupIndicator className="relative flex size-full items-center justify-center after:block after:size-[11px] after:rounded-full after:bg-violet11" />
        </RadioGroupItem>
        <label htmlFor="copy">
          <CopyToClipboard text={content} />
        </label>

        {showLikeButton && (
          <>
            <RadioGroupItem
              id="like"
              className="hidden"
              value="like"
              onClick={handleLike}
            >
              <RadioGroupIndicator className="RadioGroupIndicator" />
            </RadioGroupItem>
            <label htmlFor="like">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <ThumbsUp className="cursor-pointer size-5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("like")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <RadioGroupItem
              id="dislike"
              className="hidden"
              value="dislike"
              onClick={showModal}
            >
              <RadioGroupIndicator className="RadioGroupIndicator" />
            </RadioGroupItem>
            <label htmlFor="test">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <ThumbsDown className="cursor-pointer size-5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("dislike")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
