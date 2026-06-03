export const canModifyAppointment = (
  bookingDate: string,
  bookingHour: string
) => {
  const convertHour = (
    value: string
  ) => {
    const [time, modifier] =
      value.split(' ');

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

    return {
      hours: parsedHours,

      minutes:
        parseInt(minutes),
    };
  };

  const parsed =
    convertHour(
      bookingHour
    );

  const [year, month, day] =
    bookingDate
      .split('-')
      .map(Number);

  const appointmentDate =
    new Date(
      year,
      month - 1,
      day,
      parsed.hours,
      parsed.minutes,
      0,
      0
    );

  const now = new Date();

  const difference =
    appointmentDate.getTime() -
    now.getTime();

  const hoursDifference =
    difference /
    (1000 * 60 * 60);

  return hoursDifference >= 2;
};