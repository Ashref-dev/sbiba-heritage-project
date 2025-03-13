"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";

const ShaderGradientCanvas = dynamic(
  () => import("@shadergradient/react").then((mod) => mod.ShaderGradientCanvas),
  { ssr: false, loading: () => null },
);

const ShaderGradient = dynamic(
  () => import("@shadergradient/react").then((mod) => mod.ShaderGradient),
  { ssr: false, loading: () => null },
);

interface BackgroundShaderProps {
  className?: string;
}

export function BackgroundShader({ className }: BackgroundShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventDefault = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Define all event types to prevent
    const eventTypes = [
      "touchstart",
      "touchmove",
      "touchend",
      "wheel",
      "gesturestart",
      "gesturechange",
      "gestureend",
      "pinch",
      "pinchstart",
      "pinchend",
      "pinchcancel",
    ];

    // Add event listeners
    eventTypes.forEach((eventType) => {
      container.addEventListener(eventType, preventDefault, { passive: false });
    });

    // Handle double-tap zoom prevention
    let lastTap = 0;
    const handleTouchStart = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTap < 300) {
        e.preventDefault();
      }
      lastTap = now;
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });

    // Cleanup function
    return () => {
      eventTypes.forEach((eventType) => {
        container.removeEventListener(eventType, preventDefault);
      });
      container.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  const gradientUrl =
    "https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.2&cAzimuthAngle=180&cDistance=4.3&cPolarAngle=90&cameraZoom=1&color1=%23ff5005&color2=%23dbba95&color3=%23d0bce1&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=1&positionX=-1.4&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=10&rotationZ=50&shader=defaults&type=plane&uAmplitude=0&uDensity=1.3&uFrequency=5.5&uSpeed=0.5&uStrength=4&uTime=0&wireframe=false";

  return (
    <div
      ref={containerRef}
      className={clsx("pointer-events-none touch-none select-none", className)}
      style={{
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        msUserSelect: "none",
        WebkitTouchCallout: "none",
        WebkitTapHighlightColor: "transparent",
        overscrollBehavior: "none",
      }}
    >
      <ShaderGradientCanvas
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: "100%",
          width: "100%",
          pointerEvents: "none",
          touchAction: "none",
        }}
      >
        <ShaderGradient control="query" urlString={gradientUrl} />
      </ShaderGradientCanvas>
      <div
        className="absolute inset-x-0 bottom-0 h-64"
        style={{
          background: `linear-gradient(to top, 
            hsl(var(--background)) 0%,
            hsl(var(--background)) 15%,
            hsl(var(--background) / 0.95) 30%,
            hsl(var(--background) / 0.8) 45%,
            hsl(var(--background) / 0.6) 60%,
            hsl(var(--background) / 0.3) 75%,
            hsl(var(--background) / 0.1) 90%,
            transparent 100%
          )`,
        }}
      />
    </div>
  );
}
