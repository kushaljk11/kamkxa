import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from '@/router/ProtectedRoute';

import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';

import { MyDayPage } from '@/pages/MyDayPage';
import { TasksPage } from '@/pages/TasksPage';
import { InboxPage } from '@/pages/InboxPage';
import { CalendarPage } from '@/pages/CalendarPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { BoardPage } from '@/pages/BoardPage';
import { ProductivityPage } from '@/pages/ProductivityPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { DesignSystemShowcasePage } from '@/pages/DesignSystemShowcasePage';

export const router = createBrowserRouter([
  // Public Authentication Routes (no dashboard sidebar)
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
    ],
  },

  // Protected Dashboard Application Routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/my-day" replace />,
          },
          {
            path: 'my-day',
            element: <MyDayPage />,
          },
          {
            path: 'tasks',
            element: <TasksPage />,
          },
          {
            path: 'inbox',
            element: <InboxPage />,
          },
          {
            path: 'calendar',
            element: <CalendarPage />,
          },
          {
            path: 'projects',
            element: <ProjectsPage />,
          },
          {
            path: 'board',
            element: <BoardPage />,
          },
          {
            path: 'productivity',
            element: <ProductivityPage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
          },
          {
            path: 'notifications',
            element: <NotificationsPage />,
          },
          {
            path: 'design-system',
            element: <DesignSystemShowcasePage />,
          },
        ],
      },
    ],
  },

  // Catch-all route
  {
    path: '*',
    element: <Navigate to="/my-day" replace />,
  },
]);
