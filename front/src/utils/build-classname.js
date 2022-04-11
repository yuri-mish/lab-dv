export const buildClass = (...args) => (
  args.filter((arg) => !!arg).join(' ')
);
