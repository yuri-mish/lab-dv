import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

// import { useApolloClient } from '@apollo/client';
//parts
import { Part1 } from './part1';
import { Part2 } from './part2';
import { Part3 } from './part3';
import {
  Menu,
  ScrollView,
} from 'devextreme-react';

import styles from '../styles/style.module.scss';

import {
  DocInfoBar,
  StickyBar,
} from 'components';

// import { getPolicy } from './getPolicy';

export const PolicyNew = () => {
  const history = useHistory();
  // const gqlClient = useApolloClient();

  const { id } = useParams();
  const isNewDoc = id === 'new';

  const [ loading, setLodading ] = useState(false);

  const [ data, setData ] = useState({ step: 1, policy_type: 'osago' });
  console.log('data', data);

  useEffect(async () => {
    setLodading(true);
    // const getData = await getPolicy({ ref: id, gqlClient });
    setTimeout(() => {
      setLodading(false);
    }, 2000);
  }, []);
  return (
    <div>
      <StickyBar>
        <DocInfoBar
          name={`Покупка Страхового Полісу`}
          loading={loading}
          isNew={isNewDoc}
        />
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
      <div className={`${styles?.container} dx-card`}>
        <ScrollView>
          <div>
            { data?.step === 1 && <Part1 data={data} setData={setData}/> }
            { data?.step === 2 && <Part2 data={data} setData={setData}/> }
            { data?.step === 3 && <Part3 data={data} setData={setData}/> }
          </div>
        </ScrollView>
      </div>
    </div>
  );
};
