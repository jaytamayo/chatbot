import { type LoaderFunctionArgs } from '@remix-run/node';
import { requireUserSession } from '~/lib/auth';
import LogoutButton from '@routes/_auth.logout/LogoutButton';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await requireUserSession(request);

  return session;
}

const Dashboard = () => {
  return (
    <div className='bg-gray-900 h-lvh text-white'>
      <h1>Dashboard</h1>
      <LogoutButton />
    </div>
  );
};

export default Dashboard;
