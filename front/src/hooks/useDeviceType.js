import devices from 'devextreme/core/devices';
import { useMemo } from 'react';

export const useDeviceType = () => useMemo(() => {
  const deviceInfo = devices.current();
  return {
    isDesktop: deviceInfo?.generic,
    isPhone: deviceInfo?.phone,
    isTablet: deviceInfo?.tablet,
  };
}, []);
