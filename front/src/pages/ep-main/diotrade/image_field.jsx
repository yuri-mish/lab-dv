import PropTypes from 'prop-types';
import { TextBox, Button } from 'devextreme-react';
import notify from 'devextreme/ui/notify';

import styles from './styles.module.scss';

export const ImageField = (props) => {
  const { path = '', text = '' } = props;
  const handleCopy = () => {
    try {
      navigator?.clipboard?.writeText(path);
      notify('Скопійовано', 'success', 800);
    } catch (error) {
      notify('Не вдалось скопіювати', 'error', 800);
    }
  };
  return (<div className={styles?.image_field}>
    {path &&
      <>
        {text && <span>{text}:</span>}
        <div>
          <a href={path} target="_blank" rel="noopener noreferrer" >
            <img src={path} />
          </a>
          <a href={path} target="_blank" rel="noopener noreferrer"
            download>
            <Button icon="download" />
          </a>
        </div>
        <div>
          <TextBox
            value={path}
            stylingMode={'outlined'}
            width={'790px'}
            readOnly={true}
          />
          <Button icon="copy" onClick={handleCopy} />
        </div>
      </>}

  </div>);
};

ImageField.propTypes = {
  path: PropTypes.string,
  text: PropTypes.string,
};
export default ImageField;
