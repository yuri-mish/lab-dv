// import './style.scss';
import PropTypes from 'prop-types';
import styles from '../styles/style.module.scss';

export const TextLine = ({ text = '', ...props }) => (
  <div className={styles.text_line_wrap} {...props}>
    {text && <span>{text}</span>}
  </div>
);

TextLine.propTypes = {
  text: PropTypes.string,
};
