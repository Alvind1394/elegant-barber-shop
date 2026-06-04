'use client';

import {
  useMemo,
  useState,
} from 'react';

import {
  useRouter,
} from 'next/navigation';

import { toast } from 'sonner';

import { createClient } from '@supabase/supabase-js';
import {
  sendWhatsappService,
} from '@/services/whatsapp.service';

import {
  generateToken,
} from '@/utils/generateToken';

import {
  canModifyAppointment,
} from '@/utils/canModifyAppointment';

import {
  formatLocalDate,
} from '@/lib/date';

import {
  useBlockedDays,
} from '@/hooks/useBlockedDays';

import {
  useBlockedHours,
} from '@/hooks/useBlockedHours';

import { ServiceType } from '@/types/service';
import { DayType } from '@/types/day';
import { AppointmentType } from '@/types/appointment';

import { supabase } from '@/lib/supabase';
import { Header } from '@/components/shared/Header';

import { AdminDashboard } from '@/components/admin/AdminDashboard';

import { ServiceSelector } from '@/components/booking/ServiceSelector';
import { BookingForm } from '@/components/booking/BookingForm';
import { BookingSuccess } from '@/components/booking/BookingSuccess';
import {
  createAppointmentService,
} from '@/services/appointment.service';

import {
  updateAppointmentStatusService,
  deleteAppointmentService,
} from '@/services/appointment.service';

import {
  useAppointments,
} from '@/hooks/useAppointments';

import { SERVICES } from '@/lib/constants';
import { HOURS } from '@/lib/constants';
import { DateSelector } from '@/components/booking/DateSelector';
import { HourSelector } from '@/components/booking/HourSelector';


export default function ElegantBarberShopPreview() {
    const router =
  useRouter();
  
  const [step, setStep] = useState(1);

  const [selectedService, setSelectedService] =
    useState<ServiceType | null>(null);

  const [selectedDate, setSelectedDate] =
    useState<DayType | null>(null);

  const [selectedHour, setSelectedHour] =
    useState<string | null>(null);

  const [bookingConfirmed, setBookingConfirmed] =
    useState(false);

  const [manageToken, setManageToken] =
  useState('');

  const {
  appointments,

  loading:
    appointmentsLoading,

  refresh:
    refreshAppointments,
} = useAppointments();

const copyAppointmentCode =
  async () => {

    await navigator
      .clipboard
      .writeText(
        appointmentToken
      );

    toast.success(
      'Código copiado'
    );
  };


const {
  blockedDays,
  refreshBlockedDays,
} = useBlockedDays();

const {
  blockedHours,
  refreshBlockedHours,
} = useBlockedHours();

    const [appointmentToken, setAppointmentToken] =
  useState('');

  const [loading, setLoading] = useState(false);
    const [adminSelectedDate, setAdminSelectedDate] =
  useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const [adminSelectedHour, setAdminSelectedHour] =
  useState('');

const [blockReason, setBlockReason] =
  useState('Almuerzo');

  const [statusFilter, setStatusFilter] =
  useState('Todos');
  

const [editingAppointmentId, setEditingAppointmentId] =
  useState<string | null>(null);

  const [managedAppointment, setManagedAppointment] =
  useState<AppointmentType | null>(null);

  const [editDate, setEditDate] =
  useState<string>('');

const [editHour, setEditHour] =
  useState<string>('');


  const weekDays = useMemo(() => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 7; i += 1) {
      const currentDay = new Date(today);

      currentDay.setDate(today.getDate() + i);

      const formattedDate =
  formatLocalDate(
    currentDay
  );

const isBlocked =
  blockedDays.some(
    (blockedDay: string) =>
      blockedDay ===
      formattedDate
  );

if (isBlocked) {
  continue;
}

      days.push({
        id: currentDay.toISOString(),
        fullDate: currentDay,
        day: currentDay.toLocaleDateString('es-DO', {
          weekday: 'short',
        }),
        date: currentDay.toLocaleDateString('es-DO', {
          day: 'numeric',
          month: 'short',
        }),
      });
    }

   return days;
}, [blockedDays]);


  const bookedHours = appointments
    .filter((appointment) => {
      if (!selectedDate?.fullDate) {
        return false;
      }

      const selected = formatLocalDate(
  selectedDate.fullDate
);

      return appointment.booking_date === selected;
    })
    .map((appointment) => appointment.booking_hour);

    const availableHours =
  HOURS.filter((hour) => {

    // SI YA ESTÁ RESERVADA
    if (
      bookedHours.includes(hour)
    ) {
      return false;
    }

    // SI ESTÁ BLOQUEADA
const selectedDateFormatted =
  selectedDate?.fullDate
    ? formatLocalDate(
        selectedDate.fullDate
      )
    : '';

const isBlocked =
  blockedHours.some(
    (blockedHour) =>
      blockedHour.booking_date ===
        selectedDateFormatted &&
      blockedHour.booking_hour ===
        hour
  );

if (isBlocked) {
  return false;
}

    // VALIDAR SI ES EL DÍA ACTUAL
    if (selectedDate?.fullDate) {

      const now = new Date();

      const selected =
        new Date(
          selectedDate.fullDate
        );

      const isToday =
        now.toDateString() ===
        selected.toDateString();

      if (isToday) {

        // CONVERTIR HORA
        const [time, modifier] =
          hour.split(' ');

        let [hours, minutes] =
          time.split(':');

        let parsedHours =
          parseInt(hours);

        if (
          modifier === 'PM' &&
          parsedHours !== 12
        ) {
          parsedHours += 12;
        }

        if (
          modifier === 'AM' &&
          parsedHours === 12
        ) {
          parsedHours = 0;
        }

        const appointmentDate =
          new Date();

        appointmentDate.setHours(
          parsedHours
        );

        appointmentDate.setMinutes(
          parseInt(minutes)
        );

        appointmentDate.setSeconds(0);

        // MÍNIMO 2 HORAS
          const difference =
  appointmentDate.getTime() -
  now.getTime();

if (difference <= 0) {
  return false;
}
      }
    }

    return true;
  });

    const fullDays = useMemo(() => {
      
  const grouped: Record<string, number> = {};

  appointments.forEach((appointment) => {
    if (!grouped[appointment.booking_date]) {
      grouped[appointment.booking_date] = 0;
    }

    grouped[appointment.booking_date] += 1;
  });

  return Object.entries(grouped)
    .filter(([_, count]) => count >= HOURS.length)
    .map(([date]) => date);
}, [appointments]);


  const createAppointment = async ({
  customerName,
  phone,
  note,
}: {
  customerName: string;

  phone: string;

  note: string;
}) => {
    if (!customerName || !phone) {
      toast.error('Completa nombre y teléfono');
      return;
    }

    if (
      !selectedService ||
      !selectedDate ||
      !selectedHour
    ) {
      toast.error('Completa toda la reserva');
      return;
    }

    setLoading(true);

    const bookingDate = formatLocalDate(
  selectedDate.fullDate
);

const generatedToken =
  generateToken();

setAppointmentToken(generatedToken);


   const data =
  await createAppointmentService({
    customer_name:
      customerName,

    phone:
      phone,

    service_name:
      selectedService.name,

    service_price:
      selectedService.price,

    service_duration:
  Number(
    selectedService.duration
  ),

    booking_date:
      bookingDate,

    booking_hour:
      selectedHour,

    note:
      note,

    appointment_token:
      generatedToken,
  });

    setLoading(false);


 const barberPhone = '8295911178';
const message =
  'Hola ' +
  customerName +
  ' \u{1F44B}\n\n' +
  
  'Tu cita fue confirmada correctamente \u2705\n\n' +
  '\u{1F4C5} Fecha: ' +
  selectedDate?.day +
  ' ' +
  selectedDate?.date +
  '\n' +
  '\u{1F552} Hora: ' +
  selectedHour +
  '\n' +
  '\u2702\uFE0F Servicio: ' +
  selectedService?.name +
  '\n' +
  '\u{1F4F1} Telefono: ' +
  phone +
  '\n\n' +
  '\u{1F511} Código de gestión: ' +
  generatedToken +
  '\n\n' +
  'Gracias por reservar con nosotros \u{1F64C}';

  try {

  await sendWhatsappService({
    phone: `1${barberPhone}`,
    message,
  });

} catch (error) {

  console.error(
    'Error enviando WhatsApp',
    error
  );

}

    setBookingConfirmed(true);
    setStep(5);
  };

  const resetBooking = () => {
    setStep(1);
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedHour(null);
    setBookingConfirmed(false);
   
  };

  const validateAppointmentToken =
  async () => {
    const { data, error } =
      await supabase
        .from('appointments')
        .select('*')
        .eq(
          'appointment_token',
          manageToken
        )
        .single();

    if (error || !data) {
      toast.error(
        'Código inválido'
      );

      return;
    }

    if (
  !canModifyAppointment(
    data.booking_date,
    data.booking_hour
  )
) {
  toast.error(
    'Solo puedes modificar o cancelar una cita con mínimo 2 horas de anticipación.'
  );

  return;
}

  setEditingAppointmentId(data.id);

  console.log('ID CITA:', data.id);

setManagedAppointment(data);

setEditDate(data.booking_date);

setEditHour(data.booking_hour);

setStep(8);
  };


const updateAppointmentStatus =
  async (
    id: string,
    status: string
  ) => {
    try {
      await updateAppointmentStatusService(
        id,
        status
      );
    } catch (error) {
      console.error(error);
    }
  };

const deleteAppointment =
  async (id: string) => {
    try {
      await deleteAppointmentService(
        id
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdminAccess = () => {
   window.location.href =
    '/admin/login';
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white font-sans">
    
      <Header
  step={step}
  onAdminAccess={handleAdminAccess}
  onExitAdmin={() => setStep(1)}
/>
      {step === 1 && (
  <ServiceSelector
    services={SERVICES}
    selectedService={
      selectedService
    }
    onSelect={(
      service
    ) => {
      setSelectedService(
        service
      );

      setStep(2);
    }}
  />
)}

      {step === 2 && (
  <DateSelector
    availableDays={
      weekDays
    }
    selectedDate={
      selectedDate
    }
    onSelect={(day) => {
      setSelectedDate(day);

      setStep(3);
    }}
    onBack={() =>
      setStep(1)
    }
  />
)}

{step === 3 && (
  <HourSelector
    availableHours={
      availableHours
    }
    selectedHour={
      selectedHour
    }
    onSelect={(hour) => {
      setSelectedHour(
        hour
      );

      setStep(4);
    }}
    onBack={() =>
      setStep(2)
    }
  />
)}

      {step === 4 &&
  selectedService &&
  selectedDate &&
  selectedHour && (
    <BookingForm
      selectedService={
        selectedService
      }
      selectedDate={
        selectedDate
      }
      selectedHour={
        selectedHour
      }
      onBack={() =>
        setStep(3)
      }
      onSubmit={async ({
        customerName,
        phone,
        note,
      }) => {
        await createAppointment({
          customerName,
          phone,
          note,
        });
      }}
    />
  )}

     {step === 5 && (
  <BookingSuccess
    appointmentToken={
      appointmentToken
    }
    onFinish={() => {

  setSelectedService(
    null
  );

  setSelectedDate(null);

  setSelectedHour(
    null
  );

  setAppointmentToken(
    ''
  );

  router.push('/');


  
}}
  />
)}

      {step === 7 && (
  <section className="px-6 py-10">
    <div className="max-w-md mx-auto bg-[#1A1A1A] rounded-3xl p-6 border border-yellow-500/10">
      <button
        onClick={() => setStep(1)}
        className="mb-6 text-yellow-400"
      >
        ← Volver
      </button>

      <h2 className="text-3xl font-bold mb-4 text-yellow-400">
        Gestionar cita
      </h2>

      <p className="text-gray-400 mb-6">
        Ingresa tu código de reserva para
        editar o cancelar tu cita.
      </p>

      <input
        type="text"
        placeholder="Código de 6 dígitos"
        value={manageToken}
        onChange={(e) =>
          setManageToken(e.target.value)
        }
        className="w-full bg-black border border-gray-700 rounded-2xl px-4 py-4 outline-none mb-6 text-center text-2xl tracking-widest"
      />

      <button
        onClick={validateAppointmentToken}
        className="w-full bg-yellow-500 text-black font-bold py-5 rounded-2xl text-lg"
      >
        Continuar
      </button>
    </div>
  </section>
)}

{step === 8 && managedAppointment && (
  <section className="px-6 py-10">
    <div className="max-w-md mx-auto bg-[#1A1A1A] rounded-3xl p-6 border border-yellow-500/10">
      <button
        onClick={() => setStep(1)}
        className="mb-6 text-yellow-400"
      >
        ← Volver
      </button>

      <h2 className="text-3xl font-bold mb-6 text-yellow-400">
        Gestionar cita
      </h2>

      <div className="bg-black rounded-2xl p-4 mb-6 border border-gray-800">
        <p className="mb-2">
          <span className="text-gray-400">
            Cliente:
          </span>{' '}
          {managedAppointment.customer_name}
        </p>

        <p className="mb-2">
          <span className="text-gray-400">
            Servicio:
          </span>{' '}
          {managedAppointment.service_name}
        </p>

        <p className="mb-2">
          <span className="text-gray-400">
            Fecha actual:
          </span>{' '}
          {managedAppointment.booking_date}
        </p>

        <p>
          <span className="text-gray-400">
            Hora actual:
          </span>{' '}
          {managedAppointment.booking_hour}
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <select
  value={editDate}
  onChange={(e) => {
    setEditDate(e.target.value);
  }}
  className="w-full bg-black border border-gray-700 rounded-2xl px-4 py-4 outline-none"
>
  <option value="">
    Selecciona nueva fecha
  </option>

  {weekDays.map((day) => (
    <option
      key={day.id}
      value={
        day.fullDate
          .toISOString()
          .split('T')[0]
      }
    >
      {day.day} - {day.date}
    </option>
  ))}
</select>
        <select
  value={editHour}
  onChange={(e) =>
    setEditHour(e.target.value)
  }
  className="w-full bg-black border border-gray-700 rounded-2xl px-4 py-4 outline-none"
>
  <option value="">
    Selecciona nueva hora
  </option>

  {HOURS.map((hour) => {
    const isBooked =
      appointments.some(
        (appointment) =>
          appointment.booking_date ===
            editDate &&
          appointment.booking_hour ===
            hour &&
          appointment.id !==
            editingAppointmentId
      );

    return (
      <option
        key={hour}
        value={hour}
        disabled={isBooked}
      >
        {isBooked
          ? `${hour} - Ocupado`
          : hour}
      </option>
    );
  })}
</select>

      </div>

      <button
        onClick={async () => {
          if (!editDate || !editHour) {
            toast.message(
              'Selecciona nueva fecha y hora'
            );

            return;
          }

          const bookingDate = editDate;

          const { error } =
            await supabase
              .from('appointments')
              .update({
                booking_date: bookingDate,
                booking_hour: editHour,
              })
              .eq(
  'id',
  managedAppointment.id
);

          if (error) {
  console.error(error);

  toast.error(
    error.message
  );

  return;
}

const barberPhone = '8295911178';
const message =
  `La cita de ${managedAppointment?.customer_name}
fue actualizada correctamente.

Fecha: ${managedAppointment.booking_date}

Hora: ${managedAppointment.booking_hour}`;

 try {

  await sendWhatsappService({
    phone: `1${barberPhone}`,
    message,
  });

} catch (error) {

  console.error(
    'Error enviando WhatsApp',
    error
  );

}

          toast.success(
            'Cita actualizada correctamente'
          );

          refreshAppointments();

          setManagedAppointment(null);

          setEditingAppointmentId(null);

          setStep(1);
        }}
        className="w-full bg-yellow-500 text-black font-bold py-5 rounded-2xl text-lg mb-4"
      >
        Reprogramar cita
      </button>

      <button
        onClick={async () => {
          const confirmed =
            window.confirm(
              '¿Seguro que deseas cancelar la cita?'
            );

          if (!confirmed) {
            return;
          }

          const { error } = await supabase
            .from('appointments')
            .delete()
            .eq(
  'id',
  managedAppointment.id
);

          if (error) {
  console.error(error);

  toast.error(
    error.message
  );

  return;
}

 const barberPhone = '8295911178';       
 const message = `La cita de ${managedAppointment?.customer_name}
fue actualizada correctamente.

Fecha: ${managedAppointment.booking_date}

Hora: ${managedAppointment.booking_hour}`;
          
 try {

  await sendWhatsappService({
    phone: `1${barberPhone}`,
    message,
  });

} catch (error) {

  console.error(
    'Error enviando WhatsApp',
    error
  );

}          

          toast.success(
            'Cita cancelada correctamente'
          );

          refreshAppointments();

          setManagedAppointment(null);

          setEditingAppointmentId(null);

          setStep(1);
        }}
        className="w-full bg-red-600 text-white font-bold py-5 rounded-2xl text-lg"
      >
        Cancelar cita
      </button>
    </div>
  </section>
)}

            {step === 99 && (
        <AdminDashboard
          appointments={
            appointments
          }

          onStart={() => {}}

          onComplete={async (
            id
          ) => {
            await updateAppointmentStatus(
              id,
              'Finalizada'
            );
          }}
          onDelete={async (
            id
          ) => {
            await deleteAppointment(
              id
            );
          }}

          refreshBlockedDays={
  refreshBlockedDays
}
        />
      )}
    </div>
  );
}
