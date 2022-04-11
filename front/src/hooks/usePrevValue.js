import { useRef, useEffect } from 'react';

export const usePrevValue = (value) => {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};
