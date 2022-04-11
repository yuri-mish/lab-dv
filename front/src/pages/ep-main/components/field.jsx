// import './style.scss';
import PropTypes from 'prop-types';
import styles from '../styles/style.module.scss';

export const Field = ({ text = '', ...props }) => (
  <div className={styles.field} {...props}>
    {text && <span>{text}</span>}
    {props.children}
  </div>
);

Field.propTypes = {
  text: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node, PropTypes.element,
  ]).isRequired,
};
