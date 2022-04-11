import { useHistory } from 'react-router-dom';
import { useProj } from 'hooks';
import { Button } from 'devextreme-react';
import PropTypes from 'prop-types';

import styles from './epBtn.module.scss';

export const EpSimpleBtn = ({ _id, _key = 0, type_EP_ref }) => {
  const history = useHistory();
  const { proj } = useProj();
  // console.log('proj', proj);
  const type = proj?.find((p) => p.ref === type_EP_ref);
  // console.log('type', type);
  const getPath = (typeEP) => {
    let path = '';
    switch (typeEP) {
    case 'отк':
      path = '/ep';
      break;
    case 'тахо':
      path = '/ep-taho';
      break;
    default:
      break;
    }
    return path;
  };
  const handleClick = () => {
    const path = getPath(type?.predefined_name);
    (_id !== 'new' && path) &&
    history.push(`${path}/new?order_ref=${_id}&s=${_key}`);
  };
  return (
    <div className={styles?.wrapBtn}>
      <Button onClick={handleClick}
        stylingMode= "contained" text="створити ЕП" disabled={_id === 'new'}
        elementAttr={{ title:
          'створити новий Електроний протокол на основі цього замовлення' }}/>
    </div>
  );
};

EpSimpleBtn.propTypes = {
  _id: PropTypes.string,
  type_EP_ref: PropTypes.string,
  _key: PropTypes.number,
  items: PropTypes.array,
};

export default EpSimpleBtn;
