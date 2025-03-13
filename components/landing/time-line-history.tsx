import Image from "next/image";

import { Timeline } from "@/components/ui/timeline";

export function TimeLineHistory() {
  const data = [
    {
      title: "Early 1st Millennium BCE (1000 BCE)",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 dark:text-neutral-200 md:text-sm">
            This period was dominated by indigenous Berber groups with their own
            distinct languages and traditions. The area, rich with natural
            resources, was characterized by small farming communities and trade
            networks extending across North Africa and the Mediterranean.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Izbet-Sarta-C-26.jpg/640px-Izbet-Sarta-C-26.jpg"
              alt="Ancient Berber settlements"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "9th to 3rd Century BCE (800s - 200s BCE)",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 dark:text-neutral-200 md:text-sm">
            The Carthaginian Empire, centered in modern-day Tunisia, extended
            its influence inland. Berber tribes, with their distinct language
            and cultural practices, contributed to a mixed cultural landscape.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Tunisie_Carthage_Ruines_08.JPG/640px-Tunisie_Carthage_Ruines_08.JPG"
              alt="Carthaginian period artifacts"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "3rd Century BCE to 6th Century CE",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 dark:text-neutral-200 md:text-sm">
            The area came under Roman rule, followed by Byzantine control. The
            Romans developed agriculture, built roads, and established urban
            centers, integrating the Berber tribes through administrative
            practices.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="/img1.jpg"
              alt="Roman period ruins"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "7th to 10th Century CE",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 dark:text-neutral-200 md:text-sm">
            Following the Arab Muslim conquest, the region transitioned from
            Roman and Byzantine control to Islamic governance, integrating local
            Berber populations with emerging Islamic culture.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://images.pexels.com/photos/3363341/pexels-photo-3363341.jpeg"
              alt="Early Islamic period artifacts"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "11th to 15th Century",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 dark:text-neutral-200 md:text-sm">
            The region was influenced by various Islamic dynasties, including
            the Zirids and later the Almohads and Hafsids. These times saw the
            development of fortifications and trade routes.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://images.pexels.com/photos/4179480/pexels-photo-4179480.jpeg"
              alt="Medieval fortifications"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "16th to 18th Century",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 dark:text-neutral-200 md:text-sm">
            The late Hafsid period transitioned into Ottoman control, bringing
            changes in governance while maintaining strong local cultural
            elements, including traditional Berber and Islamic influences.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://images.pexels.com/photos/4388164/pexels-photo-4388164.jpeg"
              alt="Ottoman period architecture"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "19th Century",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 dark:text-neutral-200 md:text-sm">
            Under Ottoman rule, there was a mix of Berber traditions and Ottoman
            administrative practices, with agriculture remaining the primary
            economic activity.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://images.pexels.com/photos/4388167/pexels-photo-4388167.jpeg"
              alt="19th century Sbiba"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "20th Century",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 dark:text-neutral-200 md:text-sm">
            Sbiba, like the rest of Tunisia, was under French colonial rule
            until independence in 1956. Post-independence, the region saw
            significant infrastructural development and modernization
            initiatives.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://images.pexels.com/photos/4388165/pexels-photo-4388165.jpeg"
              alt="Colonial period Sbiba"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "21st Century",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 dark:text-neutral-200 md:text-sm">
            Modern Sbiba represents a blend of traditional Berber culture with
            modern Tunisian influences. The region is predominantly
            agricultural, producing olives, grains, and fruits. Contemporary
            life showcases a mix of modern lifestyles and cultural heritage,
            with ongoing development and connectivity improvements.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://nkwazi.s3.eu-west-2.amazonaws.com/wp-content/uploads/2019/11/OPENING-PHOTO-1.jpg"
              alt="Modern Sbiba"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full">
      <Timeline data={data} />
    </div>
  );
}
