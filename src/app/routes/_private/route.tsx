import { type LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { Menu } from 'lucide-react';
import { Sidebar } from '~/components';
import { Button, Sheet, SheetContent, SheetTrigger } from '~/components/ui';
import { requireUserSession } from '~/lib/auth';

export default function MarketingLayout() {
  return (
    <>
      <div className='flex h-screen bg-gradient-to-br from-gray-100 to-gray-200'>
        <div className='hidden md:block w-64 bg-white shadow-lg'>
          <Sidebar />
        </div>
        <div className='flex-1 flex flex-col'>
          <header className='bg-white shadow-sm'>
            <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center'>
              <h1 className='text-xl font-semibold text-gray-900 flex items-center'>
                Chat Interface
              </h1>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant='outline' size='icon' className='md:hidden'>
                    <Menu className='h-5 w-5' />
                  </Button>
                </SheetTrigger>
                <SheetContent side='left' className='w-64 p-0'>
                  <Sidebar />
                </SheetContent>
              </Sheet>
            </div>
          </header>
          <Outlet />
        </div>
      </div>
    </>
  );
}
