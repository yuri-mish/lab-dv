/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { buildClass } from 'utils/build-classname';
import styles from './page-content.module.scss';

export const PageContent = ({ size = 'default', ...props }) => {
  const contentClass = buildClass(
    'otk-page-container',
    styles.content,
    size !== 'default' && styles[size],
    'dx-card',
    props.className,
  );
  return (
    <div className='content-block otk-content-block'>
      <div className={contentClass}>
        {props.children}
      </div>
    </div>
  );
};

PageContent.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf([ 'default', 'large', 'max' ]),
  children: PropTypes.node,
};
