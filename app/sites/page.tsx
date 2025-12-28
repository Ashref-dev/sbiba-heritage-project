import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { format } from "date-fns";

import { getSites } from "@/lib/get-sites";
import { Card } from "@/components/ui/card";
import { ShareButton } from "@/components/share-button";

export default async function FeedPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const sites = await getSites();

  return (
    <main className="container mx-auto mt-16 px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">Monuments of Sbiba</h1>
        <p className="mt-2 text-muted-foreground">
          Explore historical monuments in the Sbiba region
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {sites.map((site) => (
          <Link
            key={site.id}
            href={`/sites/${site.id}`}
            className="block h-full"
          >
            <Card className="group relative h-full overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h2 className="line-clamp-1 text-xl font-medium">
                    {site.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(), "MMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden">
                <div className="absolute right-5 top-5 z-10">
                  <ShareButton
                    siteId={site.id}
                    title={`${site.name} at Sbiba`}
                  />
                </div>
                <div className="aspect-[4/4]">
                  <Image
                    src={site.images[0]}
                    alt={site.name}
                    width={800}
                    height={600}
                    className="size-full rounded-lg object-cover transition-transform duration-300 group-hover:translate-y-3"
                    priority
                  />
                </div>
              </div>
            </Card>
          </Link>
        ))}

        {sites.length === 0 && (
          <div className="col-span-full flex min-h-[200px] items-center justify-center rounded-lg border border-dashed p-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                No monuments found
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
