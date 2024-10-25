import { json, LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/react';
import { getRagSessionCookie } from '~/lib/auth';
import { IDialog } from './interface';
import {
  dehydrate,
  QueryClient,
  QueryFunctionContext,
} from '@tanstack/react-query';

export async function loader({ request }: LoaderFunctionArgs) {
  const queryClient = new QueryClient();

  const { authorization } = await getRagSessionCookie(request);

  await queryClient.fetchQuery({
    queryKey: ['dialogList', authorization],
    queryFn: () => fetchDialogList,
  });

  return json({ dehydratedState: dehydrate(queryClient) });
}

export async function fetchDialogList({
  queryKey,
}: QueryFunctionContext<[string, string]>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, authorization] = queryKey;
  const response = await fetch('http://localhost:9380/v1/dialog/list', {
    method: 'GET',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
  });

  const { data, retcode } = await response.json();

  if (retcode === 0) {
    const list: IDialog[] = data;

    if (!list.length) {
      return redirect('/chat');
    }
  }

  const dialogIdList = data ?? [];

  return await dialogIdList;
}
