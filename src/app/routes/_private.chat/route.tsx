import { useCallback, useEffect, useState } from 'react';
import {
  json,
  LoaderFunctionArgs,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node';
import get from 'lodash/get';

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  ScrollArea,
} from '~/components/ui';
import { MessageCircle, Send } from 'lucide-react';

import {
  loader as dialogLoader,
  fetchDialogList,
} from '~/app/routes/dialog.list/route';
import {
  loader as conversationLoader,
  fetchConversationById,
} from '../conversation.get/route';

import {
  MessageType,
  useSendNextMessage,
} from '~/app/hooks/useSendNextMessage';
import { getRagSessionCookie, requireUserSession } from '~/lib/auth';
import { useSelectDerivedConversationList } from '~/app/hooks/useSelectDerivedConversationList';
import { useGetChatSearchParams } from '~/app/hooks/useGetChatSearchParams';
import { useClickDialogCard } from '~/app/hooks/useClickDialogCard';
import { useQuery } from '@tanstack/react-query';
import { useLoaderData } from '@remix-run/react';
import { useFetchUserInfo } from '~/hooks/useFetchUserInfo';
import MessageItem from '~/components/message-item';
import { buildMessageItemReference } from '~/utils/chat/buildMessageItemReference';
import { createClient } from '~/utils/supabase/server';

interface IProps {
  controller: AbortController;
}

export const meta: MetaFunction = () => {
  return [
    { title: 'Chatbot' },
    { name: 'description', content: 'Chat with AI assistant!' },
  ];
};

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  await dialogLoader({ request } as LoaderFunctionArgs);

  const supabase = await createClient(request);

  const { data, error } = await supabase.from('chat').select('*');

  if (error) {
    throw new Error(error.message);
  }

  const { authorization } = await getRagSessionCookie(request);

  const session = await requireUserSession(request);

  if (session) {
    return json({
      authorization,
      data,
    });
  }
};

export default function Chat({ controller }: IProps) {
  const { authorization, data: suggestedQuestionsData } =
    useLoaderData<typeof loader>();

  const { conversationId, isNew } = useGetChatSearchParams();

  const { data: dialogListData } = useQuery({
    queryKey: ['dialogList', authorization],
    queryFn: fetchDialogList,
  });

  const { data: conversationData } = useQuery({
    queryKey: ['fetchConversation', conversationId],
    queryFn: () =>
      fetchConversationById({ authorization, conversationId, isNew }),
    refetchOnWindowFocus: false,
    enabled: !!conversationId,
  });

  const { addTemporaryConversation } = useSelectDerivedConversationList();
  const { dialogId } = useGetChatSearchParams();

  const {
    ref,
    value,
    sendLoading,
    derivedMessages,
    handleInputChange,
    handlePressEnter,
    handlePressQuestion,
  } = useSendNextMessage(controller);

  const handleCreateTemporaryConversation = useCallback(() => {
    addTemporaryConversation();
  }, [addTemporaryConversation]);

  const { handleClickDialog } = useClickDialogCard();

  const { data: userInfo } = useFetchUserInfo();
  // const { data: conversation } = useFetchNextConversation();

  useEffect(() => {
    if (dialogListData && dialogListData.length > 0) {
      if (dialogListData.every((x) => x.id !== dialogId)) {
        handleClickDialog(dialogListData[0].id);
      }
    }
  }, [dialogListData, dialogId, handleClickDialog]);

  useEffect(() => {
    if (dialogId && !conversationId) {
      handleCreateTemporaryConversation();
    }
  }, [conversationId, dialogId, handleCreateTemporaryConversation]);

  const [fileList, setFileList] = useState<any>([]);

  const isUploadingFile = fileList.some((x) => x.status === 'uploading');

  const getFileIds = (fileList: any) => {
    const ids = fileList.reduce((pre, cur) => {
      return pre.concat(get(cur, 'response.data', []));
    }, []);

    return ids;
  };

  const isUploadSuccess = (file: any) => {
    const retcode = get(file, 'response.retcode');
    return typeof retcode === 'number' && retcode === 0;
  };

  const handleSubmit = useCallback(async () => {
    if (isUploadingFile) return;
    const ids = getFileIds(fileList.filter((x) => isUploadSuccess(x)));

    handlePressEnter(ids);
    setFileList([]);
  }, [fileList, handlePressEnter, isUploadingFile]);

  return (
    <div className='flex-1 h-full overflow-hidden p-2 sm:p-4 md:p-6 lg:p-8'>
      <Card className='flex flex-col h-full w-full max-w-4xl mx-auto shadow-xl rounded-xl overflow-hidden'>
        <CardHeader className='p-3 sm:p-4 md:p-6 bg-primary text-primary-foreground rounded-t-xl'>
          <CardTitle className='flex items-center text-base sm:text-lg md:text-xl lg:text-2xl'>
            <MessageCircle className='w-6 h-6 sm:w-7 sm:h-7 mr-2' />
            {dialogListData?.[0]?.name}
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-grow overflow-hidden p-2 sm:p-4 md:p-6'>
          <ScrollArea className='h-full pr-4'>
            <div className='flex flex-col space-y-4'>
              {derivedMessages.map((message, index) => (
                <MessageItem
                  suggestedQuestionsData={suggestedQuestionsData}
                  loading={
                    message.role === MessageType.Assistant &&
                    sendLoading &&
                    derivedMessages.length - 1 === index
                  }
                  key={message.id}
                  item={message}
                  nickname={userInfo.nickname}
                  avatar={userInfo.avatar || 'https://i.pravatar.cc/150?img=3'}
                  reference={buildMessageItemReference(
                    {
                      message: derivedMessages,
                      reference: conversationData?.reference,
                    },
                    message
                  )}
                  index={index}
                  onPressQuestion={handlePressQuestion}
                  sendLoading={sendLoading}
                />
              ))}
            </div>
            <div ref={ref} />
          </ScrollArea>
        </CardContent>
        <CardFooter className='p-2 sm:p-4 md:p-6 bg-muted/50 rounded-b-xl'>
          <Input
            name='chatInput'
            type='text'
            disabled={sendLoading}
            value={value}
            onPressEnter={handlePressEnter}
            onChange={handleInputChange}
            placeholder='Type your message...'
            className='flex-grow text-sm sm:text-base mr-2'
          />

          <Button
            disabled={sendLoading}
            type='button'
            onClick={handleSubmit}
            className='px-3 sm:px-4 bg-primary transition-colors duration-200'
          >
            <Send className='w-4 h-4 sm:mr-2' />
            <span className='hidden sm:inline'>Send</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
