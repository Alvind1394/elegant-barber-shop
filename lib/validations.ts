export const validateDominicanPhone = (
  phone: string
) => {
  const regex =
    /^(1809|1829|1849)[0-9]{7}$/;

  return regex.test(phone);
};

export const validateRequired = (
  value: string
) => {
  return value.trim().length > 0;
};