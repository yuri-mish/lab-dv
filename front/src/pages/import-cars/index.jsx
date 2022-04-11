import React from 'react';
import { useHistory } from 'react-router-dom';
import { DocInfoBar, StickyBar } from 'components';
import { Menu } from 'devextreme-react/menu';
import { ImportCars } from './import-cars';

export const ImportCarsPage = () => {
  const history = useHistory();
  return (
    <div className={`dx-card`}>
      <StickyBar>
        <DocInfoBar name='Імпорт даних авто'/>
        <Menu
          onItemClick={(e) => {
            if (e.itemData.id === 'close') {
              history.push({ pathname: '/home' });
            }
          }
          }
          dataSource={[
            {
              id: 'close',
              icon: 'close',
              text: 'Закрити',
            },
          ]}
        />
      </StickyBar>
      <ImportCars />
    </div>
  );
};
export default ImportCarsPage;
