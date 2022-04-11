import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';

import { showError } from 'utils/notify.js';
import { messages } from 'messages';

import { Menu, Tabs, ScrollView } from 'devextreme-react';
import { DocInfoBar, StickyBar } from 'components';
import { CarData } from './car_data';
import { RequipmentData } from './requipment_data';
import { CheckData } from './check_data';
import { CodesData } from './codes_data';
import { FotoData } from './foto_data';

import { loader } from 'graphql.macro';
const getEpOtkOrders = loader('../gql/getEpOtkOrders.graphql');

import styles from './styles.module.scss';

export const Diotrade = () => {
  const { id } = useParams();
  const history = useHistory();
  const gqlClient = useApolloClient();
  const [ data, setData ] = useState({});
  const [ tabIndex, setTabIndex ] = useState(0);
  const [ loading, setLoading ] = useState(true);
  useEffect(async () => {
    if (id) {
      await gqlClient
        .query({
          query: getEpOtkOrders,
          variables: { ref: id },
        })
        .then((response) => {
          const res = response?.data?.getEPOTK[0];
          if (res) {
            setData({
              _id: res?._id,
              ref: res?.ref,
              date: res?.date,
              caption: res?.caption,
              number_doc: res?.number_doc,
              ...res?.body,
            });
          }
        })
        .catch(() => {
          showError(messages?.DATA_LOAD_FAILED);
        });
    }
    setLoading(false);
  }, []);
  const handleTabChange = (e) => {
    if (e?.name === 'selectedIndex' && e?.value !== -1) {
      setTabIndex(e?.value);
    }
  };

  const tabs = [
    {
      text: 'Транспортний засіб',
      icon: 'car',
      content: (<CarData data={data}/>),
    },
    {
      text: 'Результати випробувань',
      icon: 'columnchooser',
      content: (<CheckData data={data}/>),
    },
    {
      text: 'Переобладнання',
      icon: 'preferences',
      content: (<RequipmentData data={data}/>),
    },
    {
      text: 'Несправності',
      icon: 'orderedlist',
      content: (<CodesData data={data}/>),
    },
    {
      text: 'Фото',
      icon: 'image',
      content: (<FotoData data={data}/>),
    },
  ];
  return (
    <div>
      <StickyBar>
        <DocInfoBar
          name='"ОТК" => "Диотрейд" '
          data={{
            date: data.date,
            number: data.number_doc,
          }}
          loading={loading}
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
            },
          ]}
        />
        <Tabs
          className={styles?.fix_icons}
          dataSource={tabs}
          selectedIndex={tabIndex}
          onOptionChanged={handleTabChange}
        />
      </StickyBar>
      <div className={`${styles?.wrap} dx-card`}>
        <ScrollView>
          <div>
            {tabs[tabIndex]?.content}
          </div>
        </ScrollView>
      </div>
    </div>);
};
export default Diotrade;
