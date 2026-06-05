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

      try {
        
      const now =
        Date.now();

      if (!timerEnd) {

  console.error(
    'timerEnd vacío'
  );

  return;
}

      const parsedDate =
  new Date(timerEnd);

if (
  isNaN(
    parsedDate.getTime()
  )
) {

  console.error(
    'Fecha inválida:',
    timerEnd
  );

  return;
}

   const end =
  new Date(timerEnd).getTime();

      const distance =
        end - now;

        if (
  Number.isNaN(distance)
) {

  console.error(
    'Distance inválida',
    timerEnd
  );

  return;
}

     const secondsLeft =
  Math.floor(
    distance / 1000
  );

if (
  secondsLeft <= 300 &&
  secondsLeft > 299 &&
  !warnedFiveMinutes.current
) {
  toast(
    '⚠️ Quedan 5 minutos',
  
  );
  
//const audio =
    //new Audio(
      //'/sounds/5-minutos.mp3'
    //);

  //audio.play();


 warnedFiveMinutes.current =
  true;
}

if (
  secondsLeft <= 60 &&
  secondsLeft > 59 &&
  !warnedOneMinute.current
) {
  toast(
    '⏰ Queda 1 minuto'
  );

  //const audio =
    //new Audio(
      //'/sounds/alarm.mp3'
    //);


  warnedOneMinute.current =
  true;
}

if (
  distance <= 0 &&
  !finishedRef.current
) {

  finishedRef.current =
    true;

      const hours =
        Math.floor(
          distance /
          (1000 * 60 * 60)
        );

      const minutes =
        Math.floor(
          (
            distance %
            (1000 * 60 * 60)
          ) /
          (1000 * 60)
        );

      const seconds =
        Math.floor(
          (
            distance %
            (1000 * 60)
          ) / 1000
        );
  
if (
  Number.isNaN(hours) ||
  Number.isNaN(minutes) ||
  Number.isNaN(seconds)
) {

  console.error(
    'Tiempo inválido'
  );

  return;
}
  
  setTimeLeft(
    '00:00:00'
  );

  toast(
    '⏰ Servicio terminado'
  );


  //const audio =
    //new Audio(
      //'/sounds/1-minuto.mp3'
    //);

  //audio.play();

  setTimeout(() => {

    toast.success(
      'Servicio finalizado automáticamente'
    );

    onAutoComplete(
      appointmentId
    );

  }, 5000);

  return;
}

      setTimeLeft(
        `${String(
          hours
        ).padStart(
          2,
          '0'
        )}:${String(
          minutes
        ).padStart(
          2,
          '0'
        )}:${String(
          seconds
        ).padStart(
          2,
          '0'
        )}`
      );

} catch (error) {

  console.error(
    'LIVE TIMER ERROR',
    error
  );

}
        
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
