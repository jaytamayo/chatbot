import { useLoaderData } from '@remix-run/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { loader } from '~/app/routes/_index';

export const useFetchDocumentThumbnailsByIds = () => {
  const loaderData = useLoaderData<typeof loader>();
  const [ids, setDocumentIds] = useState<string[]>([]);

  const { data } = useQuery<Record<string, string>>({
    queryKey: ['fetchDocumentThumbnails', ids],
    enabled: ids.length > 0,
    initialData: {},
    queryFn: async () => {
      const response = await fetch(
        'http://127.0.0.1:9380/v1/document/thumbnails',
        {
          method: 'GET',
          headers: {
            Authorization: loaderData?.authorization,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            doc_ids: ids,
          }),
        }
      );

      const data = await response.json();

      if (data.retcode === 0) {
        return data.data;
      }
      return {};
    },
  });

  return { data, setDocumentIds };
};
