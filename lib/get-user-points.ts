"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const getUserPoints = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return 0;
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { points: true },
  });
  return user?.points || 0;
};
