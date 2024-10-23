import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, json, redirect, useActionData } from "@remix-run/react";
import AuthLayout from "~/components/AuthLayout";
import { Button, Input } from "~/components/ui";
import { getSessionCookie, sessionCookie } from "~/lib/auth";

import { createClient } from "~/utils/supabase/server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSessionCookie(request);

  if (session) {
    return redirect("/");
  }

  return null;
}

export default function SignUp() {
  const actionData = useActionData<typeof action>();

  return (
    <AuthLayout title="Register" message={actionData?.message}>
      <Form className="space-y-6" method="post">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <Button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign up
          </Button>
        </div>
      </Form>
    </AuthLayout>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const supabase = createClient(request);
  const body = await request.formData();

  const { data, error } = await supabase.auth.signUp({
    email: body.get("email") as string,
    password: body.get("password") as string,
  });

  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return json({ success: false, message: "User Already Exist" });
  } else if (error) {
    return json({ success: false, message: error.message });
  } else {
    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": await sessionCookie.serialize(data.session),
      },
    });
  }
}
