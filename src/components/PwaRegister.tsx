'use client';

import { useEffect } from 'react';

export default function PwaRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(
          function(registration) {
            console.log('✅ PWA Service Worker registrado exitosamente en SJM.');
          },
          function(err) {
            console.error('❌ Error al registrar PWA Service Worker: ', err);
          }
        );
      });
    }
  }, []);

  return null;
}
