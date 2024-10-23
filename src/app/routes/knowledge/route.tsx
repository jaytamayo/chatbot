import { LoaderFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { Button, Input } from "~/components/ui";
import { requireUserSession } from "~/lib/auth";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await requireUserSession(request, ["admin"]);

  return session;
};

export default function Knowledge() {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome back, Jay</h1>
          <div className="flex items-center space-x-4">
            <Form className="relative">
              <Input type="text" placeholder="Search" className="pl-8 w-64" />
            </Form>
            <Button>+ Create knowledge base</Button>
          </div>
        </div>

        <p className="text-xl mb-4">
          Which knowledge base are we going to use today?
        </p>

        <div className="bg-white p-6 rounded-lg shadow-md w-[300px]">
          <h2 className="text-2xl font-semibold mb-4">Recipe</h2>
          <p className="text-gray-600 mb-2">1 Docs</p>
          <p className="text-gray-600">Last updated: 23/10/2024 08:58:02</p>
        </div>
      </div>
    </div>
  );
}
