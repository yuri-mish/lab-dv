import { DATE_FORMAT } from 'app-constants';
import dayjs from 'dayjs';

export const useDate = () => {
  const today = dayjs().startOf('day');
  const formatDate = (value) => dayjs(value).format(DATE_FORMAT);

  return { today, formatDate };
};
