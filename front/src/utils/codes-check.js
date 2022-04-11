export const codesCheck = ({ data = {}, fildsToCheck = [] }) => {
  let codes_mismatch = '';

  fildsToCheck?.forEach((element) => {
    element?.forEach((item) => {
      data[item?.field]?.codes?.forEach(
        (codes) => (codes_mismatch += `${codes}; `),
      );
    });
  });

  return codes_mismatch?.replaceAll('Непередбачені кодами несправності', 'НКН');
};
