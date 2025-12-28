import { Suspense } from "react";
import Image from "next/image";
import { auth } from "@/auth";
import { format } from "date-fns";
import { Camera, Info } from "lucide-react";

import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Leaderbord } from "@/components/leaderbord";
import LikeButton from "@/components/LikeButton";
import { ShareButton } from "@/components/share-button";
import AddPost from "@/components/shared/add-post";

export default async function FeedPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const selfies = await prisma.selfie.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
    },
  });
  const userLikes = await prisma.like.findMany({
    where: {
      userId: userId,
    },
  });

  const topUsers = await prisma.user.findMany({
    orderBy: {
      points: "desc",
    },
    take: 10,
  });

  return (
    <main className="container mx-auto mt-16 max-w-7xl px-4 py-8 sm:mt-20 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Sbiba Heritage Gallery
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="rounded-full bg-muted p-2 text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground">
                  <Info className="size-5" />
                  <span className="sr-only">Information</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p className="text-sm">
                  This is a community project. Share your selfie to earn points
                  and help us build a better Sbiba.
                </p>
                <div className="mt-2 space-y-1 text-xs">
                  <p className="font-medium">Reward system:</p>
                  <ul className="list-inside list-disc space-y-1">
                    <li>1 point for each share</li>
                    <li>1 point for each like</li>
                    <li>10 points for each post you share</li>
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Leaderbord topUsers={topUsers} />
          <AddPost />
        </div>
      </div>

      <Suspense fallback={<SelfieGridSkeleton />}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {selfies.length > 0 ? (
            selfies.map((selfie) => (
              <Card
                key={selfie.id}
                className="group relative aspect-square overflow-hidden rounded-lg transition-all duration-300 hover:shadow-md"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="absolute right-3 top-3 z-10 flex items-center space-x-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="shrink-0">
                    <LikeButton
                      selfieId={selfie.id}
                      isLiked={userLikes.some(
                        (like) => like.selfieId === selfie.id,
                      )}
                    />
                  </div>
                  <div className="shrink-0">
                    <ShareButton
                      selfieId={selfie.id}
                      title={`Selfie at Sbiba Heritage`}
                      position="relative"
                    />
                  </div>
                </div>

                <Image
                  src={selfie.imageUrl}
                  alt={`Selfie by ${selfie.user.name || "user"}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority={selfies.indexOf(selfie) < 4}
                />

                <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {selfie.user.image ? (
                        <Image
                          src={selfie.user.image}
                          alt={`${selfie.user.name || "User"}`}
                          width={32}
                          height={32}
                          className="rounded-full border border-white/20"
                        />
                      ) : (
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                          {selfie.user.email?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm font-medium text-white">
                        {selfie.user.name ||
                          selfie.user.email?.split("@")[0] ||
                          "Anonymous"}
                      </span>
                    </div>
                    <time
                      className="text-xs text-white/80"
                      dateTime={selfie.createdAt.toISOString()}
                    >
                      {format(selfie.createdAt, "MMM d, yyyy")}
                    </time>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
              <Camera className="mb-3 size-10 text-muted-foreground" />
              <h3 className="text-lg font-medium">No selfies yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Be the first to share your Sbiba heritage selfie!
              </p>
              <div className="mt-6">
                <AddPost />
              </div>
            </div>
          )}
        </div>
      </Suspense>
    </main>
  );
}

function SelfieGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="relative aspect-square overflow-hidden rounded-lg"
        >
          <Skeleton className="size-full" />
        </div>
      ))}
    </div>
  );
}
