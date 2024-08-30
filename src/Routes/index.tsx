import React, { lazy } from 'react';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import PrivateRoute from './PrivateRoutes';
import ErrorBoundary from '../components/ErrorBoundary';
import { ACTIVITY, ACTIVITY_MAPPING, ASSIGN_DISTRICT, ASSIGN_HOBLI, ASSIGN_TALUK, ASSIGN_VILLAGE, CHILD_ROLES, DASHBOARD, DEPARTMENT, DPRS_COMMON, DPRS_PRIVATE, QUESTION_DROPDOWNS, QUESTION_MASTER, ROLES, ROLES_ACCESS, SCHEMES, SECTORS } from '../utils/routingPath';

const LoginPageLazy = lazy(() => import('../pages/LoginPage'));
const RoleWiseLoginLazy = lazy(() => import('../pages/roleWiseLogin'));
const SigninPageLazy = lazy(() => import('../pages/SignUpPage'));

const HomeLazy = lazy(() => import('../pages/Dashboard'));
const DepartmentLazy = lazy(() => import('../pages/admin/department'));
const RolesLazy = lazy(() => import('../pages/admin/roles'));
const ChildRolesLazy = lazy(() => import('../pages/admin/childRoles'));

const ActivityLazy = lazy(() => import('../pages/admin/activity'));
const SectorsLazy = lazy(() => import('../pages/admin/sectors'));
const SchemesLazy = lazy(() => import('../pages/admin/schemes'));
const DprsPrivateLazy = lazy(() => import('../pages/admin/dprsPrivate'));
const DprsCommonLazy = lazy(() => import('../pages/admin/dprsCommon'));
const RolesAccessLazy = lazy(() => import('../pages/admin/rolesAccess'));
const QuestionDropdownsLazy = lazy(() => import('../pages/admin/questionDropdowns'));
const QuestionMasterLazy = lazy(() => import('../pages/admin/questionMaster'));
const ActivityQuestionLazy = lazy(() => import('../pages/admin/activityQuestion'));

const DistrictAssignmentLazy = lazy(() => import('../pages/assign/District'));
const TalukAssignmentLazy = lazy(() => import('../pages/assign/Taluk'));
const HobliAssignmentLazy = lazy(() => import('../pages/assign/Hobli'));
const VillageAssignmentLazy = lazy(() => import('../pages/assign/Village'));

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
          <Route path={CHILD_ROLES} Component={ChildRolesLazy} />

          <Route path={ACTIVITY} Component={ActivityLazy} />
          <Route path={SECTORS} Component={SectorsLazy} />
          <Route path={DPRS_COMMON} Component={DprsCommonLazy} />
          <Route path={DPRS_PRIVATE} Component={DprsPrivateLazy} />
          <Route path={ROLES_ACCESS} Component={RolesAccessLazy} />
          <Route path={QUESTION_MASTER} Component={QuestionMasterLazy} />
          <Route path={QUESTION_DROPDOWNS} Component={QuestionDropdownsLazy} />
          <Route path={ACTIVITY_MAPPING} Component={ActivityQuestionLazy} />

          <Route path={ASSIGN_DISTRICT} Component={DistrictAssignmentLazy} />
          <Route path={ASSIGN_TALUK} Component={TalukAssignmentLazy} />
          <Route path={ASSIGN_HOBLI} Component={HobliAssignmentLazy} />
          <Route path={ASSIGN_VILLAGE} Component={VillageAssignmentLazy} />
        </Route>
        <Route
          path="/login"
          Component={RoleWiseLoginLazy}
          // loader={async () => isAuthenticated()}
        />
        <Route
          path="/signin"
          Component={LoginPageLazy}
          // loader={async () => isAuthenticated()}
        />
        <Route
          path="/signup"
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
