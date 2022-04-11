import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import ContextMenu, { Position } from 'devextreme-react/context-menu';
import List from 'devextreme-react/list';
import PropTypes from 'prop-types';


import { useAuth } from 'contexts/auth';
import { logout } from 'api/auth';
import './user-panel.scss';


const UserPanel = function({ menuMode }) {
  const { user, signOut } = useAuth();
  const history = useHistory();

  const userOut = () => {
    logout();
    signOut(undefined);
  };

  const navigateToProfile = () => {
    history.push('/profile');
  };

  const menuItems = useMemo(() => [
    {
      text: 'Профіль',
      icon: 'user',
      onClick: navigateToProfile,
      disabled: true,
    },
    {
      text: 'Вихід',
      icon: 'runner',
      onClick: userOut,
    },
  ], [ userOut ]);

  return (
    <div className={'user-panel'}>
      <div className={'user-info'}>
        <div className={'image-container'}>
          <div
            style={{
              background: `url(${user.avatarUrl}) no-repeat #fff`,
              backgroundSize: 'cover',
            }}
            className={'user-image'}
          />
        </div>
        <div className={'user-name'}>{user.email}</div>
      </div>

      {menuMode === 'context' &&
        <ContextMenu
          items={menuItems}
          target={'.user-button'}
          showEvent={'dxclick'}
          width={140}
          cssClass={'user-menu'}
        >
          <Position my={'top center'} at={'bottom center'} />
        </ContextMenu>
      }
      {menuMode === 'list' &&
        <List className={'dx-toolbar-menu-action'} items={menuItems} />
      }
    </div>
  );
};

UserPanel.propTypes = {
  menuMode: PropTypes.string,
};

export default UserPanel;
