import { type LoaderFunctionArgs } from "@remix-run/node";
import { requireUserSession } from "~/lib/auth";
import { Menu } from "lucide-react";
import { Button, Sheet, SheetContent, SheetTrigger } from "~/components/ui";
import { Sidebar } from "~/components";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await requireUserSession(request);

  return session;
}

const Dashboard = () => {
  return (
    <>
      <h1>Dashboard</h1>
    </>
  );
};

export default Dashboard;
