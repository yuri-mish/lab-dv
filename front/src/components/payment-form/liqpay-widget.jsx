import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from '@apollo/client';
import { loader } from 'graphql.macro';
import styles from './payment-form.module.scss';
const getPaymentData = loader('./getPaymentData.gql');

export const LiqpayWidget = (props) => {
  const [ payParams, setPayParams ] = useState(null);
  const containerRef = useRef();
  const gqlClient = useApolloClient();

  useEffect(() => {
    gqlClient.query({
      query: getPaymentData,
      variables: {
        type: 'LiqPay',
        organization: props.paymentData.organization,
        options: {
          amount: props.paymentData.amount,
          description: props.paymentData.description,
          orderId: `${props.paymentData.id}_${new Date().getTime()}`,
          type: 'form_params',
          data: { ...props.paymentData.data, proj: props.paymentData.proj },
        },
      },
    })
      .then((res) => {
        const formData = res.data.paymentData;
        setPayParams(formData);
      })
      .catch(() => props.onError());
  }, [ props.paymentData ]);

  useEffect(() => {
    if (payParams) {
      containerRef.current.replaceChildren();
      const widget = document.createElement('div');
      widget.id = 'liqpay_checkout';
      containerRef.current.appendChild(widget);

      window.LiqPayCheckoutCallback = () => {
        window.LiqPayCheckout.init({
          data: payParams.data,
          signature: payParams.signature,
          embedTo: '#liqpay_checkout',
          language: 'uk',
          mode: 'embed',
        });
      };

      const script = document.createElement('script');
      script.src = 'https://static.liqpay.ua/libjs/checkout.js';
      script.async = true;

      containerRef.current.appendChild(script);
    }
  }, [ payParams ]);

  return (
    <div ref={containerRef} className={styles.liqpayWidget}/>
  );
};

LiqpayWidget.propTypes = {
  paymentData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    description: PropTypes.oneOfType(
      [ PropTypes.string, PropTypes.element ],
    ).isRequired,
    proj: PropTypes.string.isRequired,
    data: PropTypes.object,
    organization: PropTypes.string,
  }),
  onError: PropTypes.func,
};
