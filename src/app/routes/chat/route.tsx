import { useCallback, useEffect, useRef, useState } from 'react';
import { useLoaderData } from '@remix-run/react';
import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import get from 'lodash/get';
import {
  Avatar,
  AvatarFallback,
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

import { loader as dialogLoader } from '~/app/routes/dialog.list/route';
import { IDialog } from '../dialog.list/interface';
import { useGetChatSearchParams } from '~/app/hooks/useGetChatSearchParams';
import { getConversationId } from '~/utils/chat/getConversationId';
import { useSetNewConversationRouteParams } from '~/app/hooks/useSetNewConversationRouteParams';
import { useSendNextMessage } from '~/app/hooks/useSendNextMessage';
import { getRagSessionCookie } from '~/lib/auth';
import { useSendMessageWithSse } from '~/app/hooks/useSendMessageWithSse';

export const meta: MetaFunction = () => {
  return [
    { title: 'Chatbot' },
    { name: 'description', content: 'Chat with AI assistant!' },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const dialogList = await dialogLoader({ request } as LoaderFunctionArgs);
  const { authorization } = await getRagSessionCookie(request);

  return json({
    initialMessage: 'Hello! How can I assist you today?',
    dialogList: await dialogList.json(),
    authorization,
  });
};

export default function Chat() {
  const { dialogList, initialMessage } = useLoaderData<typeof loader>();
  const { dialogId } = useGetChatSearchParams();
  const conversationId = getConversationId();
  const { setNewConversationRouteParams } = useSetNewConversationRouteParams();

  const [controller] = useState(new AbortController());

  const {
    // value,
    // ref,
    // loading,
    // sendLoading,
    derivedMessages,
    handleInputChange,
    handlePressEnter,
    // regenerateMessage,
    // removeMessageById,
  } = useSendNextMessage(controller);

  useEffect(() => {
    console.log('rendered?');
    if (dialogList && !dialogId) {
      if (dialogList.length > 0) {
        if (
          dialogList.every((dialogItem: IDialog) => dialogItem.id !== dialogId)
        ) {
          //Combine setting url of dialogId, conversationId and isNew for the first load
          setNewConversationRouteParams(
            conversationId,
            'true',
            dialogList[0].id
          );
        }
      }
    }
  }, []);

  const { send, answer, done, setDone, setShowFinalAnswer, showFinalAnswer } =
    useSendMessageWithSse();
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([{ role: 'bot', content: initialMessage }]);
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (scrollAreaRef.current) {
  //     scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
  //   }
  // }, [messages]);

  useEffect(() => {
    if (answer.answer && showFinalAnswer) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'bot', content: answer.answer },
      ]);
      setDone(true);
      setShowFinalAnswer(false);
    }
  }, [answer, setDone, showFinalAnswer]);

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
    <div className='flex flex-col min-h-screen bg-background p-4 sm:p-6 md:p-8'>
      <Card className='flex flex-col h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)] max-w-4xl mx-auto w-full'>
        {dialogList.map((x) => (
          <Card key={x.id}>
            <div className='block'>Icon: {x.icon}</div>
            <div className='block'>Name: {x.name}</div>
            <div className='block'>Id: {x.id}</div>
          </Card>
        ))}
        <CardHeader className='p-4 sm:p-6'>
          <CardTitle className='flex items-center text-lg sm:text-xl md:text-2xl'>
            <MessageCircle className='w-5 h-5 sm:w-6 sm:h-6 mr-2' />
            Chatbot
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-grow overflow-hidden p-4 sm:p-6'>
          <ScrollArea className='h-full pr-4' ref={scrollAreaRef}>
            {derivedMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                } mb-4`}
              >
                <div
                  className={`flex items-start max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <Avatar className='w-6 h-6 sm:w-8 sm:h-8'>
                    <AvatarFallback>
                      {message.role === 'user' ? 'U' : 'B'}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`mx-2 p-2 rounded-lg text-sm sm:text-base ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {!done && (
              <div className='flex justify-start mb-4'>
                <div className='flex items-center bg-muted rounded-lg p-2 text-sm sm:text-base'>
                  <span className='animate-pulse'>Bot is typing...</span>
                </div>
              </div>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter className='p-4 sm:p-6'>
          <Input
            name='chatInput'
            type='text'
            value={input}
            onPressEnter={handlePressEnter}
            onChange={(e) => {
              setInput(e.target.value);
              handleInputChange(e);
            }}
            placeholder='Type your message...'
            className='flex-grow text-sm sm:text-base'
            disabled={!done}
          />
          <Button
            type='button'
            onClick={handleSubmit}
            disabled={!done}
            className='px-3 sm:px-4'
          >
            <Send className='w-4 h-4 sm:mr-2' />
            <span className='hidden sm:inline'>Send</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
