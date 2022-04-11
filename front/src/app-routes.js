import { withNavigationWatcher } from './contexts/navigation';
import {
  HomePage,
  TasksPage,
  ProfilePage,
  OrdersPage,
  OrderPage,
  ActsPage,
  FormOrdersPage,
  FormOrderPage,
  PriceOrderPage,
  PriceOrdersPage,
  EPPage,
  EPMainForm,
  EPTachograph,
  Diotrade,
  EpCO2Form,
  EKMT,
  LabReportPage,
  LabReportsPage,
  ManualPage,
  ManualMOC,
  PolicyPage,
  PolicyCard,
  PolicyNew,
  DashboardPage,
  ContractOffer,
  ImportCarsPage,
} from './pages';

import { TestPage } from './pages/test/test';

export const routes = [
  {
    path: '/tasks',
    component: TasksPage,
  },
  {
    path: '/profile',
    component: ProfilePage,
  },
  {
    path: '/home',
    component: HomePage,
  },
  {
    path: '/dashboard',
    component: DashboardPage,
  },
  {
    path: '/orders',
    component: OrdersPage,
  },
  {
    path: '/acts',
    component: ActsPage,
  },
  {
    path: '/lab_reports',
    component: LabReportsPage,
  },
  {
    path: '/lab_report/:id',
    component: LabReportPage,
  },
  {
    path: '/form_orders',
    component: FormOrdersPage,
  },
  {
    path: '/price_orders',
    component: PriceOrdersPage,
  },
  {
    path: '/order/:id',
    component: OrderPage,
  },
  {
    path: '/form_order/:id',
    component: FormOrderPage,
  },
  {
    path: '/price_order/:id',
    component: PriceOrderPage,
  },
  {
    path: '/test/',
    component: TestPage,
  },
  {
    path: '/ep',
    component: EPPage,
  },
  {
    path: '/ep/:id',
    component: EPMainForm,
  },
  {
    path: '/ep-taho/:id',
    component: EPTachograph,
  },
  {
    path: '/ep-dio/:id',
    component: Diotrade,
  },
  {
    path: '/ep-co2/:id',
    component: EpCO2Form,
  },
  {
    path: '/ep-ekmt/:id',
    component: EKMT,
  },
  {
    path: '/manuals-moc',
    component: ManualMOC,
  },
  {
    path: '/manual/:id',
    component: ManualPage,
  },
  {
    path: '/policy',
    component: PolicyPage,
  },
  {
    path: '/policy/:id',
    component: PolicyCard,
  },
  {
    path: '/policy-new',
    component: PolicyNew,
  },
  {
    path: '/oferta',
    component: ContractOffer,
  },
  {
    path: '/import-cars',
    component: ImportCarsPage,
  },
];

export default routes.map((route) => ({
  ...route,
  component: withNavigationWatcher(route.component),
}));
