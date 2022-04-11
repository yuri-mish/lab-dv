import PropTypes from 'prop-types';
import { buildClass } from 'utils/build-classname';
import styles from './notification-badge.module.scss';

export const NotificationBadge = ({
  count = 1,
  dot = false,
  visible = true,
  bottom = false,
  left = false,
  badgeClassName = '',
  containerClassName = '',
  status = 'error',
  ...props
}) => {
  const showBadge = visible && count > 0;
  const isWide = count >= 10;
  const value = count > 99 ? `${count.toString()[0]}..` : count || '';
  const badgeStyle = buildClass(
    styles.badge,
    `otk-status-${status}`,
    badgeClassName,
    isWide && styles.wide,
    dot && styles.dot,
    !showBadge && styles.invisible,
  );

  const badgeContainerStyle = buildClass(
    styles.badgeContainer,
    left && styles.left,
    bottom && styles.bottom,
    left && bottom && styles.bottomLeft,
  );

  const containerStyle = buildClass(styles.container, containerClassName);

  return (
    <div className={containerStyle}>
      <div className={badgeContainerStyle}>
        <span className={badgeStyle}>{value}</span>
      </div>

      {props.children}
    </div>
  );
};

NotificationBadge.propTypes = {
  children: PropTypes.node,
  count: PropTypes.number,
  dot: PropTypes.bool,
  visible: PropTypes.bool,
  bottom: PropTypes.bool,
  left: PropTypes.bool,
  badgeClassName: PropTypes.string,
  containerClassName: PropTypes.string,
  status: PropTypes.oneOf([
    'success',
    'error',
    'pending',
    'warning',
    'default',
    'processing',
  ]),
};
