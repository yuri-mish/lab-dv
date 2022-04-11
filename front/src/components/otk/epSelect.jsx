import { useHistory } from 'react-router-dom';
import { SelectBox } from 'devextreme-react';
import { FORM_STYLING_MODE } from 'app-constants';
import PropTypes from 'prop-types';

import styles from './epBtn.module.scss';

export const EpSelect = ({ _id, _key = 0, items = [] }) => {
  const history = useHistory();
  const handleItemClick = (e) => {
    (_id !== 'new' && e?.path) &&
    history.push(`${e?.path}/new?order_ref=${_id}&s=${_key}`);
  };
  return (
    <div className={styles?.wrapBtn}>
      <SelectBox
        width={'100%'}
        dataSource={items}
        displayExpr={'text'}
        onValueChange={handleItemClick}
        stylingMode={FORM_STYLING_MODE}
        placeholder={'Тип'}
      />
    </div>
  );
};

EpSelect.propTypes = {
  _id: PropTypes.string,
  _key: PropTypes.number,
  items: PropTypes.array,
};

export default EpSelect;
