import { useCallback, useEffect, useRef } from 'react';

export const useScrollToBottom = (messages?: unknown) => {
  const ref = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messages) {
      ref.current?.scrollIntoView({ behavior: 'instant' });
    }
  }, [messages]); // If the message changes, scroll to the bottom

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  return ref;
};
