import { EventSourceParserStream } from "eventsource-parser/stream";
import { useCallback, useRef, useState } from "react";

export interface Docagg {
  count: number;
  doc_id: string;
  doc_name: string;
}

export interface IChunk {
  available_int: number; // Whether to enable, 0: not enabled, 1: enabled
  chunk_id: string;
  content_with_weight: string;
  doc_id: string;
  doc_name: string;
  img_id: string;
  important_kwd: any[];
  positions: number[][];
}

export interface IReference {
  chunks: IChunk[];
  doc_aggs: Docagg[];
  total: number;
}

export interface IAnswer {
  answer: string;
  reference: IReference;
  conversationId?: string;
  prompt?: string;
  id?: string;
  audio_binary?: string;
}

export const useSendMessageWithSse = (
  url: string = "http://localhost:9380/v1/conversation/completion"
) => {
  const [answer, setAnswer] = useState<IAnswer>({} as IAnswer);
  const [done, setDone] = useState(true);
  const [showFinalAnswer, setShowFinalAnswer] = useState(false);
  const timer = useRef<any>();

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
          method: "POST",
          headers: {
            Authorization:
              "ImY0MDZkMjI0OGMyYzExZWZhYTNiMDI0MmFjMTIwMDA1Ig.ZxByCQ.248f8FrLVPnXM7tVkVqnRROupk4",
            "Content-Type": "application/json",
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
              setShowFinalAnswer(true);
              resetAnswer();
              break;
            }
            try {
              const val = JSON.parse(value?.data || "");
              const d = val?.data;
              if (typeof d !== "boolean") {
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

        resetAnswer();
        return { data: await res, response };
      } catch (e) {
        setDone(true);
        resetAnswer();

        console.warn(e);
      }
    },
    [url, resetAnswer]
  );

  return {
    send,
    answer,
    done,
    setDone,
    setShowFinalAnswer,
    showFinalAnswer,
    resetAnswer,
  };
};
