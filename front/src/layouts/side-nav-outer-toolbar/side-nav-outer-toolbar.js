import Drawer from 'devextreme-react/drawer';
import ScrollView from 'devextreme-react/scroll-view';
import React, { useState, useCallback, useRef } from 'react';
import { useHistory } from 'react-router';
import { Header, SideNavigationMenu, Footer } from 'components';
import './side-nav-outer-toolbar.scss';
import { useScreenSize } from 'utils/media-query';
import { Template } from 'devextreme-react/core/template';
import { useMenuPatch } from 'utils/patches';
import { openDoc } from 'utils/open-doc';
import { ToastContainer } from 'react-toastify';

const MenuStatus = {
  Closed: 1,
  Opened: 2,
  TemporaryOpened: 3,
};

// eslint-disable-next-line react/prop-types
export const SideNavOuterToolbar = function({ title, children }) {
  const scrollViewRef = useRef();
  const history = useHistory();
  const { isXSmall, isLarge } = useScreenSize();
  const [ patchCssClass, onMenuReady ] = useMenuPatch();
  const [ menuStatus, setMenuStatus ] = useState(
    isLarge ? MenuStatus.Opened : MenuStatus.Closed,
  );

  const toggleMenu = useCallback(({ event }) => {
    setMenuStatus(
      (prevMenuStatus) => (prevMenuStatus === MenuStatus.Closed ?
        MenuStatus.Opened :
        MenuStatus.Closed),
    );
    event.stopPropagation();
  }, []);

  const temporaryOpenMenu = useCallback(() => {
    setMenuStatus(
      (prevMenuStatus) => (prevMenuStatus === MenuStatus.Closed ?
        MenuStatus.TemporaryOpened :
        prevMenuStatus),
    );
  }, []);

  const onOutsideClick = useCallback(() => {
    setMenuStatus(
      (prevMenuStatus) => (prevMenuStatus !== MenuStatus.Closed && !isLarge ?
        MenuStatus.Closed :
        prevMenuStatus),
    );
  }, [ isLarge ]);

  const onNavigationChanged = useCallback(
    ({ itemData: { path, isLink }, event, node }) => {
      if (menuStatus === MenuStatus.Closed || !path || node.selected) {
        event.preventDefault();
        return;
      }

      if (isLink) {
        openDoc(path);
      } else {
        history.push(path);
        scrollViewRef.current.instance.scrollTo(0);
      }

      if (!isLarge || menuStatus === MenuStatus.TemporaryOpened) {
        setMenuStatus(MenuStatus.Closed);
        event.stopPropagation();
      }
    }, [ history, menuStatus, isLarge ]);

  return (
    <div className={'side-nav-outer-toolbar'}>
      <Header
        className={'layout-header'}
        menuToggleEnabled
        toggleMenu={toggleMenu}
        title={title}
      />
      <ToastContainer
        className='toastContainer'
      />
      <Drawer
        className={[ 'drawer', patchCssClass ].join(' ')}
        position={'before'}
        closeOnOutsideClick={onOutsideClick}
        openedStateMode={isLarge ? 'shrink' : 'overlap'}
        revealMode={isXSmall ? 'slide' : 'expand'}
        minSize={isXSmall ? 0 : 60}
        maxSize={250}
        shading={!isLarge}
        opened={menuStatus !== MenuStatus.Closed}
        template={'menu'}
      >
        <div className={'container'}>
          <ScrollView
            ref={scrollViewRef}
            className={'layout-body with-footer'}
          >
            <div className={'content page-content'}>
              {React.Children.map(
                children,
                (item) => item.type !== Footer && item,
              )}
            </div>
            <div className={'content-block'}>
              {React.Children.map(
                children,
                (item) => item.type === Footer && item,
              )}
            </div>
          </ScrollView>
        </div>
        <Template name={'menu'}>
          <SideNavigationMenu
            compactMode={menuStatus === MenuStatus.Closed}
            selectedItemChanged={onNavigationChanged}
            openMenu={temporaryOpenMenu}
            onMenuReady={onMenuReady}
          >
          </SideNavigationMenu>
        </Template>
      </Drawer>
    </div>
  );
};

