export const openDoc = (url, winParams = '') => {
  let windowObjectReference = null;
  windowObjectReference = window.open(
    url,
    'printwin',
    winParams,
  );
  windowObjectReference.focus();
};
