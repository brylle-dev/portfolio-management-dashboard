import { prisma } from "../../src/lib/db";

export async function truncateAll() {
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
}
