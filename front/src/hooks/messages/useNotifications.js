import { useContext, useEffect, useState } from 'react';
import { NotificationContext } from 'contexts/notifications';

export const useMultipleNotifications = (fields = [], skip = false) => {
  const notifications = useContext(NotificationContext);
  const [ values, setValues ] = useState(notifications.getValues(fields));

  useEffect(() => {
    let unsubscribe;
    if (!skip) {
      unsubscribe = notifications.subscribeValues(fields, (val) => {
        setValues(val);
      });
    }

    return () => {
      unsubscribe?.();
    };
  }, [ ...fields, skip ]);

  return values;
};

export const useNotification = (field, skip = false) => {
  const notifications = useContext(NotificationContext);
  const [ value, setValue ] = useState(notifications.getValue(field));

  useEffect(() => {
    let unsubscribe;
    if (!skip) {
      unsubscribe = notifications.subscribeValue(field, (val) => {
        setValue(val);
      });
    }

    return () => {
      unsubscribe?.();
    };
  }, [ field, skip ]);

  return value;
};
