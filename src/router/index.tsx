import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import SignInPage from "../pages/auth/SignInPage.tsx";
import SignUpPage from "../pages/auth/SignUpPage.tsx";
import ProtectedPage from "../pages/ProtectedPage.tsx";
import AIChatPage from "../pages/AIChatPage.tsx";
import NotFoundPage from "../pages/404Page.tsx";
import AuthProtectedRoute from "./AuthProtectedRoute.tsx";
import RoleProtectedRoute from "./RoleProtectedRoute.tsx";
import UserDashboard from "../pages/dashboard/UserDashboard.tsx";
import AdminDashboard from "../pages/dashboard/AdminDashboard.tsx";
import SuperAdminDashboard from "../pages/dashboard/SuperAdminDashboard.tsx";
import ProfileSettingsPage from "../pages/settings/ProfileSettingsPage.tsx";
import Providers from "../Providers.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Providers />,
    children: [
      // Public routes
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/auth/sign-in",
        element: <SignInPage />,
      },
      {
        path: "/auth/sign-up",
        element: <SignUpPage />,
      },
      {
        path: "/ai-chat",
        element: <AIChatPage />,
      },
      // Auth Protected routes
      {
        path: "/",
        element: <AuthProtectedRoute />,
        children: [
          {
            path: "/protected",
            element: <ProtectedPage />,
          },
        ],
      },
      // Settings (all authenticated roles)
      {
        path: "/",
        element: <RoleProtectedRoute allowedRoles={["user", "admin", "super_admin"]} />,
        children: [
          {
            path: "/settings/profile",
            element: <ProfileSettingsPage />,
          },
        ],
      },
      // Role-based dashboard routes
      {
        path: "/",
        element: <RoleProtectedRoute allowedRoles={["user", "admin", "super_admin"]} />,
        children: [
          {
            path: "/dashboard",
            element: <UserDashboard />,
          },
        ],
      },
      {
        path: "/",
        element: <RoleProtectedRoute allowedRoles={["admin", "super_admin"]} />,
        children: [
          {
            path: "/admin/dashboard",
            element: <AdminDashboard />,
          },
        ],
      },
      {
        path: "/",
        element: <RoleProtectedRoute allowedRoles={["super_admin"]} />,
        children: [
          {
            path: "/super-admin/dashboard",
            element: <SuperAdminDashboard />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
