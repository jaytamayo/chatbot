import { Outlet } from '@remix-run/react';

export default function MarketingLayout() {
  return (
    <div>
      <div>Layout placeholder</div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
