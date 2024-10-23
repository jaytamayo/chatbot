import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@remix-run/node';
import { Form, redirect, useSubmit } from '@remix-run/react';
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
    console.error(error);
  }

  return redirect(`/dashboard`, {
    headers: [
      ['Set-Cookie', await sessionCookie.serialize(data.session)],
      ['Set-Cookie', await ragSessionCookie.serialize(ragSession)],
    ],
  });
}

const Login = () => {
  const submit = useSubmit();

  return (
    <div className='bg-gray-900'>
      <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
        <div className='w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0'>
          <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
            <Form
              className='space-y-4 md:space-y-6'
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
                  className='block mb-2 text-sm font-medium text-gray-900'
                >
                  Email
                </label>
                <input
                  className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                  placeholder='Enter email'
                  type='email'
                  name='email'
                />
              </div>
              <div>
                <label
                  htmlFor='password'
                  className='block mb-2 text-sm font-medium text-gray-900'
                >
                  Password
                </label>
                <input
                  className='bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'
                  placeholder='Enter password'
                  type='password'
                  name='password'
                />
              </div>

              <button
                type='submit'
                className='w-full text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
              >
                Login
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
