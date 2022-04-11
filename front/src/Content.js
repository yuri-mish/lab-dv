import { Switch, Route, Redirect } from 'react-router-dom';
import { appInfo } from 'app-info';
import routes from 'app-routes';
import { SideNavOuterToolbar as SideNavBarLayout } from 'layouts';

export const Content = () => <SideNavBarLayout title={appInfo.title}>
  <Switch>
    {routes.map(({ path, component }) => <Route
      exact
      key={path}
      path={path}
      component={component}
    />,
    )}
    <Redirect to={'/dashboard'} />
  </Switch>
</SideNavBarLayout>;

