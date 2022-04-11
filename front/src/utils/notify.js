import notify from 'devextreme/ui/notify';

export const showError = (message) => {
  notify({ message, position: { at: 'center' } }, 'error', 5000);
};
export const showSuccess = (message) => {
  notify({ message, position: { at: 'center' } }, 'success', 5000);
};

