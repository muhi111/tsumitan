import AuthPage from '../pages/AuthPage';
import HomePage from '../pages/HomePage';
import LearnPage from '../pages/LearnPage';
import ProfilePage from '../pages/ProfilePage';
import type { RouteConfig } from '../types/route';

export const routes: RouteConfig[] = [
  {
    path: '/home',
    component: HomePage,
    showHeader: true
  },
  {
    path: '/learn',
    component: LearnPage,
    showHeader: true
  },
  {
    path: '/profile',
    component: ProfilePage,
    requireAuth: true,
    showHeader: true
  },
  {
    path: '/auth',
    component: AuthPage,
    showHeader: true
  }
];

// Helper function to get all paths that should show header
export const getHeaderPaths = (): string[] => {
  return routes.filter((route) => route.showHeader).map((route) => route.path);
};
