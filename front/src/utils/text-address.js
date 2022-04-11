export const textAddress = ({ data = {} }) => {
  let address = '';
  address += data?.region ?
      `${data?.region
        ?.replace('область', 'обл.')?.replace('місто', 'м.')}, ` : '';
  address += data?.city ?
      `${data?.city?.replace('місто', 'м.')}, ` : '';
  address += data?.street ?
      `вул. ${data?.street?.replace('вулиця', '')?.replace('вул.', '')}, ` : '';
  address += data?.house ?
      `${data?.house?.toLocaleLowerCase()}, ` : '';

  return address?.slice(0, -2) || '';
};
