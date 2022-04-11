import React from 'react';
import PropTypes from 'prop-types';
import styles from './card.module.scss';

export const CardHeader = (props) => (
  <div className={styles.header}>
    <div>
      <p className={styles.headerTitle}>{props.title}</p>
      <p className={styles.headerSubtitle}>{props.subTitle}</p>
    </div>
    {props.optionsComponent ?? null}
  </div>
);

CardHeader.propTypes = {
  title: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  subTitle: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  optionsComponent: PropTypes.node,
};

export const CardContent = (props) => (
  <>{props.children}</>
);

CardContent.propTypes = {
  children: PropTypes.node,
};

export const CardOptions = (props) => (
  <>{props.children}</>
);

CardOptions.propTypes = {
  children: PropTypes.node,
};

export const Card = (props) => {
  const childrenAsArray = React.Children.toArray(props.children);

  const header = childrenAsArray.find(
    (child) => child.type.name === CardHeader.name,
  );
  const content = childrenAsArray.find(
    (child) => child.type.name === CardContent.name,
  );
  const options = childrenAsArray.find(
    (child) => child.type.name === CardOptions.name,
  );

  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        {header &&
          <div className={styles.headerContainer}>{header}</div>
        }
        {options &&
          <div>{options}</div>
        }
      </div>
      {content &&
        <div className={styles.content}>{content}</div>
      }
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node,
};
