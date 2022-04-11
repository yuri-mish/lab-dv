import { NotificationBadge } from 'components';
import { useMessageVars } from 'hooks';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './menu.module.scss';

export const MenuItem = React.memo((props) => {
  const [ notificationCount ] = useMessageVars(
    [ props.notification ],
    !props.notification,
  );
  const hasIcon = !!props.icon;
  return (
    <div className={styles.itemContainer}>
      <NotificationBadge
        containerClassName={styles.iconContainer}
        visible={!!notificationCount}
        count={notificationCount}
      >
        {hasIcon ?
          <i className={`dx-icon-${props.icon} ${styles.icon}`}/> :
          <i className={styles.dot}/>
        }

      </NotificationBadge>
      <span>{props.text}</span>
    </div>
  );
});

MenuItem.displayName = 'MenuItem';

MenuItem.propTypes = {
  icon: PropTypes.string,
  text: PropTypes.string,
  notification: PropTypes.string,
};
