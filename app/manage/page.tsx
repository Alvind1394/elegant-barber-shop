'use client';

import { useState } from 'react';

import { ManageAppointment } from '@/components/booking/ManageAppointment';

export default function ManagePage() {
 return (
  <main className="min-h-screen bg-[#050505] text-white">

    <div className="p-6">
      <button
        onClick={() => {
          window.location.href = '/';
        }}
        className="
          border
          border-yellow-500/20
          hover:border-yellow-400/40
          text-yellow-400
          px-5
          py-3
          rounded-2xl
          transition-all
          duration-300
        "
      >
        ← Volver al home
      </button>
    </div>

    <main className="min-h-screen bg-[#050505] text-white">

      <div className="max-w-2xl mx-auto px-6 py-16">

        <div className="text-center mb-10">

          <h1 className="text-4xl font-black">
            Gestionar cita
          </h1>

          <p className="text-zinc-400 mt-3">
            Introduce tu token para modificar
            o cancelar tu cita.
          </p>

        </div>

        <ManageAppointment />

      </div>

    </main>

     </main>
  );
}