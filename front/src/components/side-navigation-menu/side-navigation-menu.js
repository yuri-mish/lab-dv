/* eslint-disable react/prop-types */
import { useEffect, useRef, useCallback, useMemo } from 'react';
import TreeView from 'devextreme-react/tree-view';
import { navigation } from 'app-navigation';
import * as events from 'devextreme/events';
import { useNavigation } from 'contexts/navigation';
import { useScreenSize } from 'utils/media-query';
import { useAuth } from 'contexts/auth';
import './side-navigation-menu.scss';
import { Footer } from 'components';
import { MenuItem } from './navigation-menu-item';
import { matchRole } from 'utils/roles';
import styles from './menu.module.scss';


export const SideNavigationMenu = (props) => {
  const {
    children,
    selectedItemChanged,
    openMenu,
    compactMode,
    onMenuReady,
  } = props;

  const { isLarge } = useScreenSize();
  const { user } = useAuth();

  const normalizePath = () => navigation.map((item) => {
    if (item.path && !/^\//.test(item.path)) {
      item.path = `/${item.path}`;
    }

    return { ...item, expanded: isLarge };
  });

  const filterByRoles = () => normalizePath().map((item) => {
    if (!matchRole(user.roles, item?.roles)) {
      item.visible = false;
    }

    return { ...item };
  });

  const items = useMemo(
    filterByRoles,
    [],
  );

  const { navigationData: { currentPath } } = useNavigation();

  const treeViewRef = useRef();
  const wrapperRef = useRef();
  const getWrapperRef = useCallback((element) => {
    const prevElement = wrapperRef.current;
    if (prevElement) {
      events.off(prevElement, 'dxclick');
    }

    wrapperRef.current = element;
    events.on(element, 'dxclick', (e) => {
      openMenu(e);
    });
  }, [ openMenu ]);

  useEffect(() => {
    const treeView = treeViewRef.current && treeViewRef.current.instance;
    if (!treeView) {
      return;
    }

    if (currentPath !== undefined) {
      treeView.selectItem(currentPath);
      treeView.expandItem(currentPath);
    }

    if (compactMode) {
      treeView.collapseAll();
    }
  }, [ currentPath, compactMode ]);

  return (
    <div
      className={'dx-swatch-additional side-navigation-menu'}
      ref={getWrapperRef}
    >
      {children}
      <div className={'menu-container'}>
        <TreeView
          ref={treeViewRef}
          className={styles.treeview}
          items={items}
          keyExpr={'path'}
          selectionMode={'single'}
          focusStateEnabled={false}
          expandEvent={'click'}
          onItemClick={selectedItemChanged}
          onContentReady={onMenuReady}
          width={'100%'}
          itemRender={(data) => (<MenuItem {...data}/>)}
        />
      </div>
      <div className={'menu-footer'}>
        <Footer compactMode={compactMode}/>
      </div>
    </div>
  );
};
