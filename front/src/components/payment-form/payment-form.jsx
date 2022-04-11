import { List, Popup, Button, ScrollView } from 'devextreme-react';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import styles from './payment-form.module.scss';
import { showError } from 'utils/notify';
import { messages } from 'messages';
import { LiqpayWidget } from './liqpay-widget';
import { ToolbarItem } from 'devextreme-react/popup';

const paymentTypes = [
  { id: 'checkout', name: 'Liqpay форма', requires: 'LiqPay' },
  { id: 'test', name: 'Тест', requires: 'testSys' },
];

const ListItem = (data) => (
  <div className={styles.listItem} id={data.id}>
    <div>{data.name}</div>
    <div className={`dx-icon-info ${styles.infoIcon}`} title={data.name}></div>
  </div>
);

export const PaymentForm = (props) => {
  const [ state, setState ] = useState('SELECT');
  const types = paymentTypes.filter((type) => (
    (props.availableMethods ?? []).includes(type.requires)
  ));
  const defaultType = types.length === 1 ? types[0].id : null;

  const [ selectedMethod, setSelectedMethod ] = useState();

  useEffect(() => {
    if (props.visible && !selectedMethod) {
      setSelectedMethod(defaultType);
    }
  }, [ props.visible ]);

  const handleError = () => {
    showError(messages.PAYMENT_FAILED);
    setState('SELECT');
  };

  const innerComponent = useMemo(() => {
    let innerComponent;
    if (selectedMethod === 'checkout') {
      innerComponent = <LiqpayWidget
        paymentData={props.paymentData}
        onError={handleError}
      />;
    }
    return innerComponent;
  }, [ selectedMethod ]);

  return (
    <Popup
      className={styles.popup}
      visible={props.visible && !!props.paymentData}
      onHiding={props.onClose}
      onHidden={() => setState('SELECT')}
      dragEnabled
      closeOnOutsideClick={state === 'SELECT'}
      showCloseButton
      showTitle
      title={state === 'SELECT' ? 'Вибір методу оплати' : ''}
      width='min-content'
      maxWidth='700px'
      height='auto'
      maxHeight='100%'
    >
      <ToolbarItem
        widget='dxButton'
        toolbar='top'
        location='before'
        visible={state !== 'SELECT'}
        options={{
          icon: 'chevronleft',
          focusStateEnabled: false,
          text: 'Назад',
          onClick: () => setState('SELECT'),
        }}

      />

      {state === 'SELECT' ?
        <div>
          <div className={styles.description}>
            {props.description}
          </div>
          <div className={styles.amount}>
            {`${props.paymentData?.amount} UAH`}
          </div>
          <List
            className={styles.list}
            focusStateEnabled={false}
            itemRender={ListItem}
            items={types}
            keyExpr='id'
            displayExpr='name'
            selectionMode='single'
            defaultSelectedItemKeys={defaultType ? [ defaultType ] : null}
            onSelectionChanged={(e) => setSelectedMethod(e.addedItems?.[0]?.id)}
          />
          <div className={styles.buttonContainer}>
            <Button
              activeStateEnabled
              focusStateEnabled={false}
              text='вибрати'
              icon='check'
              disabled={!selectedMethod}
              onClick={() => setState('PAY')}
            />
          </div>
        </div> :
        <ScrollView showScrollbar='onHover'>
          <div className={styles.payContainer}>
            {innerComponent}
          </div>
        </ScrollView>
      }
    </Popup>
  );
};

PaymentForm.propTypes = {
  paymentData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    description: PropTypes.oneOfType(
      [ PropTypes.string, PropTypes.element ],
    ).isRequired,
    proj: PropTypes.string,
    data: PropTypes.object,
    organization: PropTypes.string,
  }),
  description: PropTypes.string,
  availableMethods: PropTypes.arrayOf(PropTypes.oneOf([ 'LiqPay', 'testSys' ])),
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};
