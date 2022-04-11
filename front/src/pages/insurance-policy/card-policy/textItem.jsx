import PropTypes from 'prop-types';
import styles from '../styles/style.module.scss';
export const TextItem = ({ text = '', data = '' }) => (
  <div className={styles?.text_item_wrap}>
    <span>{text}:</span>
    <span>{data}</span>
  </div>
);

TextItem.propTypes = {
  data: PropTypes.string,
  text: PropTypes.string,
};

export default TextItem;

