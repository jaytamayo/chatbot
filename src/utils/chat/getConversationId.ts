import { v4 as uuid } from 'uuid';

export const getConversationId = () => {
  return uuid().replace(/-/g, '');
};
