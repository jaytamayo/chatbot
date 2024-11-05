import { memo } from "react";
import MarkdownContent from "~/features/chat/components/markdown-content";
import { AssistantGroupButton } from "./AssistantGroupButton";
import { IMessage } from "~/app/hooks/useSelectDerivedMessages";
import { MessageType } from "~/app/hooks/useSendNextMessage";
import { Avatar, AvatarFallback, AvatarImage } from "../ui";
import { IChat, IReference } from "~/features/chat/components/types";
import * as styles from "./style";

interface IProps {
  item: IMessage;
  suggestedQuestionsData: Array<IChat>;
  reference: IReference;
  loading?: boolean;
  sendLoading?: boolean;
  nickname?: string;
  avatar?: string;
  index: number;
  onPressQuestion(question: string): void;
  showLikeButton?: boolean;
}

const MessageItem = ({
  item,
  suggestedQuestionsData,
  reference,
  loading = false,
  avatar = "",
  index,
  onPressQuestion,
  sendLoading,
  showLikeButton = true,
}: IProps) => {
  const isAssistant = item.role === MessageType.Assistant;
  const isUser = item.role === MessageType.User;

  return (
    <div className={styles.messageItem(isAssistant)}>
      <section className={styles.messageItemSection(isAssistant)}>
        <div className={styles.messageItemContent(isUser)}>
          {isUser ? (
            <Avatar>
              <AvatarImage src={avatar} alt="@shadcn" />
              <AvatarFallback>USER</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar>
              <AvatarImage
                src={"https://i.pravatar.cc/150?img=1"}
                alt="@shadcn"
              />
            </Avatar>
          )}
          <div className="flex">
            <div className="flex-1 flex-col gap-8">
              <div className="space-x-4 ">
                {isAssistant && index !== 0 && (
                  <AssistantGroupButton
                    messageId={item.id}
                    content={item.content}
                    showLikeButton={showLikeButton}
                  ></AssistantGroupButton>
                )}
              </div>
              <div className={styles.markdownSection(isAssistant)}>
                <MarkdownContent
                  index={index}
                  suggestedQuestionsData={suggestedQuestionsData}
                  loading={loading}
                  content={item.content}
                  onPressQuestion={onPressQuestion}
                  reference={reference}
                  sendLoading={sendLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default memo(MessageItem);
