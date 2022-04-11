import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { Popup, Button } from 'devextreme-react';
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box';
import { Position } from 'devextreme-react/popup';
import { randomStr } from 'utils/random-str';
import { useScreenSize } from 'utils/media-query';
import styles from './search-dropdown.module.scss';
import { useDeviceType } from 'hooks';

export const SearchDropdown = ({
  minSearchLength = 1,
  searchTimeout = 0,
  placeholder = '...',
  saveSearchValueOnLeave = true,
  width = '100%',
  dropdownWidth = '100%',
  dropdownHeight = 300,
  popupMode = 'dropdown',
  ...props
}) => {
  const [ showContent, setShowContent ] = useState(false);

  const { isDesktop } = useDeviceType();
  popupMode = isDesktop ? popupMode : 'fullscreen';
  const useAdditionalSearch = popupMode !== 'dropdown';
  const text = useMemo(() => props.text, [ props.text ]);
  const calcSearchValue = useCallback((textValue) => (
    props.calcSearchValue?.(textValue) ?? ''
  ), [ props.calcSearchValue ]);

  // Child methods
  const childRef = useRef({});

  const popupTextBoxRef = useRef();
  const textBoxRef = useRef();
  const popupRef = useRef();

  const textBoxId = useRef(randomStr('id_'));
  const popupContentRef = useRef();
  const searchValue = useRef(text);
  // Track popup show up to handle focus drop from textbox
  const delayDebounceFn = useRef(null);

  const { isXSmall } = useScreenSize();


  const onRef = useCallback((ref) => {
    childRef.current = ref;
  }, []);


  useEffect(() => {
    searchValue.current = calcSearchValue(text);
    textBoxRef.current.instance.option('value', text);
  }, [ text, calcSearchValue ]);


  const shouldContentShow = () => searchValue.current.length >= minSearchLength;

  const leaveSearch = () => {
    textBoxRef.current.instance.option('showClearButton', false);
    textBoxRef.current.instance.option('value', text);
    if (!saveSearchValueOnLeave) {
      searchValue.current = calcSearchValue(text);
    }
    textBoxRef.current.instance.blur();
  };

  const enterSearch = () => {
    textBoxRef.current.instance.option('showClearButton', true);
    if (!useAdditionalSearch) {
      textBoxRef.current.instance.option('value', searchValue.current);
    }
  };

  const leaveComponent = () => {
    leaveSearch();
    popupRef.current.instance.hide();
  };

  const showPopup = () => {
    popupRef.current.instance.show();
    enterSearch();
    textBoxRef.current.instance.focus();
    childRef.current.search(searchValue.current);
  };


  // Child callback
  const handleSelectionChange = (data) => {
    props.onSelect(data);
    textBoxRef.current.instance.reset();
    leaveComponent();
  };

  const handleSearchTextChange = (e) => {
    const text = e.event.target.value;
    searchValue.current = text;

    if (delayDebounceFn.current) {
      clearTimeout(delayDebounceFn.current);
    }

    delayDebounceFn.current = setTimeout(() => {
      if (showContent) {
        childRef.current.search(text);
      }

      if (shouldContentShow() && !showContent) {
        showPopup();
      }
    }, searchTimeout);
  };

  const handleSearchKeyPress = (e) => {
    switch (e.event.code) {
    case 'ArrowDown': {
      if (showContent) {
        childRef.current.moveDown();
      } else {
        showPopup();
      }
      break;
    }
    case 'ArrowUp': {
      if (showContent) {
        childRef.current.moveUp();
        e.event.preventDefault();
      }
      break;
    }
    case 'Tab': {
      if (showContent) {
        childRef.current.focus();
        e.event.preventDefault();
      }
      break;
    }
    case 'Enter': {
      if (showContent) {
        childRef.current.selectCurrent();
      } else {
        showPopup();
      }
      break;
    }
    default:
    }
  };

  const handleDropdownButtonClick = () => {
    if (showContent) {
      textBoxRef.current.instance.blur();
      popupRef.current.instance.hide();
    } else {
      showPopup();
    }
  };

  const handlePopupOutsideClick = (e) => {
    const textBoxInstance = textBoxRef.current.instance;
    return (
      !popupContentRef.current.contains(e.target) &&
        !textBoxInstance.element().contains(e.target)
    );
  };

  const handlePopupShowing = () => {
    setShowContent(true);
  };

  const handlePopupHiding = () => {
    setShowContent(false);
    leaveSearch();
  };

  const handlePopupShown = () => {
    if (useAdditionalSearch) {
      popupTextBoxRef.current.instance.focus();
      popupTextBoxRef.current.instance.option('value', searchValue.current);
    }
  };

  const handleTextBoxFocusOut = () => {
    if (!showContent) {
      leaveSearch();
    }
  };

  const handleTextBoxFocusIn = () => {
    childRef.current.loadData();
    if (useAdditionalSearch || shouldContentShow()) {
      showPopup();
    } else {
      enterSearch();
    }
  };

  const textBoxProps = Object.fromEntries(Object.entries(props)
    .filter(([ key ]) => ![ 'value' ].includes(key)),
  );

  return (
    <>
      <TextBox
        {...textBoxProps}
        ref={textBoxRef}
        id={textBoxId.current}
        className={useAdditionalSearch && styles.mainTextboxInactive}
        hoverStateEnabled
        placeholder={placeholder}
        onInput={(value) => handleSearchTextChange(value)}
        readOnly={useAdditionalSearch && showContent}
        onFocusOut={handleTextBoxFocusOut}
        onFocusIn={handleTextBoxFocusIn}
        onKeyDown={handleSearchKeyPress}
        width={width}
        onValueChanged={() => {
          if (showContent) {
            // Prevent validation on textbox clear
            textBoxRef.current.instance.option('isValid', true);
          }
        }}
      >
        {!useAdditionalSearch && props.validator}

        {props.onEdit && text &&
          <TextBoxButton
            name='editButton'
            location='before'
            options={{
              disabled: false,
              icon: 'edit',
              focusStateEnabled: false,
              onClick: () => props.onEdit(props.value),
            }}
          />
        }
        <TextBoxButton
          name='clear'
        />
        <TextBoxButton
          name='sdButton'
          location='after'
          options={{
            disabled: false,
            icon: useAdditionalSearch ?
              'search' :
              showContent ? 'spinup' : 'spindown',
            activeStateEnabled: !useAdditionalSearch,
            focusStateEnabled: false,
            hoverStateEnabled: !useAdditionalSearch,
            onClick: handleDropdownButtonClick,
          }}
        />
      </TextBox>

      <Popup
        ref={popupRef}
        dragEnabled={popupMode === 'popup'}
        width={dropdownWidth}
        maxWidth={isXSmall ? '100%' : 'auto'}
        height={popupMode === 'dropdown' ? dropdownHeight : '80%'}
        shading={false}
        showTitle={useAdditionalSearch}
        focusStateEnabled={false}
        closeOnOutsideClick={handlePopupOutsideClick}
        onHiding={handlePopupHiding}
        onShowing={handlePopupShowing}
        onShown={handlePopupShown}
        fullScreen={popupMode === 'fullscreen'}
        titleComponent={() => (
          <div className={styles.popupTitle}>
            <TextBox
              ref={popupTextBoxRef}
              stylingMode='filled'
              placeholder={placeholder}
              onInput={(value) => handleSearchTextChange(value)}
              onKeyDown={handleSearchKeyPress}
              showClearButton
              width='50%'
            />
            <Button
              icon='close'
              onClick={() => {
                popupRef.current.instance.hide();
              }}
            />
          </div>
        )}
      >
        {popupMode === 'dropdown' &&
          <Position
            my={props.top ? 'left bottom' : 'left top'}
            at={props.top ? 'left top' : 'left bottom'}
            of={`#${textBoxId.current}`}
          />
        }

        <div
          ref={popupContentRef}
          className={styles.popupContent}
        >
          {React.Children.only(
            React.cloneElement(
              props.children,
              {
                ref: onRef,
                value: props.value || null,
                onSelectionChanged: handleSelectionChange,
              },
            ),
          )}
        </div>
      </Popup>
    </>
  );
};

export const forwardProps = {
  ...TextBox.propTypes,
  minSearchLength: PropTypes.number,
  searchTimeout: PropTypes.number,
  placeholder: PropTypes.string,
  saveSearchValueOnLeave: PropTypes.bool,
  calcSearchValue: PropTypes.func,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  dropdownWidth: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  dropdownHeight: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  top: PropTypes.bool,
  popupMode: PropTypes.oneOf([ 'dropdown', 'fullscreen', 'popup' ]),
  validator: PropTypes.element,
};

SearchDropdown.propTypes = {
  ...forwardProps,
  value: PropTypes.any.isRequired,
  text: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  onEdit: PropTypes.func,

  children: PropTypes.element.isRequired,
};
