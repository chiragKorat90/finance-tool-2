"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function BotDetector() {
  const pathname = usePathname();
  const reportedEvents = useRef(new Set<string>());

  useEffect(() => {
    // 1. Report JS execution (page load)
    const reportEvent = (type: string) => {
      // Prevent reporting the exact same event multiple times on the same page load
      const eventKey = `${pathname}-${type}`;
      if (reportedEvents.current.has(eventKey)) return;
      
      reportedEvents.current.add(eventKey);

      fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          url: pathname,
        }),
      }).catch((e) => {
        // Silently ignore tracking errors
      });
    };

    // Report initial JS execution
    reportEvent("js_execution");

    // 2. Report user interactions (scroll, mousemove) with debouncing to avoid spamming
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        reportEvent("scroll_interaction");
        window.removeEventListener("scroll", handleScroll); // only report once per page
      }, 500);
    };

    let mouseTimeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        reportEvent("mouse_movement");
        window.removeEventListener("mousemove", handleMouseMove); // only report once per page
      }, 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(scrollTimeout);
      clearTimeout(mouseTimeout);
    };
  }, [pathname]);

  return null; // This component doesn't render anything visually
}
