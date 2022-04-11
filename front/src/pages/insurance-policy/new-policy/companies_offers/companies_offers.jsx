import React, {
// useRef
} from 'react';
import PropTypes from 'prop-types';
//components
// import { FormField } from 'components/form-field/form-field';
import { TextLine } from 'pages/ep-main/components/text-line';

import { companies_offers } from '../api/mockData';
import { CompanieOfferItem } from './companie_offer_item';
import styles from './style.module.scss';

export const CompaniesOffers = (props) => {
  const {
    setStep = () => {},
    tariffs_index = 0,
    privilege = 'without',
  } = props;
  console.log(setStep, privilege);
  return (<>
    <TextLine text="Список предложений" />
    <div className={styles?.container}>
      {companies_offers?.map((offer, index) => (
        <CompanieOfferItem key={index} {...offer}
          tariffs_index={tariffs_index} />),
      )}
    </div>
    <TextLine />
  </>);
};

CompaniesOffers.propTypes = {
  setStep: PropTypes.func,
  privilege: PropTypes.string,
  tariffs_index: PropTypes.number,
};

export default CompaniesOffers;
