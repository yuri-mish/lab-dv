import { useEffect } from 'react';
import { useMessageVars, usePrevValue } from 'hooks';
import { differenceBy } from 'lodash';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';

export const NotificationManager = () => {
  const history = useHistory();
  const [ newOrderList ] = useMessageVars([ 'newOrdersList' ]);
  const prevNewOrderList = usePrevValue(newOrderList);

  useEffect(() => {
    const newOrders = differenceBy(newOrderList, prevNewOrderList, 'id');
    const newOrdersCount = newOrders.length;

    if (newOrdersCount > 0) {
      toast.info(
        <>
          <span className='otk-notification-main-msg'>
            {newOrdersCount === 1 ?
              'Нове замовлення' :
              `${newOrdersCount} нових замовлення.`
            }
          </span>
          <br />
          <span>Натисніть щоб подивитися.</span>
        </>,
        {
          onClick: () => {
            if (newOrdersCount === 1) {
              history.push(`/order/${newOrders[0]?.ref}`);
            } else {
              history.push('/orders?show_new=true');
            }
          },
          autoClose: true,
          hideProgressBar: true,
        },
      );
    }
  }, [ newOrderList ]);

  return null;
};
