'use client';

import { useEffect } from 'react';
import { Toaster } from 'sonner';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  useEffect(() => {
    const unlock = () => {
      const audio = new Audio();
      audio.src = '/sounds/new-booking.mp3';

      audio.play().catch(() => {});

      window.removeEventListener('click', unlock);
    };

    window.addEventListener('click', unlock);

    return () => window.removeEventListener('click', unlock);
  }, []);

  return (
    <html lang="es">
      <body>
        {children}

        <Toaster
          richColors
          position="top-right"
        />
      </body>
    </html>
  );
}
