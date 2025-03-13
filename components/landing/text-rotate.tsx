"use client";

import { LayoutGroup, motion } from "framer-motion";

import { TextRotate } from "@/components/ui/text-rotate";

function TextRotateComponent() {
  return (
    <div className="font-overusedGrotesk flex h-full w-full animate-fade-in-up-delay-8 flex-row items-center justify-center overflow-hidden bg-white p-4 text-lg font-light text-foreground dark:text-muted sm:p-8 sm:text-2xl md:p-16 md:text-3xl lg:p-20 lg:text-5xl">
      <LayoutGroup>
        <motion.p className="flex whitespace-pre" layout>
          <motion.span
            className="pt-0.5 text-black sm:pt-1 md:pt-1.5 lg:pt-2"
            layout
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
          >
            Discover Sbiba&apos;s{" "}
          </motion.span>
          <TextRotate
            texts={[
              "Heritage ✽",
              "Berber ⟰ Culture ",
              "Roman ✽ History",
              "Ancient ✽ Art ",
              "Epic ⟰ Architecture",
            ]}
            mainClassName="text-white px-1.5 sm:px-2 md:px-2.5 lg:px-3 bg-[#ff5941] overflow-hidden py-0.5 sm:py-1 md:py-1.5 lg:py-2 justify-center rounded-md sm:rounded-lg"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-0.5 md:pb-1 lg:pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
        </motion.p>
      </LayoutGroup>
    </div>
  );
}

export { TextRotateComponent };
