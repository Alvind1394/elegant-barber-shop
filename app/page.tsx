'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col">

      <div className="
  absolute
  top-6
  right-6
">
  <button
    onClick={() => {
  window.location.href =
    '/admin/login';
}}
    className="
      text-xs
      bg-[#111111]
      border
      border-yellow-500/20
      hover:border-yellow-400/40
      text-yellow-400
      px-4
      py-2
      rounded-full
      transition-all
      duration-300
    "
  >
    Admin
  </button>
</div>

      {/* HERO */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center">

        <div className="mb-10">

          <h1 className="text-5xl md:text-7xl font-black tracking-tight">

            <span className="text-yellow-400">
              ELEGANT
            </span>{' '}

            BARBER

          </h1>

          <p className="text-zinc-400 mt-5 text-lg md:text-xl max-w-xl">
            Reserva tu cita online en segundos
            y vive una experiencia premium.
          </p>

        </div>

        {/* BOTONES */}
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-md">

          <Link
            href="/booking"
            className="
              flex-1
              bg-yellow-400
              hover:bg-yellow-300
              text-black
              font-bold
              py-5
              rounded-3xl
              text-lg
              transition-all
              duration-300
              hover:scale-105
              shadow-2xl
              text-center
            "
          >
            ✂ Reservar cita
          </Link>

          <Link
            href="/manage"
            className="
              flex-1
              border
              border-yellow-400/40
              bg-[#111111]
              hover:bg-[#1A1A1A]
              text-white
              font-bold
              py-5
              rounded-3xl
              text-lg
              transition-all
              duration-300
              hover:scale-105
              shadow-xl
              text-center
            "
          >
            🔑 Gestionar cita
          </Link>


        </div>

      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-zinc-500 text-sm border-t border-zinc-800">
        Elegant Barber Shop © 2026
      </footer>

    </main>
  );
}
