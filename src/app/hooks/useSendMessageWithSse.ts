import { EventSourceParserStream } from 'eventsource-parser/stream';
import { useCallback, useRef, useState } from 'react';
import { loader } from '~/app/routes/_private.chat/route';
import { useLoaderData } from '@remix-run/react';
import { IAnswer } from '~/features/chat/types';

export interface ResponseType<T = any> {
  retcode: number;
  data: T;
  retmsg: string;
  status: number;
}

export const useSendMessageWithSse = (
  url: string = 'http://localhost:9380/v1/conversation/completion'
) => {
  const [answer, setAnswer] = useState<IAnswer>({} as IAnswer);
  const [done, setDone] = useState(true);
  const timer = useRef<any>();

  const loaderData = useLoaderData<typeof loader>();

  const resetAnswer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      setAnswer({} as IAnswer);
      clearTimeout(timer.current);
    }, 1000);
  }, []);

  const send = useCallback(
    async (
      body: any,
      controller?: AbortController
    ): Promise<{ response: Response; data: ResponseType } | undefined> => {
      try {
        setDone(false);
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: loaderData?.authorization,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
          signal: controller?.signal,
        });

        const res = response.clone().json();

        const reader = response?.body
          ?.pipeThrough(new TextDecoderStream())
          .pipeThrough(new EventSourceParserStream())
          .getReader();

        while (true) {
          const x = await reader?.read();
          if (x) {
            const { done, value } = x;
            if (done) {
              console.info('done');
              resetAnswer();
              break;
            }
            try {
              const val = JSON.parse(value?.data || '');
              const d = val?.data;
              if (typeof d !== 'boolean') {
                console.info('data:', d);
                setAnswer({
                  ...d,
                  conversationId: body?.conversation_id,
                });
              }
            } catch (e) {
              console.warn(e);
            }
          }
        }
        console.info('done?');
        setDone(true);
        resetAnswer();
        return { data: await res, response };
      } catch (e) {
        setDone(true);
        resetAnswer();

        console.warn(e);
      }
    },
    [url, loaderData?.authorization, resetAnswer]
  );

  return { send, answer, done, setDone, resetAnswer };
};
