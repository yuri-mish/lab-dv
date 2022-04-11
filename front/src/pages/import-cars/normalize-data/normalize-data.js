import dayjs from 'dayjs';
import { normalizeCarNumber } from 'utils/normalize-car-number';
import { dateNormalize } from './date-normalize';
import fuels from './fuel-normalize.json';

export const normalizeData = (data, addCarBrand = () => {}, brands = []) => {
  const newData = [];
  const brandsData = brands || [];
  data?.forEach(async (item) => {
    const normalizedNumber = normalizeCarNumber(item?.N_REG_NEW || '');
    if (normalizedNumber) {
      if (!brandsData.includes(item?.BRAND)) {
        await addCarBrand(item?.BRAND);
        brandsData.push(item?.BRAND);
      }
      newData.push({
        doc: {
          _id: `cat.cars|${normalizedNumber}`,
          class_name: 'cat.cars',
          ref: normalizedNumber,
          d_reg: dateNormalize(item?.D_REG || ''),
          car_brand: item?.BRAND || '',
          car_model: item?.MODEL || '',
          vin: item?.VIN || '',
          manufacture_date: item?.MAKE_YEAR ?
            dayjs(item?.MAKE_YEAR).format() : '',
          car_color: item?.COLOR?.toLowerCase() || '',
          fuel_type: fuels?.[item?.FUEL] || item?.FUEL || '',
          car_capacity: item?.CAPACITY || '',
          car_total_weight: item?.TOTAL_WEIGHT || '',
          car_own_weight: item?.OWN_WEIGHT || '',
          carrying: (item?.TOTAL_WEIGHT - item?.OWN_WEIGHT) || '',
          car_number: normalizedNumber,
        },
        // - D_REG - дата последней регистрации +
        // - Brand - марка авто +
        // - Model - модель авто +
        // - VIN - вин-код +
        // - Make Year - год выпуска +
        // - Color - цвет авто. +
        // - Fuel - тип топлива +
        // - CAPACITY - объем двигателя в см3 +
        // - TOTAL_WEIGHT - полный вес +
        // - OWN_WEIGHT - масса без груза +

      });
    }
  });
  return newData;
};
