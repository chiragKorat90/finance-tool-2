"use client";

import React, { useEffect, useState, useRef } from "react";
import BannerAd from "./BannerAd";

export default function SidebarAds() {
  const [topOffset, setTopOffset] = useState<number>(96); // default top-24 (96px)
  const leftSidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ticking = false;

    const updateSidebarPosition = () => {
      const footer = document.querySelector("footer");
      if (!footer) return;

      const footerRect = footer.getBoundingClientRect();
      const sidebarHeight = leftSidebarRef.current
        ? leftSidebarRef.current.offsetHeight
        : 520;
      const defaultTop = 96; // 6rem / top-24 (below navbar)
      const gapAboveFooter = 24; // safety gap above footer

      // Maximum top position before sidebar touches footer
      const maxAllowedTop = footerRect.top - sidebarHeight - gapAboveFooter;

      if (maxAllowedTop < defaultTop) {
        setTopOffset(maxAllowedTop);
      } else {
        setTopOffset(defaultTop);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateSidebarPosition);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateSidebarPosition();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      {/* Left Side Banner Ads */}
      <aside
        ref={leftSidebarRef}
        aria-label="Advertisement Left"
        className="hidden min-[1500px]:flex fixed left-3 xl:left-4 z-20 flex-col gap-4 w-[300px] pointer-events-auto transition-[top] duration-75 ease-out"
        style={{ top: `${topOffset}px` }}
      >
        <BannerAd adKey="left-top" />
        <BannerAd adKey="left-bottom" />
      </aside>

      {/* Right Side Banner Ads */}
      <aside
        aria-label="Advertisement Right"
        className="hidden min-[1500px]:flex fixed right-3 xl:right-4 z-20 flex-col gap-4 w-[300px] pointer-events-auto transition-[top] duration-75 ease-out"
        style={{ top: `${topOffset}px` }}
      >
        <BannerAd adKey="right-top" />
        <BannerAd adKey="right-bottom" />
      </aside>
    </>
  );
}
