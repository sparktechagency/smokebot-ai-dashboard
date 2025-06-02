import { createBrowserRouter } from 'react-router-dom'

import Login from '../Pages/auth/Login'
import ForgetPassword from '../Pages/auth/ForgetPassword'
import VerifyCode from '../Pages/auth/VerifyCode'
import SetNewPassword from '../Pages/auth/SetNewPassword'

import AdminRoute from '../ProtectedRoute/AdminRoute'
import Dashboard from '../Pages/layout/Dashboard'
import DashboardHome from '../Pages/dashboardHome/DashboardHome'
import UserManagementCarOwner from '../Pages/userManagement/carOnwer/UserManagementCarOwner'
import UserManagementBusinessOwner from '../Pages/userManagement/businessOwner/UserManagementBusinessOwner'
import UserManagementBusinessEmployee from '../Pages/userManagement/businessEmployee/UserManagementBusinessEmployee'
import SubscriptionManagement from '../Pages/subscriptionManagement/SubscriptionManagement'
import ErrorBoundary from '../ErrorBoundary'
import SignUp from '../Pages/auth/SignUp'
import Packages from '../Pages/packages/Packages'
import InventoryManagement from '../Pages/inventoryManagement/InventoryManagement'
import UserSignUp from '../Pages/auth/UserSignUp'
import UserDashboardHome from '../Pages/userDashboardHome/UserDashboardHome'
import SignUpVerifyCode from '../Pages/auth/SignUpVerifyCode'
import UserSignUpUserAlreadyHave from '../Pages/auth/UserSignUpUserAlreadyHave'

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorBoundary />,
    element: (
      <AdminRoute>
        <Dashboard />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: '/user-management/car-owner',
        element: <UserManagementCarOwner />,
      },
      {
        path: '/user-management/business',
        element: <UserManagementBusinessOwner />,
      },
      {
        path: '/user-management/business-employee',
        element: <UserManagementBusinessEmployee />,
      },

      {
        path: '/subscription-plan',
        element: <SubscriptionManagement />,
      },
      {
        path: '/inventory-management',
        element: <InventoryManagement />,
      },
    ],
  },

  {
    path: '/user-signup',
    element: (
      <AdminRoute>
        <UserSignUp />
      </AdminRoute>
    ),
  },
  {
    path: '/user-signup-have-account',
    element: (
      <AdminRoute>
        <UserSignUpUserAlreadyHave />
      </AdminRoute>
    ),
  },
  {
    path: '/user-smokeBot',
    element: (
      <AdminRoute>
        <UserDashboardHome />
      </AdminRoute>
    ),
  },

  {
    path: '/sign-up',
    element: <SignUp />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/forget-password',
    element: <ForgetPassword />,
  },
  {
    path: '/verify-code',
    element: <VerifyCode />,
  },
  {
    path: '/signup-verify-code',
    element: <SignUpVerifyCode />,
  },
  {
    path: '/reset-password',
    element: <SetNewPassword />,
  },

  {
    path: '/packages',
    element: <Packages />,
  },
])
export default router
