// [Cyrillic]: latin
const charLookup = {
  А: 'A',
  В: 'B',
  Е: 'E',
  І: 'I',
  К: 'K',
  М: 'M',
  Н: 'H',
  О: 'O',
  Р: 'P',
  С: 'C',
  Т: 'T',
  Х: 'X',
};

const filterRegex = /[^А-ЩЁЭЪЫЬЮЯҐЄІЇа-щёэъыьюяґєіїa-zA-Z0-9]/g;

export const normalizeCarNumber = (number) => (
  // filter only letters and numbers
  [ ...String(number.toUpperCase()).replace(filterRegex, '') ]
    // map cyrillic letters to latin
    .map((char) => charLookup[char] ?? char)
    // convert letters to uppercase
    .join('')
);

