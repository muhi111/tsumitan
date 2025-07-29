import HomePage from '../pages/HomePage';
import LearnPage from '../pages/LearnPage';
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
  }
];

// Helper function to get all paths that should show header
export const getHeaderPaths = (): string[] => {
  return routes.filter((route) => route.showHeader).map((route) => route.path);
};
