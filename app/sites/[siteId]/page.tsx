import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ShareButton } from "@/components/share-button";
import { Button } from "@/components/ui/button";
import { getSiteById } from "@/lib/get-sites";

interface SitePageProps {
  params: Promise<{
    siteId: string;
  }>;
}

export default async function SitePage({ params }: SitePageProps) {
  const { siteId } = await params;
  const site = await getSiteById(siteId);

  if (!site) {
    return <div>Site not found</div>;
  }

  return (
    <main className="container mx-auto mt-8 py-6">
      <div className="bg-white">
        <div className="pt-16">
          {/* Image gallery */}
          <div className="">
            <video
              src={site.video}
              className="aspect-video w-full rounded-lg object-cover"
              autoPlay
              muted
              loop
            />
          </div>

          {/* Product info */}
          <div className="mt-8 px-4">
            <div className="lg:pr-8">
              <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {site.name}
                <Button variant="outline" size="icon">
                  <Link
                    href={`https://maps.google.com/?q=${site.latitude},${site.longitude}`}
                    target="_blank"
                  >
                    <MapPin className="size-5" />
                  </Link>
                </Button>
                <ShareButton title={site.name} siteId={siteId} position="relative" />
              </h1>
            </div>

            <div className="flex flex-col gap-4 py-10 lg:pb-16 lg:pr-8 lg:pt-6">
              {/* Description and details */}
              <div>
                <h3 className="sr-only">Description</h3>

                <div className="space-y-6">
                  <p className="text-base text-gray-900">
                    {site.description}
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-sm font-medium text-gray-900">Details</h2>

                <div className="mt-4 space-y-6">
                  <p className="text-sm text-gray-600">{site.details}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {site.images.map((imagePath) => (
              <Image
                key={imagePath}
                alt={`${site.name}`}
                src={imagePath}
                className="w-full rounded-lg object-cover"
                width={1000}
                height={1000}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
