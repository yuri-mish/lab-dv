import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { loader } from 'graphql.macro';
import { useApolloClient } from '@apollo/client';
import { showError } from 'utils/notify.js';
import { messages } from 'messages';
import { normalizeCarNumber } from 'utils/normalize-car-number';
import { TextBox, Button } from 'devextreme-react';
import styles from './styles.module.scss';

const getCar = loader('./gql/getCar.graphql');

export const CarNumSearch = (props) => {
  const { value, onSerch = () => {} } = props;
  const gqlClient = useApolloClient();
  const [ icon, setIcon ] = useState('search');
  const [ textShow, setTextShow ] = useState(false);
  const handleSearch = async () => {
    setIcon('refresh');
    const normalizedNumber = normalizeCarNumber(value || '');
    let carData = null;
    setTextShow(false);
    //bm4670ck
    if (value) {
      await gqlClient
        .query({
          query: getCar,
          variables: { ref: normalizedNumber },
        })
        .then((response) => {
          const car = response?.data?.car?.[0];
          if (car) {
            carData = car;
          }
        })
        .catch(() => {
          showError(messages?.DATA_LOAD_FAILED);
        });
    }
    onSerch(carData);
    if (!carData) {
      setTextShow(true);
      setTimeout(() => {
        setTextShow(false);
      }, 8000);
    }
    setIcon('search');
  };
  return (
    <div className={styles?.container}>
      {textShow && <div className={styles?.no_data}>
        {'(даних не знайдено)'}
      </div>}
      <TextBox
        {...props} height={props?.height || '32px'}
      >{props.children}</TextBox>
      <Button
        className={`${styles?.button} ${icon === 'refresh' ?
          styles?.rotating : ''}`}
        stylingMode={'outlined'}
        icon={icon}
        onClick={handleSearch}
        text=''
        height={props?.height || '32px'}
      />
    </div>
  );
};
CarNumSearch.propTypes = {
  children: PropTypes.any,
  value: PropTypes.string,
  height: PropTypes.string,
  onSerch: PropTypes.func,
};

export default CarNumSearch;
