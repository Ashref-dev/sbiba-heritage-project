import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRightIcon,
  CircleArrowOutUpRight,
  Compass,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import BackgroundShaderClient from "../background-shader-client";
import { ScrollIndicator } from "./scroll-indicator";
import VideoModal from "./video-modal";

export const Hero = () => {
  return (
    <div className="container relative mx-auto flex flex-col gap-4 overflow-hidden py-4 lg:flex-row lg:py-6">
      {/* Left Content */}
      <div className="bite-br animate-fade-in-left flex flex-1 items-center justify-center overflow-hidden rounded-2xl bg-[#f28809] px-4 py-8 sm:rounded-3xl md:px-8 lg:px-16 lg:py-12">
        <BackgroundShaderClient className="absolute inset-0 z-[-1] h-screen w-screen brightness-95" />
        <div className="flex max-w-3xl flex-col items-center text-center">
          <div className="animate-fade-in-up-delay-5 mb-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-sm transition-transform hover:scale-105 sm:mb-6 sm:px-4 sm:py-2">
            <span className="text-xs font-semibold text-gray-900 sm:text-sm">
              Kasserine Region
            </span>
            <ArrowUpRightIcon className="size-3 text-gray-700 sm:size-4" />
          </div>

          <h1 className="text-shadow animate-fade-in-up-delay-6 mb-4 font-sans text-4xl font-medium tracking-tight text-white sm:mb-6 sm:text-5xl md:text-6xl lg:mb-8 lg:text-7xl">
            Your{" "}
            <Compass className="inline size-8 animate-[spin_8s_linear_infinite] text-white sm:size-10 lg:size-14" />{" "}
            Journey in{" "}
            <span className="font-serif font-light italic text-white">
              Sbiba
            </span>{" "}
            Starts Here
          </h1>

          <p className="animate-fade-in-up-delay-6 mb-6 max-w-xl text-lg leading-relaxed text-white sm:mb-8 sm:text-xl lg:mb-10 lg:text-2xl">
            Discover the enchanting blend of Roman heritage and Berber culture
            in the heart of Kasserine
          </p>

          <div className="animate-fade-in-up-delay-7 space-y-4 sm:space-y-6">
            <VideoModal />

            <div className="animate-fade-in-up-delay-7 flex items-center gap-3 sm:gap-4">
              <div className="flex -space-x-2 sm:-space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="size-6 overflow-hidden rounded-full border-2 border-white shadow-md sm:size-8"
                  >
                    <Image
                      src={`https://randomuser.me/api/portraits/men/${i + 20}.jpg`}
                      alt={`Member ${i}`}
                      width={48}
                      height={48}
                    />
                  </div>
                ))}
              </div>
              <span className="text-sm font-semibold text-white sm:text-base">
                Join 50+ hisory lovers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="bite-bl animate-fade-in-right relative min-h-[30em] flex-1 overflow-hidden rounded-2xl sm:rounded-3xl">
        <div className="absolute inset-0">
          <video
            src="/vid.mp4"
            autoPlay
            loop
            muted
            className="size-full object-cover"
          />
        </div>

        {/* Floating Elements */}
        <div className="relative h-[26em] p-4 sm:p-6 lg:h-full lg:p-8">
          <div className="animate-fade-in-up-delay-1 absolute right-3 top-3 flex items-center gap-2 rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur-sm sm:right-4 sm:top-4 sm:gap-3 sm:rounded-2xl sm:p-4">
            <Link
              href="/sites"
              className="flex items-center gap-1.5 pr-1 text-sm font-medium sm:text-base"
            >
              Explore Monuments
              <CircleArrowOutUpRight className="size-3.5 sm:size-4" />
            </Link>
          </div>

          {/* Tags - Hidden on smallest screens */}
          <div className="sm:group animate-fade-in-up-delay-2 absolute left-1/2 top-1/3 hidden -translate-x-1/2 items-center sm:flex">
            <ArrowDownLeft className="size-4 text-white/80 transition-transform group-hover:scale-110 sm:size-5" />
            <div className="animate-float-1">
              <Button
                variant="secondary"
                className="rounded-full text-sm shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
              >
                Epic Architecture
              </Button>
            </div>
          </div>
          <div className="sm:group animate-fade-in-up-delay-3 absolute left-1/4 top-1/2 hidden items-center sm:flex">
            <ArrowDownLeft className="size-4 text-white/80 transition-transform group-hover:scale-110 sm:size-5" />
            <div className="animate-float-2">
              <Button
                variant="secondary"
                className="rounded-full text-sm shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
              >
                Roman heritage
              </Button>
            </div>
          </div>
          <div className="sm:group animate-fade-in-up-delay-4 absolute right-1/4 top-2/3 hidden items-center sm:flex">
            <ArrowDownLeft className="size-4 text-white/80 transition-transform group-hover:scale-110 sm:size-5" />
            <div className="animate-float-3">
              <Button
                variant="secondary"
                className="rounded-full text-sm shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:text-base"
              >
                Rich history
              </Button>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="animate-fade-in-up-delay-4 absolute inset-x-2 bottom-2 flex items-center justify-between sm:bottom-2 sm:left-[68px] sm:right-8">
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-white/95 px-4 py-2 text-xs shadow-lg backdrop-blur-sm sm:gap-2 sm:rounded-2xl sm:px-6 sm:py-4 sm:text-sm">
              <CircleArrowOutUpRight className="size-3.5 sm:size-4" /> Discover
              the legacy of Sbiba
            </div>
            <div className="flex gap-1.5 sm:gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="size-8 rounded-full bg-white/95 shadow-lg backdrop-blur-sm sm:size-10"
              >
                YT
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="size-8 rounded-full bg-white/95 shadow-lg backdrop-blur-sm sm:size-10"
              >
                FB
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ScrollIndicator - Hidden on mobile */}
      <ScrollIndicator className="animate-fade-in-up-delay-7 absolute bottom-0 left-1/2 hidden -translate-x-1/2 lg:left-[55%] lg:block" />
    </div>
  );
};
