"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma as db } from "@/lib/db";

export const likeSelfie = async (
  selfieId: string,
  action: "like" | "unlike",
) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    if (action === "like") {
      await db.like.create({
        data: { selfieId, userId },
      });
      await db.selfie.update({
        where: { id: selfieId },
        data: { points: { increment: 1 } },
      });
      await db.user.update({
        where: { id: userId },
        data: { points: { increment: 1 } },
      });
    } else {
      await db.like.deleteMany({
        where: { selfieId, userId },
      });
      await db.selfie.update({
        where: { id: selfieId },
        data: { points: { decrement: 1 } },
      });
      await db.user.update({
        where: { id: userId },
        data: { points: { decrement: 1 } },
      });
    }
    revalidatePath("/feed");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to like/unlike selfie");
  }
};
