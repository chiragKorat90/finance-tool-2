import React from 'react';

export default function BannerAd() {
  return (
    <script 
      dangerouslySetInnerHTML={{ 
        __html: `(function(s){s.dataset.zone='11878292',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` 
      }} 
    />
  );
}
