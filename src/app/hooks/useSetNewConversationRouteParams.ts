import { useSearchParams } from '@remix-run/react';
import { useCallback, useMemo } from 'react';

export const useSetNewConversationRouteParams = () => {
  const [currentQueryParameters, setSearchParams] = useSearchParams();

  const newQueryParameters: URLSearchParams = useMemo(
    () => new URLSearchParams(currentQueryParameters.toString()),
    [currentQueryParameters]
  );

  const setNewConversationRouteParams = useCallback(
    (conversationId: string, isNew: string) => {
      newQueryParameters.set('conversationId', conversationId);
      newQueryParameters.set('isNew', isNew);

      console.log('came here', newQueryParameters);

      setSearchParams(newQueryParameters);
    },
    [newQueryParameters, setSearchParams]
  );

  return { setNewConversationRouteParams };
};
