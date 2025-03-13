import { VelocityScroll } from "@/components/ui/scroll-based-velocity";
import { TextReveal } from "@/components/ui/text-reveal";
import { Hero } from "@/components/landing/hero";
import MonumentScene from "@/components/landing/monument-scene";
import { TextRotateComponent } from "@/components/landing/text-rotate";
import { TimeLineHistory } from "@/components/landing/time-line-history";
import { ExploreCtaSection } from "@/components/landing/cta-explore";

export default function HomePage() {
  return (
    <>
      <main className="mx-auto mt-24 max-w-7xl">
        <Hero />
        <TextRotateComponent />

        <MonumentScene />
        <TextReveal text="Where ancient Berber wisdom meets Roman grandeur, Sbiba is a living museum of Mediterranean civilizations ✧" />
        <TimeLineHistory />
      </main>
      <VelocityScroll className="mt-12" defaultVelocity={3}>
        Ready to explore Sbiba?
      </VelocityScroll>
      <ExploreCtaSection />
    </>
  );
}
