import PropTypes from 'prop-types';
import { TextBox, Button } from 'devextreme-react';
import notify from 'devextreme/ui/notify';

import styles from './styles.module.scss';

export const Field = (props) => {
  const { text = '', tValue = '', tWidth = '', type = '' } = props;
  const handleCopy = () => {
    try {
      navigator?.clipboard?.writeText(tValue);
      notify('Скопійовано', 'success', 800);
    } catch (error) {
      notify('Не вдалось скопіювати', 'error', 800);
    }
  };
  return (<div className={styles?.field}>
    {text !== null && <span>{text}</span>}
    {tValue !== null && (<>
      {type === 'multiLine' ?
        <p style={{ width: tWidth ? tWidth : '300px' }}>
          {tValue}
        </p> :
        <TextBox
          value={tValue}
          stylingMode={'outlined'}
          width={tWidth ? tWidth : '320px'}
          readOnly={true}
        />
      }
      <Button icon="copy" onClick={handleCopy} />
    </>)}
    {props?.children}
  </div>);
};

Field.propTypes = {
  text: PropTypes.string,
  tValue: PropTypes.string,
  tWidth: PropTypes.string,
  type: PropTypes.string,
  children: PropTypes.any,
};
export default Field;
