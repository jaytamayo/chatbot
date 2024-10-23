import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@remix-run/node';
import {
  Form,
  Link,
  redirect,
  useActionData,
  useSubmit,
} from '@remix-run/react';
import AuthLayout from '~/components/AuthLayout';
import { Button, Input } from '~/components/ui';
import { getSessionCookie, ragSessionCookie, sessionCookie } from '~/lib/auth';
import { encryptPassword } from '~/utils/encryptPassword/index.client';
import { createClient } from '~/utils/supabase/server';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSessionCookie(request);

  if (session) {
    return redirect('/');
  }

  return null;
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();

  return (
    <AuthLayout title='Login' message={actionData?.message}>
      <Form
        className='space-y-6'
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.target as HTMLFormElement);

          const encryptedPassword = encryptPassword(
            formData.get('password') as string
          );

          formData.set('encryptedPassword', encryptedPassword as string);

          submit(formData, { method: 'post' });
        }}
      >
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700'
          >
            Email address
          </label>
          <Input
            id='email'
            name='email'
            type='email'
            autoComplete='email'
            required
            className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm'
          />
        </div>

        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700'
          >
            Password
          </label>
          <Input
            id='password'
            name='password'
            type='password'
            autoComplete='current-password'
            required
            className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm'
          />
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <input
              id='remember-me'
              name='remember-me'
              type='checkbox'
              className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
            />
            <label
              htmlFor='remember-me'
              className='ml-2 block text-sm text-gray-900'
            >
              Remember me
            </label>
          </div>

          <div className='text-sm'>
            <Link
              to='/forgot-password'
              className='font-medium text-indigo-600 hover:text-indigo-500'
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <div>
          <Button
            type='submit'
            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            Sign in
          </Button>
        </div>
      </Form>
    </AuthLayout>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const supabase = createClient(request);
  const body = await request.formData();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: body.get('email') as string,
    password: body.get('password') as string,
  });

  const ragResponse = await fetch('http://127.0.0.1:9380/v1/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: body.get('email') as string,
      password: body.get('encryptedPassword') as string,
    }),
  });

  const ragSession = await ragResponse.json();

  const ragAuth = ragResponse.headers.get('Authorization');

  ragSession.authorization = ragAuth;

  if (error) {
    return { success: false, message: error?.message };
  } else {
    return redirect(`/dashboard`, {
      headers: [
        ['Set-Cookie', await sessionCookie.serialize(data.session)],
        ['Set-Cookie', await ragSessionCookie.serialize(ragSession)],
      ],
    });
  }
}
