'use client';

import { useState } from 'react';

import { toast } from 'sonner';

import { ServiceType } from '@/types/service';

import { DayType } from '@/types/day';

type Props = {
  selectedService: ServiceType;

  selectedDate: DayType;

  selectedHour: string;

  onBack: () => void;

  onSubmit: (payload: {
    customerName: string;
    phone: string;
    note: string;
  }) => Promise<void>;
};

export const BookingForm = ({
  selectedService,
  selectedDate,
  selectedHour,
  onBack,
  onSubmit,
}: Props) => {
  const [customerName, setCustomerName] =
    useState('');

  const [phone, setPhone] =
    useState('');

  const [note, setNote] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async () => {
    if (!customerName.trim()) {
      toast.error(
        'Ingrese nombre'
      );

      return;
    }

    if (!phone.trim()) {
      toast.error(
        'Ingrese teléfono'
      );

      return;
    }

    try {
      setLoading(true);

      await onSubmit({
        customerName,
        phone,
        note,
      });
    } catch (error) {
      toast.error(
        'Error creando cita'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 text-sm text-yellow-400"
      >
        ← Volver
      </button>

      <div className="bg-[#111] border border-yellow-500/10 rounded-3xl p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            Confirmar cita
          </h2>

          <p className="text-gray-400">
            {selectedService.name}
          </p>

          <p className="text-gray-400">
            {selectedDate.day}{' '}
            {selectedDate.date}
          </p>

          <p className="text-yellow-400 font-bold">
            {selectedHour}
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            value={customerName}
            onChange={(e) =>
              setCustomerName(
                e.target.value
              )
            }
            className="w-full bg-black border border-gray-700 rounded-2xl px-4 py-4 outline-none"
          />

          <input
            type="text"
            placeholder="Teléfono"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
            className="w-full bg-black border border-gray-700 rounded-2xl px-4 py-4 outline-none"
          />

          <textarea
            placeholder="Nota (opcional)"
            value={note}
            onChange={(e) =>
              setNote(
                e.target.value
              )
            }
            className="w-full bg-black border border-gray-700 rounded-2xl px-4 py-4 outline-none h-32 resize-none"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-yellow-500 text-black font-bold py-4 rounded-2xl"
          >
            {loading
              ? 'Creando cita...'
              : 'Confirmar cita'}
          </button>
        </div>
      </div>
    </div>
  );
};