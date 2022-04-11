export const normList = {
  M1: 1.6,
  М1G: 1.6,
  N1: 1.6,
  N1G: 1.6,
  O1: 1.6,
  M2: 2,
  М2G: 2,
  M3: 2,
  M3G: 2,
  N2: 1,
  N2G: 1,
  N3: 1,
  N3G: 1,
  O3: 1,
  O4: 1,
};
export const tyreTreadIsLessNorm = ({ category_KTZ = '', val = undefined }) => {
  const numVal = +val?.replace(',', '.') || undefined;
  return numVal < normList?.[category_KTZ];
};
