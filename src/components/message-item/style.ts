import classNames from '~/utils/classNames';

export const messageItem = (isAssistant: boolean) =>
  classNames('py-6', isAssistant ? 'text-left' : 'text-right');

export const messageItemSection = (isAssistant: boolean) =>
  classNames('inline-block', isAssistant ? 'w-4/5' : '');

export const messageItemContent = (isUser: boolean) =>
  classNames('inline-flex gap-5', isUser ? 'flex-row-reverse' : '');

export const markdownSection = (isAssistant: boolean) =>
  classNames(isAssistant ? messageText : messageUserText);

const messageTextBase = classNames('py-1.5 px-2.5 rounded-lg [&>p]:m-0');

const messageText = classNames(
  'bg-[#e6f4ff] break-all',
  messageTextBase,
  'chunkText'
);

const messageUserText = classNames(
  'bg-[#f8f7f7] break-all text-justify',
  messageTextBase,
  'chunkText'
);
