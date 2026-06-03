'use client';

import { toast } from 'sonner';

type Props = {
  appointmentToken: string;

  onFinish: () => void;
};

export const BookingSuccess = ({
  appointmentToken,
  onFinish,
}: Props) => {

  const copyAppointmentCode =
    async () => {

      await navigator.clipboard.writeText(
        appointmentToken
      );

      toast.success(
        'Código copiado correctamente'
      );
    };

  return (
    <div className="
      bg-[#111]
      border
      border-yellow-500/10
      rounded-3xl
      p-8
      text-center
      max-w-xl
      mx-auto
    ">

      <div className="text-6xl mb-6">
        ✅
      </div>

      <h2 className="
        text-3xl
        font-bold
        mb-4
      ">
        Cita confirmada
      </h2>

      <p className="
        text-gray-400
        mb-3
      ">
        Tu código de cita es:
      </p>

      <div className="
        bg-black
        border
        border-yellow-500/20
        rounded-2xl
        p-4
        mb-6
      ">
        <span className="
          text-yellow-400
          text-2xl
          font-bold
          tracking-widest
        ">
          {appointmentToken}
        </span>
      </div>

      <p className="
        text-zinc-400
        text-sm
        leading-relaxed
        mb-6
      ">
        Este código será utilizado para
        consultar, editar o confirmar
        tu cita posteriormente.

        <br />
        <br />

        Guárdalo en un lugar seguro.
      </p>

      <button
        onClick={
          copyAppointmentCode
        }
        className="
          w-full
          bg-zinc-800
          hover:bg-zinc-700
          text-white
          font-bold
          py-4
          rounded-2xl
          mb-4
          transition-all
        "
      >
        📋 Copiar código
      </button>

      <button
        onClick={onFinish}
        className="
          w-full
          bg-yellow-500
          hover:bg-yellow-400
          text-black
          font-bold
          py-4
          rounded-2xl
          transition-all
        "
      >
        Ir al inicio
      </button>

    </div>
  );
};