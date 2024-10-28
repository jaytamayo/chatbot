import { useSearchParams } from '@remix-run/react';
import { useCallback, useMemo } from 'react';

export const useSetChatRouteParams = () => {
  const [currentQueryParameters, setSearchParams] = useSearchParams();
  const newQueryParameters: URLSearchParams = useMemo(
    () => new URLSearchParams(currentQueryParameters.toString()),
    [currentQueryParameters]
  );

  const setConversationIsNew = useCallback(
    (value: string) => {
      newQueryParameters.set('isNew', value);
      setSearchParams(newQueryParameters);
    },
    [newQueryParameters, setSearchParams]
  );

  const getConversationIsNew = useCallback(() => {
    return newQueryParameters.get('isNew');
  }, [newQueryParameters]);

  return { setConversationIsNew, getConversationIsNew };
};
