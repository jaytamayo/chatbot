import { createCookie, redirect } from "@remix-run/node";
import { hasPermissions, Permission, Role } from "~/app/types/permission";

export async function getSessionCookie(request: Request) {
  const cookie = request.headers.get("Cookie");

  const session = await sessionCookie.parse(cookie);

  return session;
}

export async function getRagSessionCookie(request: Request) {
  const cookie = request.headers.get("Cookie");

  const ragSession = await ragSessionCookie.parse(cookie);

  return ragSession;
}

function getRole(): Role {
  const role = process.env.ROLE;
  return role as Role;
}

export async function requireUserSession(
  request: Request,
  permissions?: Array<Permission>
) {
  const session = await getSessionCookie(request);

  if (!session) {
    // if there is no user session, redirect to login
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await sessionCookie.serialize("", {
          maxAge: 0,
        }),
      },
    });
  }

  const role = getRole();

  if (permissions && !hasPermissions(role, permissions)) {
    return redirect("/restricted");
  }

  return session;
}

export const sessionCookie = createCookie("session", {
  path: "/",
  sameSite: "lax",
  httpOnly: true,
  secure: true,
  maxAge: 60 * 60 * 24 * 30, //30 days
  secrets: ["s3cret1"],
});

export const ragSessionCookie = createCookie("ragSession", {
  path: "/",
  sameSite: "lax",
  httpOnly: true,
  secure: true,
  maxAge: 60 * 60 * 24 * 30, //30 days
  secrets: ["s3cret1"],
});
