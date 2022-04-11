import PropTypes from 'prop-types';
import { LoadIndicator } from 'devextreme-react/load-indicator';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import styles from './doc-info-bar.module.scss';
import dayjs from 'dayjs';
import { DATE_DISPLAY_FORMAT } from 'app-constants';
import React from 'react';

export const DocInfoBar = ({ loading = false, ...props }) => {
  const dateStr = props?.data?.date ?
    `від ${dayjs(props.data.date).format(DATE_DISPLAY_FORMAT)}` :
    '';
  const docNumber = props?.data?.number ? ` ${props.data.number} ` : ' ';
  const docDesc = props?.isNew ?
    '(новий)' :
    `${docNumber}${dateStr}`;
  return (
    <div className='otk-info-bar'>
      {loading ?
        <LoadIndicator
          indicatorSrc='img/loader.gif'
          width={50}
          height={50}
        /> :
        <>
          <Toolbar className={styles.toolbar}>
            <Item
              location='before'
              cssClass={styles.desc}
              text={`${props.name} ${docDesc}`}
            >
            </Item>

            {React.Children.toArray(props.children)
              .filter((child) => !!child).map((child, index) => <Item
                cssClass={styles.menuItem}
                key={index}
                locateInMenu='auto'
                location='before'
              >
                {child}
              </Item>,
              )}
          </Toolbar>
          <div>

          </div>
        </>
      }
    </div>
  );
};

DocInfoBar.propTypes = {
  name: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  isNew: PropTypes.bool,
  data: PropTypes.shape({
    date: PropTypes.string,
    number: PropTypes.string,
  }),
  children: PropTypes.any,
};

