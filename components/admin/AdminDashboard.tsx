import {
  useEffect,
  useState,
} from 'react';

import { toast } from 'sonner';

import { supabase } from '@/lib/supabase';

import { AppointmentType } from '@/types/appointment';

import { useBlockedHours } from '@/hooks/useBlockedHours';

import { LiveTimer }
from '@/components/admin/LiveTimer';

type Props = {
  appointments: AppointmentType[];

  onStart: (
  id: string
) => void;

  onComplete: (
    id: string
  ) => void;

  onDelete: (
    id: string
  ) => void;

  refreshBlockedDays:
  () => void;
};

export const AdminDashboard = ({
  appointments,
  onStart,
  onComplete,
  onDelete,
  refreshBlockedDays,
}: Props) => {

    const {
  refreshBlockedHours,
} = useBlockedHours();

    const [search, setSearch] =
  useState('');

const [statusFilter, setStatusFilter] =
  useState('Todos');

const [dateFilter, setDateFilter] =
  useState('');

  const [
  revenueMode,
  setRevenueMode,
] = useState<
  'today' | 'month'
>('today');

  const [
  blockedDaysList,
  setBlockedDaysList,
] = useState<string[]>([]);

  const [blockDate, setBlockDate] =
  useState('');

const [blockHourDate, setBlockHourDate] =
  useState('');

const [blockHour, setBlockHour] =
  useState('');

const [
  blockedHoursList,
  setBlockedHoursList,
] = useState<any[]>([]);

const [activeTab, setActiveTab] =
  useState<
    'appointments' | 'blocks'
  >('appointments');

const loadBlockedDays =
  async () => {

    const { data } =
      await supabase
        .from('blocked_days')
        .select('*');

    if (!data) {
      return;
    }

    const formatted =
      data.map(
        (item: any) =>
          item.date
      );

    setBlockedDaysList(
      formatted
    );
  };

  const filteredAppointments =
  appointments.filter(
    (appointment) => {

      const matchesSearch =
        appointment.customer_name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesStatus =
        statusFilter ===
          'Todos' ||
        appointment.status ===
          statusFilter;

      const matchesDate =
  !dateFilter ||
  appointment.booking_date ===
    dateFilter;

    return (
  matchesSearch &&
  matchesStatus &&
  matchesDate
);
    }
  );


 const completedAppointments =
  filteredAppointments
    .filter(
      appointment =>
        appointment.status ===
        'Finalizada'
    )
    .sort((a, b) => {

      const dateA =
        new Date(
          `${a.booking_date} ${a.booking_hour}`
        );

      const dateB =
        new Date(
          `${b.booking_date} ${b.booking_hour}`
        );

      return (
        dateB.getTime() -
        dateA.getTime()
      );
    });

const pendingAppointments =
  filteredAppointments.filter(
    (appointment) =>
      appointment.status !==
      'Finalizada'
  );

  useEffect(() => {

  loadBlockedHours();

  loadBlockedDays();

}, []);


  const blockDay = async () => {

  if (!blockDate) {
    toast.error(
      'Selecciona fecha'
    );

    return;
  }

  const { error } =
    await supabase
      .from('blocked_days')
      .insert({
        date: blockDate,
      });

  if (error) {
    toast.error(
      error.message
    );

    return;
  }

  toast.success(
    'Día bloqueado'
  );

  loadBlockedDays();
  refreshBlockedDays();
  setBlockDate('');
};

const loadBlockedHours =
  async () => {

    const { data } =
      await supabase
        .from('blocked_hours')
        .select('*')
        .order(
          'booking_date',
          {
            ascending: true,
          }
        );

    if (data) {
      setBlockedHoursList(
        data
      );
    }
  };

const blockHourAction =
  async () => {

    if (
      !blockHourDate ||
      !blockHour
    ) {
      toast.error(
        'Completa fecha y hora'
      );

      return;
    }

    const { error } =
      await supabase
        .from('blocked_hours')
         .insert({
      booking_date:
        blockHourDate,

      booking_hour:
        blockHour,
    });

    if (error) {
      toast.error(
        error.message
      );

      return;
    }

    refreshBlockedHours();
    toast.success(
      'Hora bloqueada'
    );

    loadBlockedHours();

    setBlockHourDate('');

    setBlockHour('');
  };

  const unblockHour =
  async (id: string) => {

    const confirmed =
      window.confirm(
        '¿Desbloquear hora?'
      );

    if (!confirmed) {
      return;
    }

    const { error } =
      await supabase
        .from('blocked_hours')
        .delete()
        .eq('id', id);

    if (error) {
      toast.error(
        error.message
      );

      return;
    }

    loadBlockedHours();
  };

const unblockDay =
  async (
    date: string
  ) => {

    const confirmed =
      window.confirm(
        '¿Desbloquear día?'
      );

    if (!confirmed) {
      return;
    }

    const { error } =
      await supabase
        .from('blocked_days')
        .delete()
        .eq(
          'date',
          date
        );

    if (error) {

      toast.error(
        error.message
      );

      return;
    }

    loadBlockedDays();
    refreshBlockedDays();
  };

  const inProgressList =
  appointments.filter(
    (appointment) =>
      appointment.status ===
      'En progreso'
  );

const pendingList =
  filteredAppointments.filter(
    (appointment) =>
      appointment.status ===
      'Confirmada'
  );

const completedList =
  filteredAppointments.filter(
    (appointment) =>
      appointment.status ===
      'Finalizada'
  );

  const today =
  new Date()
    .toISOString()
    .split('T')[0];

    const now =
  new Date();

const currentMonth =
  now.getMonth();

const currentYear =
  now.getFullYear();

const completedToday =
  appointments.filter(
    (appointment) =>
      appointment.status ===
        'Finalizada' &&
      appointment.booking_date ===
        today
  );

const completedMonth =
  appointments.filter(
    (appointment) => {

      const calculateRevenue =
  (
    list: AppointmentType[]
  ) => {

    return list.reduce(
      (
        acc,
        appointment
      ) => {

        const cleanPrice =
          String(
            appointment.service_price || ''
          )
            .replace(
              'RD$',
              ''
            )
            .replace(
              ',',
              ''
            )
            .replace(
              'pesos',
              ''
            )
            .trim();

        const price =
          Number(
            cleanPrice
          );

        return (
          acc +
          (
            isNaN(price)
              ? 0
              : price
          )
        );
      },
      0
    );
  };

      if (
        appointment.status !==
        'Finalizada'
      ) {
        return false;
      }

      const appointmentDate =
        new Date(
          appointment.booking_date
        );

      return (
        appointmentDate.getMonth() ===
          currentMonth &&
        appointmentDate.getFullYear() ===
          currentYear
      );
    }
  );


const calculateRevenue =
  (
    list:
      AppointmentType[]
  ) => {

    return list.reduce(
      (
        acc,
        appointment
      ) => {

        const cleanPrice =
          String(
            appointment.service_price ||
            ''
          )
            .replace(
              'RD$',
              ''
            )
            .replace(
              ',',
              ''
            )
            .replace(
              'pesos',
              ''
            )
            .trim();

        const price =
          Number(
            cleanPrice
          );

        return (
          acc +
          (
            isNaN(
              price
            )
              ? 0
              : price
          )
        );
      },
      0
    );
  };


const totalRevenue =
  revenueMode ===
  'today'

    ? calculateRevenue(
        completedToday
      )

    : calculateRevenue(
        completedMonth
      );

const todayAppointments =
  appointments.filter(
    (appointment) =>
      appointment.booking_date ===
      today
  );

const inProgressCount =
  appointments.filter(
    (appointment) =>
      appointment.status ===
      'En progreso'
  ).length;

  return (
  <>

  <div className="mb-2 px-6 pt-6">
  <h1 className="text-4xl font-black text-yellow-400">
    Admin Dashboard
  </h1>

  <p className="text-zinc-500 mt-2">
    Gestiona todas las citas de la barbería
  </p>
</div>
    
    <div className="space-y-6 p-6">
        <div className="
  flex
  gap-4
  mb-6
">

  <button
    onClick={() =>
      setActiveTab(
        'appointments'
      )
    }
    className={`
      px-6
      py-3
      rounded-2xl
      font-bold
      transition-all

      ${
        activeTab ===
        'appointments'

          ? 'bg-yellow-400 text-black'

          : `
            bg-[#111111]
            border
            border-yellow-500/10
            text-white
          `
      }
    `}
  >
    📋 Citas
  </button>

  <button
    onClick={() =>
      setActiveTab(
        'blocks'
      )
    }
    className={`
      px-6
      py-3
      rounded-2xl
      font-bold
      transition-all

      ${
        activeTab ===
        'blocks'

          ? 'bg-yellow-400 text-black'

          : `
            bg-[#111111]
            border
            border-yellow-500/10
            text-white
          `
      }
    `}
  >
    🔒 Bloqueos
  </button>

</div>

{activeTab ===
  'appointments' && (
<>
     <div className="
  grid
  grid-cols-2
  xl:grid-cols-6
  gap-4
">

  {/* TOTAL */}
  <div className="bg-[#111111] border border-yellow-500/10 rounded-3xl p-6">
    <p className="text-gray-400 text-sm mb-2">
      Total citas
    </p>

    <h2 className="text-4xl font-black text-yellow-400">
  {filteredAppointments.length}
</h2>
  </div>

  {/* PENDIENTES */}
  <div className="bg-[#111111] border border-blue-500/10 rounded-3xl p-6">
    <p className="text-gray-400 text-sm mb-2">
      Pendientes
    </p>

    <h2 className="text-4xl font-black text-blue-400">
      {pendingAppointments.length}
    </h2>
  </div>

  {/* FINALIZADAS */}
  <div className="bg-[#111111] border border-green-500/10 rounded-3xl p-6">
    <p className="text-gray-400 text-sm mb-2">
      Finalizadas
    </p>

    <h2 className="text-4xl font-black text-green-400">
      {
        completedAppointments.length
      }
    </h2>
  </div>

 
 {/* INGRESOS */}
{/* INGRESOS */}
<div className="
  bg-[#111111]
  border
  border-yellow-500/20
  rounded-3xl
  p-6
">

  <div className="
    flex
    items-center
    justify-between
    mb-4
  ">

    <p className="
      text-gray-400
      text-sm
    ">
      Ingresos
    </p>

    <select
      value={revenueMode}
      onChange={(e) =>
        setRevenueMode(
          e.target.value as
            'today' |
            'month'
        )
      }
      className="
        bg-black
        border
        border-zinc-700
        rounded-lg
        px-2
        py-1
        text-xs
        text-white
      "
    >
      <option value="today">
        Hoy
      </option>

      <option value="month">
        Mensual
      </option>
    </select>

  </div>

  <div className="
    flex
    items-end
    gap-1
  ">

    <span className="
      text-sm
      text-yellow-400
      font-bold
      mb-1
    ">
      RD$
    </span>

    <span className="
      text-2xl
      sm:text-3xl
      md:text-4xl
      font-black
      text-yellow-400
      leading-none
    ">
      {totalRevenue.toLocaleString()}
    </span>

  </div>

</div>

  {/* HOY */}
<div className="
  bg-[#111111]
  border
  border-purple-500/20
  rounded-3xl
  p-6
">
  <p className="
    text-gray-400
    text-sm
    mb-2
  ">
    Hoy
  </p>

  <h2 className="
    text-4xl
    font-black
    text-purple-400
  ">
    {todayAppointments.length}
  </h2>
</div>

{/* EN PROGRESO */}
<div className="
  bg-[#111111]
  border
  border-blue-500/20
  rounded-3xl
  p-6
">
  <p className="
    text-gray-400
    text-sm
    mb-2
  ">
    En progreso
  </p>

  <h2 className="
    text-4xl
    font-black
    text-blue-400
  ">
    {inProgressCount}
  </h2>
</div>

</div>

<div className="flex flex-col md:flex-row gap-4">

  {/* SEARCH */}
  <input
    type="text"
    placeholder="Buscar cliente..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    className="
      flex-1
      bg-[#111111]
      border
      border-yellow-500/10
      rounded-2xl
      px-5
      py-4
      outline-none
      focus:border-yellow-400/30
    "
  />

  {/* STATUS */}
  <select
    value={statusFilter}
    onChange={(e) =>
      setStatusFilter(
        e.target.value
      )
    }
    className="
      bg-[#111111]
      border
      border-yellow-500/10
      rounded-2xl
      px-5
      py-4
      outline-none
      focus:border-yellow-400/30
    "
  >
    <option>
      Todos
    </option>

    <option>
      Confirmada
    </option>

    <option>
      Finalizada
    </option>
  </select>

<input
  type="date"
  value={dateFilter}
  onChange={(e) =>
    setDateFilter(
      e.target.value
    )
  }
  className="
    bg-[#111111]
    border
    border-yellow-500/10
    rounded-2xl
    px-5
    py-4
    outline-none
    focus:border-yellow-400/30
  "
/>

</div>



{filteredAppointments.length === 0 && (
  <div className="
    bg-[#111111]
    border
    border-yellow-500/10
    rounded-3xl
    p-10
    text-center
    text-zinc-500
  ">
    No hay citas para mostrar
  </div>
)}

{inProgressList.length > 0 && (

  <div className="mb-8">

    <h2 className="
      text-2xl
      font-black
      text-blue-400
      mb-4
    ">
      🔵 En progreso
    </h2>

    <div className="space-y-4">

      {inProgressList.map(
        (appointment) => (

          <div
            key={appointment.id}
            className="
              bg-[#111111]
              border
              border-blue-500/30
              rounded-3xl
              p-5
              shadow-[0_0_20px_rgba(59,130,246,0.15)]
            "
          >

            <div className="
              flex
              items-center
              justify-between
            ">

              <div>

                <h3 className="
                  text-xl
                  font-black
                ">
                  {appointment.customer_name}
                </h3>

                <p className="
                  text-zinc-500
                ">
                  {appointment.service_name}
                </p>

              </div>

              <span className="
                bg-blue-500
                text-white
                px-3
                py-1
                rounded-full
                text-xs
                font-bold
              ">
                EN PROGRESO
              </span>

            </div>

            {appointment.timer_end && (
  <LiveTimer
  timerEnd={
    appointment.timer_end
  }

  appointmentId={
    appointment.id
  }

  customerName={
    appointment.customer_name
  }

  onAutoComplete={
    onComplete
  }
/>
)}

            <button
              onClick={() =>
                onComplete(
                  appointment.id
                )
              }
              className="
                mt-4
                w-full
                bg-green-500
                hover:bg-green-400
                text-white
                py-3
                rounded-2xl
                font-bold
              "
            >
              Finalizar cita
            </button>

          </div>

        )
      )}

    </div>

  </div>

)}

      {pendingList.map(
        (appointment) => (
          <div
            key={appointment.id}
            className="
  bg-[#111111]
  border
  border-yellow-500/10
  rounded-3xl
  p-5
  transition-all
  duration-300
  hover:border-yellow-400/30
  hover:shadow-[0_0_25px_rgba(250,204,21,0.08)]
  hover:-translate-y-1
"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-black text-xl text-white">
                  {
                    appointment.customer_name
                  }
                </h3>

                <p className="text-zinc-500 text-sm mt-1">
                  {
                    appointment.phone
                  }
                </p>
              </div>

              <span
  className={`
    text-xs
    px-3
    py-1
    rounded-full
    font-bold

    ${
      appointment.status ===
      'Finalizada'
        ? 'bg-green-500 text-white'
        : 'bg-yellow-500 text-black'
    }
  `}
>
  {appointment.status}
</span>

            </div>

            <div className="space-y-3 text-sm text-zinc-300 mt-4">

  <div className="flex items-center justify-between">
    <span className="text-zinc-500">
      Servicio
    </span>

    <span className="font-semibold">
      {appointment.service_name}

    </span>
  </div>

  <div className="flex items-center justify-between">
    <span className="text-zinc-500">
      Fecha
    </span>

    <span className="font-semibold">
      {appointment.booking_date}
    </span>
  </div>

  <div className="flex items-center justify-between">
    <span className="text-zinc-500">
      Hora
    </span>

    <span className="font-semibold">
      {appointment.booking_hour}
    </span>
  </div>

  <div className="flex items-center justify-between">
    <span className="text-zinc-500">
      Token
    </span>

    <span className="font-bold text-yellow-400 tracking-widest">
      {appointment.appointment_token}
    </span>
  </div>

</div>

<button
  onClick={() =>
    onStart(
      appointment.id
    )
  }
  className="
    flex-1
    bg-blue-500
    hover:bg-blue-400
    text-white
    py-3
    rounded-2xl
    font-bold
    transition-all
  "
>
  Iniciar
</button>

            <div className="flex gap-3 mt-6">
          <button
  onClick={() =>
    onComplete(
      appointment.id
    )
  }
  className="
    flex-1
    bg-green-500
    hover:bg-green-400
    text-white
    py-3
    rounded-2xl
    font-bold
    transition-all
  "
>
  Completar
</button>

              <button
  onClick={() =>
    onDelete(
      appointment.id
    )
  }
  className="
    flex-1
    bg-red-500
    hover:bg-red-400
    text-white
    py-3
    rounded-2xl
    font-bold
    transition-all
  "
>
  Eliminar
</button>
            </div>
          </div>
        )
      )}

      {/* FINALIZADAS */}
{completedList.length > 0 && (
  <div className="space-y-4 pt-8">

    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-black text-green-400">
        Finalizadas
      </h2>

      <span className="text-zinc-500">
        {completedList.length} citas
      </span>
    </div>

    {completedList.map(
      (appointment) => (
        <div
          key={appointment.id}
          className="
            bg-[#111111]
            border
            border-green-500/10
            rounded-3xl
            p-5
            transition-all
            duration-300
          "
        >

          <div className="flex items-start justify-between mb-4">

            <div>
              <h3 className="font-black text-xl text-white">
                {appointment.customer_name}
              </h3>

              <p className="text-zinc-500 text-sm mt-1">
                {appointment.phone}
              </p>
            </div>

            <span className="
              text-xs
              px-3
              py-1
              rounded-full
              font-bold
              bg-green-500
              text-white
            ">
              {appointment.status}
            </span>

          </div>

          <div className="space-y-3 text-sm text-zinc-300 mt-4">

            <div className="flex items-center justify-between">
              <span className="text-zinc-500">
                Servicio
              </span>

              <span className="font-semibold">
                {appointment.service_name}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-500">
                Fecha
              </span>

              <span className="font-semibold">
                {appointment.booking_date}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-500">
                Hora
              </span>

              <span className="font-semibold">
                {appointment.booking_hour}
              </span>
            </div>

          </div>

        </div>
      )
    )}

  </div>
)}

</>
)}


{activeTab === 'blocks' && (
<>

<div className="grid md:grid-cols-2 gap-6">

  {/* BLOQUEAR DIA */}
  <div className="
    bg-[#111111]
    border
    border-yellow-500/10
    rounded-3xl
    p-6
  ">

    <h2 className="text-xl font-black text-yellow-400 mb-4">
      Bloquear día
    </h2>

    <input
      type="date"
      value={blockDate}
      onChange={(e) =>
        setBlockDate(
          e.target.value
        )
      }
      className="
        w-full
        bg-black
        border
        border-zinc-700
        rounded-2xl
        px-4
        py-4
        outline-none
        mb-4
      "
    />

    <button
      onClick={blockDay}
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
      Bloquear día
    </button>

  </div>

  {/* DIAS BLOQUEADOS */}
  <div className="
    bg-[#111111]
    border
    border-yellow-500/10
    rounded-3xl
    p-6
  ">

    <h2 className="
      text-xl
      font-black
      text-yellow-400
      mb-4
    ">
      Días bloqueados
    </h2>

    <div className="space-y-3">

      {blockedDaysList.length === 0 && (
        <p className="text-zinc-500">
          No hay días bloqueados
        </p>
      )}

      {blockedDaysList.map(
        (date) => (
          <div
            key={date}
            className="
              flex
              items-center
              justify-between
              bg-black
              border
              border-zinc-800
              rounded-2xl
              px-4
              py-4
            "
          >

            <p className="font-bold">
              {date}
            </p>

            <button
              onClick={() =>
                unblockDay(date)
              }
              className="
                bg-red-500
                hover:bg-red-400
                text-white
                px-4
                py-2
                rounded-xl
                font-bold
              "
            >
              Desbloquear
            </button>

          </div>
        )
      )}

    </div>

  </div>

  {/* BLOQUEAR HORA */}
  <div className="
    bg-[#111111]
    border
    border-yellow-500/10
    rounded-3xl
    p-6
  ">

    <h2 className="text-xl font-black text-yellow-400 mb-4">
      Bloquear hora
    </h2>

    <div className="space-y-4">

      <input
        type="date"
        value={blockHourDate}
        onChange={(e) =>
          setBlockHourDate(
            e.target.value
          )
        }
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
      />

      <select
        value={blockHour}
        onChange={(e) =>
          setBlockHour(
            e.target.value
          )
        }
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
      >

        <option value="">
          Selecciona hora
        </option>

        {[
          '8:00 AM',
          '9:00 AM',
          '10:00 AM',
          '11:00 AM',
          '2:00 PM',
          '3:00 PM',
          '4:00 PM',
          '5:00 PM',
          '6:00 PM',
          '7:00 PM',
          '8:00 PM',
          '9:00 PM',
        ].map((hour) => (
          <option
            key={hour}
            value={hour}
          >
            {hour}
          </option>
        ))}

      </select>

      <button
        onClick={
          blockHourAction
        }
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
        Bloquear hora
      </button>

    </div>

  </div>

  {/* HORAS BLOQUEADAS */}
  <div className="
    bg-[#111111]
    border
    border-yellow-500/10
    rounded-3xl
    p-6
  ">

    <h2 className="
      text-xl
      font-black
      text-yellow-400
      mb-4
    ">
      Horas bloqueadas
    </h2>

    <div className="space-y-3">

      {blockedHoursList.length === 0 && (
        <p className="text-zinc-500">
          No hay horas bloqueadas
        </p>
      )}

      {blockedHoursList.map(
        (item) => (
          <div
            key={item.id}
            className="
              flex
              items-center
              justify-between
              bg-black
              border
              border-zinc-800
              rounded-2xl
              px-4
              py-4
            "
          >

            <div>
              <p className="font-bold">
                {item.booking_hour}
              </p>

              <p className="text-sm text-zinc-500">
                {item.booking_date}
              </p>
            </div>

            <button
              onClick={() =>
                unblockHour(
                  item.id
                )
              }
              className="
                bg-red-500
                hover:bg-red-400
                text-white
                px-4
                py-2
                rounded-xl
                font-bold
              "
            >
              Desbloquear
            </button>

          </div>
        )
      )}

    </div>

  </div>

</div>

</>
)}




      </div>
  </>
);
};
