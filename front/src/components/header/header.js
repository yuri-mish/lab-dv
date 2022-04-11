import Toolbar, { Item } from 'devextreme-react/toolbar';
import Button from 'devextreme-react/button';
import PropTypes from 'prop-types';

import UserPanel from '../user-panel/user-panel';
import './header.scss';
import { Template } from 'devextreme-react/core/template';
import {
  LiveChat,
  ManualButton,
  NotificationBadge,
  VersionCheck,
} from 'components';
import { useLocation } from 'react-router-dom';
import { useMessageVars } from 'hooks';


export const Header = ({ menuToggleEnabled, title, toggleMenu }) => {
  const location = useLocation();
  const counts = useMessageVars([ 'reportsWithErrorCount', 'newOrderCount' ]);
  const totalNotfications = counts.reduce((a, b) => a + (b || 0), 0);

  return (
    <header className={'header-component'}>
      <Toolbar className={'header-toolbar'}>
        <Item
          visible={menuToggleEnabled}
          location={'before'}
          widget={'dxButton'}
          cssClass={'menu-button'}
        >
          <NotificationBadge
            count={totalNotfications}
            containerClassName='menu-button-container'
            badgeClassName='menu-button-badge'
            dot
          >
            <Button icon='menu' stylingMode='text' onClick={toggleMenu} />
          </NotificationBadge>
        </Item>

        <Item
          location={'before'}
          cssClass={'header-title'}
          text={title}
          visible={!!title}
        />

        <Item
          location={'after'}
        >
          <VersionCheck/>
        </Item>

        <Item
          location={'after'}
        >
          <div className='header-phone'>
            <div className='dx-icon-tel header-phone-icon'/>
            <b className='header-phone-number'>
              (067) 820-39-66
            </b>
          </div>
        </Item>

        <Item visible={false} location={'after'}>
          <LiveChat floating={location.pathname === '/home'} />
        </Item>

        <Item
          location={'after'}
        >
          <ManualButton />
        </Item>

        <Item
          location={'after'}
          locateInMenu={'auto'}
          menuItemTemplate={'userPanelTemplate'}
        >
          <Button
            className={'user-button authorization'}
            width={140}
            height={'100%'}
            stylingMode={'text'}
          >
            <UserPanel menuMode={'context'} />
          </Button>
        </Item>

        <Template name={'userPanelTemplate'}>
          <UserPanel menuMode={'list'} />
        </Template>
      </Toolbar>
    </header>
  );
};

Header.propTypes = {
  menuToggleEnabled: PropTypes.bool,
  toggleMenu: PropTypes.func,
  title: PropTypes.string,
};
