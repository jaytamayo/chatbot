import { json, LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { getRagSessionCookie } from "~/lib/auth";
import { IDialog } from "./interface";

export async function loader({ request }: LoaderFunctionArgs) {
  const { authorization } = await getRagSessionCookie(request);

  const response = await fetch("http://localhost:9380/v1/dialog/list", {
    method: "GET",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
    },
  });

  const { data, retcode } = await response.json();

  if (retcode === 0) {
    const list: IDialog[] = data;

    if (!list.length) {
      return redirect("/chat");
    }
  }

  const dialogIdList = data ?? [];

  return await json(dialogIdList);
}
