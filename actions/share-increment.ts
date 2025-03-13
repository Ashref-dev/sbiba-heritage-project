"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma as db } from "@/lib/db";

export const shareIncrement = async (type: "selfie" | "site", id: string) => {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    throw new Error("User not found");
  }

  await db.user.update({
    where: { id: userId },
    data: {
      points: { increment: 1 },
    },
  });
  revalidatePath("/sites");
  const selfie =
    type === "selfie" && (await db.selfie.findUnique({ where: { id } }));

  if (!selfie) {
    return;
  }

  await db.user.update({
    where: { id: selfie.userId },
    data: {
      points: { increment: 1 },
    },
  });

  revalidatePath("/feed");
};
