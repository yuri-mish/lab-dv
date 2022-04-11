import { useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import './dx-styles.scss';
import './themes/generated/theme.base.css';
import './themes/generated/theme.additional.css';
// otk-styles override dx-styles
import 'react-toastify/dist/ReactToastify.css';
import './scss/otk-styles.scss';
import LoadPanel from 'devextreme-react/load-panel';
import { NavigationProvider } from 'contexts/navigation';
import { AuthProvider, useAuth } from 'contexts/auth';
import { useScreenSizeClass } from 'utils/media-query';
import { Content } from './Content';
import { UnauthenticatedContent } from './UnauthenticatedContent';

import uaMessages from 'contexts/ua.json';
import { locale, loadMessages } from 'devextreme/localization';
import { appInfo } from './app-info';
import { MessageProvider } from 'contexts/messages';
import { NotificationManager } from 'components';

const App = () => {
  loadMessages(uaMessages);
  locale('ua');

  const { user, loading } = useAuth();

  useEffect(() => {
    document.title = appInfo.docTitle;
  });

  if (loading) {
    return <LoadPanel visible={true} />;
  }

  if (user) {
    return (
      <MessageProvider>
        <NotificationManager />
        <Content />
      </MessageProvider>
    );
  }

  return <UnauthenticatedContent />;
};

const AppMain = () => {
  const screenSizeClass = useScreenSizeClass();

  return (
    <Router>
      <AuthProvider>
        <NavigationProvider>
          <div className={`app ${screenSizeClass}`}>
            <App />
          </div>
        </NavigationProvider>
      </AuthProvider>
    </Router>
  );
};

export default AppMain;
