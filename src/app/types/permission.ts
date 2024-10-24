export type User = {
  id: string;
  email: string;
};

export type Role = "user" | "admin";

export type Permission = "read" | "write" | "delete" | "admin";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  user: ["read", "write"],
  admin: ["read", "write", "delete", "admin"],
};

export function hasPermissions(
  role: Role,
  requiredPermissions: Permission[]
): boolean {
  const userPermissions = ROLE_PERMISSIONS[role];

  return requiredPermissions.every((permission) =>
    userPermissions.includes(permission)
  );
}
