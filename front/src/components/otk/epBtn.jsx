import { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, List, Popup } from 'devextreme-react';
import { Position } from 'devextreme-react/popup';
import PropTypes from 'prop-types';

import { randomStr } from 'utils/random-str';

import styles from './epBtn.module.scss';

export const EpBtn = ({ _id, _key = 0, items = [] }) => {
  const history = useHistory();
  const popupId = useRef(randomStr('id_'));
  const [ showPopup, setShowPopup ] = useState(false);
  const [ blockClik, setBockClick ] = useState(false);
  const handleItemClick = (e) => {
    console.log('ListItem');
    (_id !== 'new' && e?.itemData?.path) &&
    history.push(`${e?.itemData?.path}/new?order_ref=${_id}&s=${_key}`);
  };
  const ListItem = (data) => (
    <p className={styles?.m_0}>{ data?.text }</p>
  );
  const blockClick = () => {
    setTimeout(() => {
      setBockClick(false);
    }, 100);
    setBockClick(true);
  };
  const togglePopup = () => {
    if (!blockClik) {
      setShowPopup(!showPopup);
    }
    blockClick();
  };
  return (
    <div id={popupId.current} className={styles?.wrapBtn}>
      <Popup
        className={styles?.wrapPopup}
        visible={showPopup}
        showTitle={false}
        shading={false}
        closeOnOutsideClick={true}
        onHiding={() => {
          blockClick();
          setShowPopup(false);
        }}
        maxHeight={'fit-content'}
        height={'fit-content'}
        width={150}
      >
        <Position my="left top" at="left bottom" of={`#${popupId.current}`} />
        <List
          groupTemplate="group"
          dataSource={items}
          itemRender={ListItem}
          onItemClick={handleItemClick}
        />
      </Popup>
      <Button onClick={togglePopup} icon="box"
        stylingMode= "text"/>
      <span onClick={togglePopup}
        className={`${styles?.arrow} ${showPopup && styles?.rotate}`} />
    </div>
  );
};

EpBtn.propTypes = {
  _id: PropTypes.string,
  _key: PropTypes.number,
  items: PropTypes.array,
};

export default EpBtn;
