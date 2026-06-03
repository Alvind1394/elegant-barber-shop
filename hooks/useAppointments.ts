'use client';

import {
  useEffect,
  useState,
} from 'react';

import { toast } from 'sonner';

import { supabase } from '@/lib/supabase';

import { AppointmentType } from '@/types/appointment';

export const useAppointments =
  () => {
    const [
      appointments,
      setAppointments,
    ] = useState<
      AppointmentType[]
    >([]);

let isPlaying = false;

const playNotificationSound = async () => {
  if (isPlaying) return;

  try {
    isPlaying = true;

    const audio = new Audio('/sounds/new-booking.mp3');
    audio.volume = 1;
    audio.currentTime = 0;

    await audio.play();

  } catch (error) {
    // Error silenciado
  } finally {
    setTimeout(() => {
      isPlaying = false;
    }, 800);
  }
};


    const [loading, setLoading] =
      useState(true);

   const fetchAppointments =
  async () => {

    setLoading(true);

    const { data } =
      await supabase
        .from('appointments')
        .select('*')
        .order('booking_date', {
  ascending: true,
})
.order('booking_hour', {
  ascending: true,
})

    if (data) {
      setAppointments(data);
    }

    setLoading(false);
  };

    useEffect(() => {
      fetchAppointments();

      const channel =
        supabase.channel(
          'appointments-realtime'
        );

      channel
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table:
              'appointments',
          },
         (payload) => {

  if (
  payload.eventType ===
  'INSERT'
) {

  playNotificationSound();

  toast.info(
    `👤 ${payload.new.customer_name}
✂️ ${payload.new.service_name}
🕒 ${payload.new.booking_hour}`
  );

}

  fetchAppointments();

}
        )
        .subscribe();

      return () => {
        supabase.removeChannel(
          channel
        );
      };
    }, []);

 return {
  appointments,

  loading,

  refresh:
    fetchAppointments,

  refreshAppointments:
    fetchAppointments,
};
  };