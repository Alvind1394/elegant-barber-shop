'use client';

import {
  useEffect,
  useState,
} from 'react';

import { toast } from 'sonner';

import { useRouter } from 'next/navigation';

import { supabase } from '@/lib/supabase';

import { AdminDashboard } from '@/components/admin/AdminDashboard';

import { sendWhatsappService }
from '@/services/whatsapp.service';

import {
  useAppointments
} from '@/hooks/useAppointments';


import {
  useBlockedDays
} from '@/hooks/useBlockedDays';

export default function AdminPage() {

  const [
  realtimeReady,
  setRealtimeReady,
] = useState(false);

    const {
  appointments,
  refreshAppointments,
} = useAppointments();

const {
  refreshBlockedDays,
} = useBlockedDays();

  const router =
    useRouter();

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    authorized,
    setAuthorized,
  ] = useState(false);

 

  useEffect(() => {

    checkAuth();

    setTimeout(
  () =>
    setRealtimeReady(true),
  3000
);

  }, []);

  

  const checkAuth =
    async () => {

      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (!session) {

       router.push('/');

        return;
      }

      setAuthorized(true);

      setLoading(false);
      

    };

const handleStart =
  async (
    id: string
  ) => {

    const appointment =
      appointments.find(
        (item) =>
          item.id === id
      );

    if (!appointment) {
      return;
    }

    const duration =
      Number(
        appointment.service_duration
      ) || 45;

    // timestamp REAL actual
    const now =
      Date.now();

    // calcular fin REAL
    const endTime =
      now +
      duration *
        60 *
        1000;

    await supabase
      .from('appointments')
      .update({
        status:
          'En progreso',

        started_at:
          new Date(
            now
          ).toISOString(),

        timer_end:
          new Date(
            endTime
          ).toISOString(),
      })
      .eq('id', id);

    refreshAppointments();
  };

const handleComplete =
  async (
    id: string
  ) => {

    // Buscar la cita que se está finalizando
    const currentAppointment =
      appointments.find(
        item => item.id === id
      );

    if (!currentAppointment) {
      return;
    }

    // Finalizar cita actual
    await supabase
      .from('appointments')
      .update({
        status: 'Finalizada',
      })
      .eq('id', id);

    // Buscar próxima cita del mismo día
    const currentDateTime =
  new Date(
    `${currentAppointment.booking_date} ${currentAppointment.booking_hour}`
  ).getTime();

const nextAppointment =
  appointments
    .filter(
      item =>
        item.status ===
          'Confirmada' &&
        item.booking_date ===
          currentAppointment.booking_date
    )
    .map(item => ({
      ...item,
      timestamp:
        new Date(
          `${item.booking_date} ${item.booking_hour}`
        ).getTime(),
    }))
    .filter(
      item =>
        item.timestamp >
        currentDateTime
    )
    .sort(
      (a, b) =>
        a.timestamp -
        b.timestamp
    )[0];

    if (nextAppointment) {

  console.log(
    'Cita actual:',
    currentAppointment.customer_name,
    currentAppointment.booking_hour
  );

  console.log(
    'Próxima cita:',
    nextAppointment.customer_name,
    nextAppointment.booking_hour
  );

  await sendWhatsappService({

    phone:
  `1${nextAppointment.phone}`,

    message:
`Hola ${nextAppointment.customer_name} 👋

Te informamos que el servicio anterior ya ha finalizado ✅

Tu cita para las ${nextAppointment.booking_hour} sigue confirmada.

Puedes prepararte para asistir.

Gracias por elegirnos 🙌

Att: Oscar Eduardo (ROYCE)`

  });

}

    refreshAppointments();
  };

const handleDelete =
  async (
    id: string
  ) => {

    const confirmed =
      window.confirm(
        '¿Eliminar cita?'
      );

    if (!confirmed) {
      return;
    }

    await supabase
  .from('appointments')
  .delete()
  .eq('id', id);

    refreshAppointments();
  };


  const logout =
  async () => {

    await supabase.auth.signOut();

    window.location.href = '/';
  };

  if (loading) {

    return (
      <main className="
        min-h-screen
        bg-[#050505]
        flex
        items-center
        justify-center
        text-white
      ">
        Cargando...
      </main>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <main className="
      min-h-screen
      bg-[#050505]
      text-white
    ">

      <div className="
        flex
        items-center
        justify-between
        p-6
        border-b
        border-zinc-800
      ">

        <div>

          <h1 className="
            text-3xl
            font-black
            text-yellow-400
          ">
            Admin Dashboard
          </h1>

          <p className="text-zinc-500">
            Panel privado
          </p>

        </div>

        <button
          onClick={logout}
          className="
            bg-red-500
            hover:bg-red-400
            text-white
            px-5
            py-3
            rounded-2xl
            font-bold
          "
        >
          Logout
        </button>

      </div>

      <AdminDashboard
  appointments={
    appointments
  }
  onStart={
  handleStart
}
  onComplete={
    handleComplete
  }
  onDelete={
    handleDelete
  }
  refreshBlockedDays={
    refreshBlockedDays
  }
/>

    </main>
  );
}