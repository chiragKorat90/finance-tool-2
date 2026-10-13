"use client";

import React, { useEffect, useState } from "react";

interface BannerAdProps {
  className?: string;
  adKey?: string;
}

const BANNER_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;
    }
  </style>
</head>
<body>
  <script>
    (function(eqf){
      var d = document,
          s = d.createElement('script'),
          l = d.currentScript || d.scripts[d.scripts.length - 1];
      s.settings = eqf || {};
      s.src = "//juvenilechoice.com/bWXiVhs.deG/l/0TY/WJcf/lecmg9pu_Z-U/lukfPxTLcl1JM/T/Mv5_NXjvEdtYN/zoUFxSMxztk/2wNXQC";
      s.async = true;
      s.referrerPolicy = 'no-referrer-when-downgrade';
      l.parentNode.insertBefore(s, l);
    })({})
  </script>
</body>
</html>`;

export default function BannerAd({
  className = "",
  adKey = "default",
}: BannerAdProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-[300px] h-[250px] shrink-0 rounded-2xl ${className}`}
      />
    );
  }

  return (
    <div
      id={`banner-ad-container-${adKey}`}
      className={`w-[300px] h-[250px] shrink-0 overflow-hidden rounded-2xl shadow-sm border border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-center bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm transition-all duration-300 ${className}`}
    >
      <iframe
        title={`Advertisement ${adKey}`}
        srcDoc={BANNER_HTML}
        width="300"
        height="250"
        className="w-[300px] h-[250px] border-none overflow-hidden block"
        scrolling="no"
      />
    </div>
  );
}
