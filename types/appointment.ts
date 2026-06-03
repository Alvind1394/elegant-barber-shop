export type AppointmentStatus =
  | 'Confirmada'
  | 'En progreso'
  | 'Finalizada';

export type AppointmentType = {
  id: string;

  customer_name: string;

  phone: string;

  service_name: string;

  service_price: string;

  booking_date: string;

  booking_hour: string;

  note: string;

  status: AppointmentStatus;

  appointment_token: string;

  created_at?: string;

  timer_end?: string;

started_at?: string;

service_duration?: number;
};