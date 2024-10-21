import { type LoaderFunctionArgs, redirect } from '@remix-run/node';
import { requireUserSession } from '~/lib/auth';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await requireUserSession(request);

  if (session) {
    return redirect('/dashboard');
  }

  return null;
}
