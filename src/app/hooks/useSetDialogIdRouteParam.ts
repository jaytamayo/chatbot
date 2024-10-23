import { useSearchParams } from '@remix-run/react';
import { useCallback, useMemo } from 'react';

export const useSetDialogIdRouteParam = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const newQueryParameters: URLSearchParams = useMemo(() => {
    return new URLSearchParams();
  }, []);

  const setDialogIdRouteParam = useCallback(
    (dialogId: string) => {
      newQueryParameters.set('dialogId', dialogId);

      setSearchParams(newQueryParameters);
    },
    [newQueryParameters, setSearchParams]
  );

  return { setDialogIdRouteParam };
};
