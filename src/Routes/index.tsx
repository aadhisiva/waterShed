import React, { lazy } from 'react';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import PrivateRoute from './PrivateRoutes';
import ErrorBoundary from '../components/ErrorBoundary';
import { ACTIVITY, ACTIVITY_MAPPING, DASHBOARD, DEPARTMENT, DPRS_COMMON, DPRS_PRIVATE, QUESTION_DROPDOWNS, QUESTION_MASTER, ROLES, ROLES_ACCESS, SCHEMES, SECTORS } from '../utils/routingPath';

const LoginPageLazy = lazy(() => import('../pages/LoginPage'));
const SigninPageLazy = lazy(() => import('../pages/SignUpPage'));

const HomeLazy = lazy(() => import('../pages/Dashboard'));
const DepartmentLazy = lazy(() => import('../pages/admin/department'));
const RolesLazy = lazy(() => import('../pages/admin/roles'));
const ActivityLazy = lazy(() => import('../pages/admin/activity'));
const SectorsLazy = lazy(() => import('../pages/admin/sectors'));
const SchemesLazy = lazy(() => import('../pages/admin/schemes'));
const DprsPrivateLazy = lazy(() => import('../pages/admin/dprsPrivate'));
const DprsCommonLazy = lazy(() => import('../pages/admin/dprsCommon'));
const RolesAccessLazy = lazy(() => import('../pages/admin/rolesAccess'));
const QuestionDropdownsLazy = lazy(() => import('../pages/admin/questionDropdowns'));
const QuestionMasterLazy = lazy(() => import('../pages/admin/questionMaster'));
const ActivityQuestionLazy = lazy(() => import('../pages/admin/activityQuestion'));

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
          <Route path={DPRS_COMMON} Component={DprsCommonLazy} />
          <Route path={DPRS_PRIVATE} Component={DprsPrivateLazy} />
          <Route path={ROLES_ACCESS} Component={RolesAccessLazy} />
          <Route path={QUESTION_MASTER} Component={QuestionMasterLazy} />
          <Route path={QUESTION_DROPDOWNS} Component={QuestionDropdownsLazy} />
          <Route path={ACTIVITY_MAPPING} Component={ActivityQuestionLazy} />
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
      basename: "/watershed"
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
