'use client';

import {
  useEffect,
  useState,
  useRef,
} from 'react';

import { toast } from 'sonner';

const sendNotification =
(
  title: string,
  body: string
) => {

  if (
    Notification.permission ===
    'granted'
  ) {

    new Notification(
      title,
      {
        body,
        icon:
          '/favicon.ico',
      }
    );
  }
};


type Props = {
  timerEnd: string;

  appointmentId: string;

  customerName: string;

  onAutoComplete: (
    id: string
  ) => void;
};

export const LiveTimer = ({
  timerEnd,
  appointmentId,
  customerName,
  onAutoComplete,
}: Props) => {

  const [
    timeLeft,
    setTimeLeft,
  ] = useState('');

const warnedFiveMinutes =
  useRef(false);

const warnedOneMinute =
  useRef(false);

const finishedRef =
  useRef(false);

  useEffect(() => {
console.log(
  'LIVE TIMER MOUNT',
  timerEnd
);

    
    if (
  Notification.permission ===
  'default'
) {

  //Notification.requestPermission();
}

 const interval =
  setInterval(() => {

    setTimeLeft(
      'TEST'
    );

  }, 1000);
  return () =>
    clearInterval(
      interval
    );

}, [timerEnd]);

  return (
    <div
      className={`
        mt-4
        rounded-2xl
        p-4
        text-center
        border

        ${
          timeLeft ===
          '00:00:00'

            ? `
              bg-red-500/10
              border-red-500
            `

            : `
              bg-blue-500/10
              border-blue-500/20
            `
        }
      `}
    >

      <p
        className={`
          text-sm
          mb-1

          ${
            timeLeft ===
            '00:00:00'

              ? 'text-red-300'

              : 'text-blue-300'
          }
        `}
      >
        {
          timeLeft ===
          '00:00:00'

            ? 'TIEMPO TERMINADO'

            : 'Tiempo restante'
        }
      </p>

      <h2
        className={`
          text-2xl md:text-3xl
          font-black
          tracking-widest

          ${
            timeLeft ===
            '00:00:00'

              ? 'text-red-400'

              : 'text-blue-400'
          }
        `}
      >
        {timeLeft}
      </h2>

    </div>
  );
};
