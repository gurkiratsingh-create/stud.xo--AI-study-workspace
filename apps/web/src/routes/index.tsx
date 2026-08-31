import { Navigate, createBrowserRouter } from "react-router-dom";

import RootLayout from "@/app/layouts/RootLayout";
import AuthLayout from "@/app/layouts/AuthLayout";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import ProtectedRoute from "@/app/guards/ProtectedRoute";

import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";

import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import ChatPage from "@/features/chat/pages/ChatPage";
import DocumentsPage from "@/features/documents/pages/DocumentsPage";
import NotesPage from "@/features/notes/pages/NotesPage";
import ResearchPage from "@/features/research/pages/ResearchPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // ==========================================
      // DEFAULT ROUTE
      // ==========================================

      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },

      // ==========================================
      // AUTHENTICATION ROUTES
      // ==========================================

      {
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
          {
            path: "register",
            element: <RegisterPage />,
          },
        ],
      },

      // ==========================================
      // PROTECTED APPLICATION ROUTES
      // ==========================================

      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: "dashboard",
                element: <DashboardPage />,
              },
              {
                path: "chat",
                element: <ChatPage />,
              },
              {
                path: "documents",
                element: <DocumentsPage />,
              },
              {
                path: "notes",
                element: <NotesPage />,
              },
              {
                path: "research",
                element: <ResearchPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);