'use client';

import { useState } from 'react';

import { supabase } from '@/lib/supabase';

import { AppointmentType } from '@/types/appointment';

export function ManageAppointment() {
  const [token, setToken] =
    useState('');

  const [appointment, setAppointment] =
    useState<AppointmentType | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  const searchAppointment =
    async () => {
      if (!token) {
        window.alert(
          'Ingresa el token'
        );

        return;
      }

      setLoading(true);

      const { data, error } =
        await supabase
          .from('appointments')
          .select('*')
          .eq(
            'appointment_token',
            token
          )
          .single();

      setLoading(false);

      if (error || !data) {
        window.alert(
          'Cita no encontrada'
        );

        return;
      }

      setAppointment(data);
    };

  return (
    <div className="bg-[#111111] border border-yellow-500/10 rounded-3xl p-6">

      {!appointment && (
        <>
          <input
            type="text"
            placeholder="Código de reserva"
            value={token}
            onChange={(e) =>
              setToken(e.target.value)
            }
            className="
              w-full
              bg-black
              border
              border-zinc-700
              rounded-2xl
              px-5
              py-4
              outline-none
              text-center
              text-xl
              tracking-widest
              mb-5
            "
          />

          <button
            onClick={searchAppointment}
            disabled={loading}
            className="
              w-full
              bg-yellow-400
              hover:bg-yellow-300
              text-black
              font-bold
              py-4
              rounded-2xl
              transition-all
            "
          >
            {loading
              ? 'Buscando...'
              : 'Buscar cita'}
          </button>
        </>
      )}

      {appointment && (
  <div className="space-y-4">

    <div className="bg-black rounded-2xl p-5 border border-zinc-800">

      <p>
        <span className="text-zinc-400">
          Cliente:
        </span>{' '}
        {appointment.customer_name}
      </p>

      <p>
        <span className="text-zinc-400">
          Servicio:
        </span>{' '}
        {appointment.service_name}
      </p>

      <p>
        <span className="text-zinc-400">
          Fecha:
        </span>{' '}
        {appointment.booking_date}
      </p>

      <p>
        <span className="text-zinc-400">
          Hora:
        </span>{' '}
        {appointment.booking_hour}
      </p>

    </div>

    {/* NUEVA FECHA */}
    <input
      type="date"
      className="
        w-full
        bg-black
        border
        border-zinc-700
        rounded-2xl
        px-4
        py-4
        outline-none
      "
      onChange={(e) =>
        setAppointment({
          ...appointment,
          booking_date:
            e.target.value,
        })
      }
      value={
        appointment.booking_date
      }
    />

    {/* NUEVA HORA */}
    <input
      type="text"
      placeholder="Nueva hora"
      className="
        w-full
        bg-black
        border
        border-zinc-700
        rounded-2xl
        px-4
        py-4
        outline-none
      "
      onChange={(e) =>
        setAppointment({
          ...appointment,
          booking_hour:
            e.target.value,
        })
      }
      value={
        appointment.booking_hour
      }
    />

    {/* REPROGRAMAR */}
    <button
      onClick={async () => {

        const { error } =
          await supabase
            .from('appointments')
            .update({
              booking_date:
                appointment.booking_date,

              booking_hour:
                appointment.booking_hour,
            })
            .eq(
              'id',
              appointment.id
            );

        if (error) {
          window.alert(
            error.message
          );

          return;
        }

        window.alert(
          'Cita actualizada correctamente'
        );
      }}
      className="
        w-full
        bg-yellow-400
        hover:bg-yellow-300
        text-black
        font-bold
        py-4
        rounded-2xl
      "
    >
      Reprogramar cita
    </button>

    {/* CANCELAR */}
    <button
      onClick={async () => {

        const confirmed =
          window.confirm(
            '¿Deseas cancelar la cita?'
          );

        if (!confirmed) {
          return;
        }

        const { error } =
          await supabase
            .from('appointments')
            .delete()
            .eq(
              'id',
              appointment.id
            );

        if (error) {
          window.alert(
            error.message
          );

          return;
        }

        window.alert(
          'Cita cancelada'
        );

        setAppointment(null);

        setToken('');
      }}
      className="
        w-full
        bg-red-600
        hover:bg-red-500
        text-white
        font-bold
        py-4
        rounded-2xl
      "
    >
      Cancelar cita
    </button>

    <button
      onClick={() =>
        setAppointment(null)
      }
      className="
        w-full
        border
        border-yellow-400/30
        py-4
        rounded-2xl
      "
    >
      Buscar otra cita
    </button>

  </div>
)}

   </div>
  );
}