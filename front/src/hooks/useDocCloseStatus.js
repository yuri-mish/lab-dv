import dayjs from 'dayjs';

export const useDocCloseStatus = (date, periodInDays) => {
  const today = dayjs().startOf('day');

  return date ?
    dayjs(date).add(periodInDays, 'day') < today || today < date :
    false;
};
