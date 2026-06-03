import { supabase } from '@/lib/supabase';

import { AppointmentType } from '@/types/appointment';

type CreateAppointmentPayload = {
  customer_name: string;

  phone: string;

  service_name: string;

  service_price: string;

  service_duration: number;

  booking_date: string;

  booking_hour: string;

  note: string;

  appointment_token: string;
};

export const createAppointmentService =
  async (
    payload: CreateAppointmentPayload
  ) => {

    const {
      data,
      error,
    } =
      await supabase
        .from('appointments')
        .insert([
          {
            ...payload,

            status:
              'Confirmada',
          },
        ])
        .select()
        .single();

    if (error) {
      throw error;
    }

    return data;
  };

export const getAppointmentsService =
  async (): Promise<
    AppointmentType[]
  > => {

    const {
      data,
      error,
    } =
      await supabase
        .from('appointments')
        .select('*')
        .order(
          'created_at',
          {
            ascending: false,
          }
        );

    if (error) {
      throw error;
    }

    return data || [];
  };

export const updateAppointmentStatusService =
  async (
    id: string,
    status: string
  ) => {

    const { error } =
      await supabase
        .from('appointments')
        .update({
          status,
        })
        .eq('id', id);

    if (error) {
      throw error;
    }
  };

export const deleteAppointmentService =
  async (
    id: string
  ) => {

    const { error } =
      await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

    if (error) {
      throw error;
    }
  };