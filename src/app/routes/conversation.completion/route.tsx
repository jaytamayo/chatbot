import { ActionFunctionArgs } from '@remix-run/node';
import { getRagSessionCookie } from '~/lib/auth';

export async function action({ request }: ActionFunctionArgs) {
  const { authorization } = await getRagSessionCookie(request);

  const body = await request.formData();

  const userInput = body.get('chatInput');

  console.log('userInput', userInput);

  const response = await fetch(
    'http://localhost:9380/v1/conversation/completion',
    {
      method: 'POST',
      headers: {
        Authorization: authorization,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  const res = response.clone().json();

  console.log('res', res);

  console.log('response', response);

  return null;
}
