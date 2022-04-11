import PropTypes from 'prop-types';
import styles from './sticky-bar.module.scss';

export const StickyBar = (props) => (
  <div className={styles.container}>
    {props.children}
  </div>
);

StickyBar.propTypes = {
  children: PropTypes.any,
};
