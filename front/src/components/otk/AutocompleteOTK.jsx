import { useEffect, useRef, useState } from 'react';
import { DataGrid, Popup, ScrollView } from 'devextreme-react';
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box';
import { Position } from 'devextreme-react/popup';
import PropTypes from 'prop-types';

import { randomStr } from 'utils/random-str';
import { FORM_STYLING_MODE } from 'app-constants';

export const AutocompleteOTK = (props) => {
  const dataSource = props.dataSource;
  if (props.dataSourceUserOptions) {
    dataSource.userOptions = props.dataSourceUserOptions;
  }

  const searchField = props.searchField || 'name';
  const keyField = props.keyField || 'ref';

  const ref = useRef();
  const textBoxRef = useRef();
  const [ value, setValue ] = useState(props.value);
  const [ row, setRow ] = useState(undefined);
  const [ rowIndex, setRowIndex ] = useState(undefined);
  const [ result, setResult ] = useState();
  const [ gridVisible, setGridVisible ] = useState(false);

  const popupId = useRef(randomStr('id_'));

  const changeValue = (e) => {
    setGridVisible(true);
    setValue(e.event.target.value);
    setRowIndex(undefined);
    if (ref && ref.current) ref.current.instance.clearSelection();
  };

  useEffect(() => {
    setGridVisible(false);
    if (ref.current && props.onChange) {
      const r = ref.current.instance.getSelectedRowsData()[0];
      props.onChange(r);
    }
  }, [ props, result ]);

  useEffect(() => {
    if (ref?.current?.instance) {
      ref.current.instance.filter([ searchField, 'contains', value ]);
    }
  }, [ searchField, value ]);

  const rowClick = (e) => {
    setValue(e.data[searchField]);
    setResult(e.key);
  };
  const renderContent = () => <ScrollView width="100%" height="100%" >
    <DataGrid
      ref={ref}
      dataSource={dataSource}
      paging={false}
      selection={{ mode: 'single' }}
      columns={props.columns || [ searchField ]}
      onRowClick={rowClick}
    />
  </ScrollView>;
  const enterKey = (e) => {
    let _rowIndex;
    switch (e.event.code) {
    case 'ArrowDown': {
      if (!gridVisible) setGridVisible(true);
      _rowIndex =
          rowIndex >= 0 ?
            Math.min(rowIndex + 1, ref.current.instance.totalCount() - 1) :
            0;
      break;
    }
    case 'ArrowUp': {
      _rowIndex = rowIndex > 0 ? Math.max(rowIndex - 1, 0) : 0;
      break;
    }
    case 'Enter': {
      if (row) {
        const r = row[0];
        setValue(r[searchField]);
        setResult(r[keyField]);
      } else if (ref.current && ref.current.instance.totalCount() === 1) {
        ref.current.instance.selectRowsByIndexes(0);
        const r = ref.current.instance.getSelectedRowsData()[0];
        if (r) {
          setValue(r[searchField]);
          setResult(r[keyField]);
        }
      }
      e.event.preventDefault();
      break;
    }
    default:
    }

    if (gridVisible && _rowIndex !== undefined) {
      ref.current.instance.selectRowsByIndexes(_rowIndex);
      setRowIndex(_rowIndex);
      setRow(ref.current.instance.getSelectedRowsData());
      e.event.preventDefault();
    }
  };

  return (
    <div>
      <TextBox
        ref={textBoxRef}
        id={popupId.current}
        onInput={changeValue}
        onKeyDown={enterKey}
        value={value}
        stylingMode={FORM_STYLING_MODE}
      >
        <TextBoxButton
          name='aaa'
          location="after"
          type='default'
          options={{
            icon: 'spindown',
            focusStateEnabled: false,
            onClick: () => {
              if (gridVisible) {
                setGridVisible(false);
                textBoxRef.current.instance.blur();
              } else {
                setGridVisible(true);
              }
            },
          }}
        />
      </TextBox>

      <Popup
        height={300}
        visible={gridVisible}
        showTitle={props.showTitle || false}
        contentRender={renderContent}
        onShown={() => textBoxRef.current.instance.focus()}
        shading={false}
      >
        <Position my="left top" at="left bottom" of={`#${popupId.current}`} />
      </Popup>
    </div>
  );
};


AutocompleteOTK.propTypes = {
  dataSource: PropTypes.object,
  dataSourceUserOptions: PropTypes.object,
  searchField: PropTypes.string,
  keyField: PropTypes.string,
  columns: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.any,
  onChange: PropTypes.func,
  showTitle: PropTypes.bool,
};
