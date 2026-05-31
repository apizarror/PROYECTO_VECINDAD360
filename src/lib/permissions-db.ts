import { prisma } from "./prisma";

export async function getPermissionsForRole(rol: string) {
  return prisma.rolePermission.findMany({ where: { rol } });
}
