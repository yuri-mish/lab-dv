// import './style.scss';
import PropTypes from 'prop-types';
import styles from '../styles/style.module.scss';

export const ColumnField = ({ text = '', ...props }) => (
  <div className={styles.column_field} {...props}>
    {text && <span>{text}</span>}
    {props.children}
  </div>
);

ColumnField.propTypes = {
  text: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node, PropTypes.element,
  ]).isRequired,
};
