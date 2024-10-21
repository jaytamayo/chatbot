import { createCookie, redirect } from '@remix-run/node';

export async function getSessionCookie(request: Request) {
  const cookie = request.headers.get('Cookie');

  const session = await sessionCookie.parse(cookie);

  return session;
}

export async function requireUserSession(request: Request) {
  const session = await getSessionCookie(request);

  if (!session) {
    // if there is no user session, redirect to login
    throw redirect('/login', {
      headers: {
        'Set-Cookie': await sessionCookie.serialize('', {
          maxAge: 0,
        }),
      },
    });
  }

  return session;
}

export const sessionCookie = createCookie('session', {
  path: '/',
  sameSite: 'lax',
  httpOnly: true,
  secure: true,
  maxAge: 60 * 60 * 24 * 30, //30 days
  secrets: ['s3cret1'],
});
