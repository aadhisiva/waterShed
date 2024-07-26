import React, { lazy } from 'react';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import PrivateRoute from './PrivateRoutes';
import ErrorBoundary from '../components/ErrorBoundary';
import { ACTIVITY, DASHBOARD, DEPARTMENT, ROLES, SCHEMES, SECTORS } from '../utils/routingPath';

const LoginPageLazy = lazy(() => import('../pages/LoginPage'));
const SigninPageLazy = lazy(() => import('../pages/SignUpPage'));

const HomeLazy = lazy(() => import('../pages/Dashboard'));
const DepartmentLazy = lazy(() => import('../pages/admin/department'));
const RolesLazy = lazy(() => import('../pages/admin/roles'));
const ActivityLazy = lazy(() => import('../pages/admin/activity'));
const SectorsLazy = lazy(() => import('../pages/admin/sectors'));
const SchemesLazy = lazy(() => import('../pages/admin/schemes'));
const DashboardLazy = lazy(() => import('../pages/Dashboard'));

export default function RoutesPro() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route element={<PrivateRoute timeoutInMinutes={60} />}>
          <Route index Component={HomeLazy} />
          <Route path={DEPARTMENT} Component={DepartmentLazy} />
          <Route path={SCHEMES} Component={SchemesLazy} />
          <Route path={DASHBOARD} Component={DashboardLazy} />
          <Route path={ROLES} Component={RolesLazy} />
          <Route path={ACTIVITY} Component={ActivityLazy} />
          <Route path={SECTORS} Component={SectorsLazy} />
        </Route>
        <Route
          path="signin"
          Component={LoginPageLazy}
          // loader={async () => isAuthenticated()}
        />
        <Route
          path="signup"
          Component={SigninPageLazy}
          // loader={async () => isAuthenticated()}
        />
        <Route path="*" element={<div>Page not found..</div>} />
      </Route>,
    ),
    {
      basename: "/watershed/"
    }
  );
  return (
    <ErrorBoundary>
      <RouterProvider
        fallbackElement={<div>Fall back page...</div>}
        router={router}
      />
    </ErrorBoundary>
  );
}
