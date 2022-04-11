export const checkCanSend = ({ form = {}, defaultFields = [] }) => {
  const existBlankField = !!defaultFields.find(
    ({ field }) => !form[field]?.general,
  );

  return !existBlankField;
};

export const extractCodes = (form) => {
  let codes = [];

  Object.keys(form).forEach((item) => {
    if (form[item]?.code) codes = [ ...codes, form[item]?.code ];
  });

  return codes;
};

export const calculateKM1Average = (km1) => {
  if (!km1 || !km1?.first || !km1?.second || !km1?.third || !km1?.fourth) {
    return '';
  }
  const res = (
    +km1?.first?.replace(',', '.') +
    +km1?.second?.replace(',', '.') +
    +km1?.third?.replace(',', '.') +
    +km1?.fourth?.replace(',', '.')
  ) / 4;
  return Math.round(res * 1000) / 1000;
};
export const calculateKM1Difference = (km1) => {
  if (!km1 || !km1?.first || !km1?.second || !km1?.third || !km1?.fourth) {
    return '';
  }
  const res = [
    +km1?.first?.replace(',', '.'),
    +km1?.second?.replace(',', '.'),
    +km1?.third?.replace(',', '.'),
    +km1?.fourth?.replace(',', '.'),
  ];
  const min = Math.min(...res);
  const max = Math.max(...res);
  return Math.round((max - min) * 1000) / 1000;
};
export const calculateLightUnits = (val) => {
  let res = '';
  res = val * 625 || '';
  return res;
};
export const onValueChanged = ({ e, setForm, field }) => {
  const isArrayVal = Array.isArray(e?.value);
  setForm((prevState) => ({
    ...prevState,
    [field]: isArrayVal ? e?.value : e?.value?.replace(',', '.'),
  }));
};

export const onObjValueChanged = ({ e, setForm, field, subfield }) => {
  const isArrayVal = Array.isArray(e?.value);
  setForm((prevState) => {
    const prevField = prevState[field];
    return {
      ...prevState,
      [field]: {
        ...prevField,
        [subfield]: isArrayVal ? e?.value : e?.value?.replace(',', '.'),
      },
    };
  });
};

export const onObjRBChanged = ({ e, setForm, field }) => {
  setForm((prevState) => {
    const prevField = prevState[field];

    return {
      ...prevState,
      [field]: {
        ...prevField,
        code: undefined,
        general: e.value,
      },
    };
  });
};
