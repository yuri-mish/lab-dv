import React from 'react';
import PropTypes from 'prop-types';
//components
import { Button } from 'devextreme-react/button';

import styles from './style.module.scss';

export const CompanieOfferItem = (props) => {
  const {
    image = '',
    name = '',
    tariffs = null,
    description = '',
    tariffs_index = 0,
  } = props;
  const handleClick = () => {
    console.log(`data "${name}":`, props);
  };
  return (<>
    <div className={styles?.item}>
      <div>
        <img src={image?.path} />
        <div>{name}</div>
        <div>
          Франшіза: {tariffs[tariffs_index]?.franchise}
        </div>
        <div>
          Сума: {tariffs[tariffs_index]?.price}
        </div>
        <div dangerouslySetInnerHTML={ { __html: description } } ></div>
      </div>
      <Button onClick={handleClick} text = "bay"/>
    </div>
  </>);
};

CompanieOfferItem.propTypes = {
  setStep: PropTypes.func,
  image: PropTypes.any,
  name: PropTypes.any,
  tariffs: PropTypes.any,
  price: PropTypes.any,
  description: PropTypes.any,
  tariffs_index: PropTypes.number,
};

export default CompanieOfferItem;
