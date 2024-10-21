import { type ActionFunctionArgs, redirect } from '@remix-run/node';
import { sessionCookie } from '~/lib/auth';
import { createClient } from '~/utils/supabase/server';

export async function action({ request }: ActionFunctionArgs) {
  const supabase = createClient(request);

  const { error } = await supabase.auth.signOut();

  if (!error) {
    return redirect('/', {
      headers: {
        'Set-Cookie': await sessionCookie.serialize('', {
          maxAge: 0,
        }),
      },
    });
  }
}
