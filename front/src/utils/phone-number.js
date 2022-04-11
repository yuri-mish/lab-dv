export const normalizePhoneNumber = (phoneNumber) => (
  phoneNumber.replace(/\D/g, '')
);

export const validatePhoneNumber = (phoneNumber) => (
  /^\d{12}$/.test(phoneNumber)
);
