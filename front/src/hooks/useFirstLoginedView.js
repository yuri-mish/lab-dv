import { LOGIN_TIMESTAMP_KEY } from 'app-constants';
import { useEffect, useMemo } from 'react';

const LS_KEY_PREFIX = 'last_view_';

const getValue = (key) => (
  window.localStorage.getItem(LS_KEY_PREFIX + key)
);

const updateValue = (key, value) => {
  window.localStorage.setItem(LS_KEY_PREFIX + key, value);
};

export const useFirstLoginedView = (key, minStay = 0) => {
  const lastView = useMemo(() => getValue(key), []);
  const lastLogin = useMemo(() => localStorage.getItem(LOGIN_TIMESTAMP_KEY));
  useEffect(() => {
    const timer = setTimeout(() => {
      if (lastLogin !== lastView) {
        updateValue(key, lastLogin);
      }
    }, minStay);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return lastLogin !== lastView;
};
