import dayjs from 'dayjs';

export const dateNormalize = (dateString = '') => {
  const mDate = dateString?.split('.') || [];
  const date = dayjs([ mDate?.[2], mDate?.[1], mDate?.[0] ]).format();
  return date === 'Invalid Date' ? dayjs().format() : date;
};

export default dateNormalize;
