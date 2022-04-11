'use strict';
const vm = require('vm');


// [Cyrillic]: latin
const charLookup = {
  ['А']: 'A',
  ['В']: 'B',
  ['Е']: 'E',
  ['І']: 'I',
  ['К']: 'K',
  ['М']: 'M',
  ['Н']: 'H',
  ['О']: 'O',
  ['Р']: 'P',
  ['С']: 'C',
  ['Т']: 'T',
  ['Х']: 'X',
};

const filterRegex = /[^А-ЩЁЭЪЫЬЮЯҐЄІЇа-щёэъыьюяґєіїa-zA-Z0-9]/g;

const normalizeCarNumber = (number) => (
  // filter only letters and numbers
  [ ...String(number).replace(filterRegex, '') ]
    // map cyrillic letters to latin
    .map((char) => charLookup[char] ?? char)
    // convert letters to uppercase
    .join('').toUpperCase()
);


const interpolate = (template, params) => {
  const names = Object.keys(params);
  const vals = Object.values(params);
  const context = { names, template, func: null };
  vm.createContext(context);
  vm.runInContext(
    'func = new Function(...names, `return \\`${template}\\`;`);',
    context
  );

  return context.func(...vals);
};

const dateFromISO = (dateISO) => {
  const date = new Date(dateISO);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let dt = date.getDate();

  if (dt < 10) {
    dt = `0${ dt}`;
  }
  if (month < 10) {
    month = `0${ month}`;
  }
  return `${dt}.${month}.${year}`;
};

const dontIndent = (str) => (
  (str || '').replace(/(\n)\s+/g, '$1')
);

const formatPhoneNumber = (normalizedPhone) => (
  `+${normalizedPhone}`
);

const splitId = (id) => {
  const [ className, ref ] = id?.split('|') ?? [];
  return { className, ref };
};

module.exports = {
  interpolate,
  normalizeCarNumber,
  dateFromISO,
  dontIndent,
  formatPhoneNumber,
  splitId,
};
