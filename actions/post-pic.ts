"use server";

import { prisma as db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function postPic(imageUrl: string) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      throw new Error("User not found");
    }
    if (!user.id) {
      throw new Error("User ID is required");
    }
    await db.selfie.create({
      data: {
        imageUrl: imageUrl,
        userId: user.id,
        points: 10,
        site: "reimagine",
      },
    });

    await db.user.update({
      where: { id: user.id },
      data: { points: { increment: 10 } },
    });

    revalidatePath("/feed");
  } catch (error) {
    console.error(error);
  }
}
