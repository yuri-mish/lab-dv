import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { useApolloClient } from '@apollo/client';

import {
  Menu,
  ScrollView,
} from 'devextreme-react';

import styles from '../styles/style.module.scss';


import {
  DocInfoBar,
  StickyBar,
} from 'components';

import { TextItem } from './textItem';
import { cardFields1, cardFields2 } from './fields';
import { getPolicy } from './getPolicy';


export const PolicyCard = () => {
  const history = useHistory();
  const gqlClient = useApolloClient();

  const { id } = useParams();
  const isNewDoc = id === 'new';

  const [ loading, setLodading ] = useState(false);

  const [ data, setData ] = useState({});
  useEffect(async () => {
    setLodading(true);
    const getData = await getPolicy({ ref: id, gqlClient });
    setData(getData);
    setLodading(false);
  }, []);
  return (
    <div>
      <StickyBar>
        <DocInfoBar
          name={`Страховий поліс №${data?.policy_num || ''}`}
          loading={loading}
          isNew={isNewDoc}
        >
          {/* {!data.draft &&
              <div className={'otk-tag otk-status-warning'}>
                <div className='dx-icon-warning'></div>
                &nbsp;Документ тільки для перегляду
              </div>
          } */}
        </DocInfoBar>
        <Menu
          onItemClick={(e) => {
            if (e.itemData.id === 'close') {
              history.goBack();
            }
          }}
          dataSource={[
            {
              text: 'Закрити',
              id: 'close',
              icon: 'close',
            },
          ]}
        />
      </StickyBar>
      <div className={`${styles?.ep_main_content_block} dx-card`}>
        <ScrollView>
          <div className={styles?.policy_card_wrap}>
            <div>
              {cardFields1.map((item, index) => <TextItem key={index}
                text={item?.text} data={data?.[item?.data]}/>,
              )}
            </div>
            <div>
              {cardFields2.map((item, index) => <TextItem key={index}
                text={item?.text} data={data?.[item?.data]}/>,
              )}
            </div>
          </div>
        </ScrollView>
      </div>
    </div>
  );
};
