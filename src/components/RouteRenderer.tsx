import type React from 'react';
import type { RouteConfig } from '../types/route';
import AuthGuard from './AuthGuard';
import Layout from './Layout';

interface RouteRendererProps {
  route: RouteConfig;
  showHeader: boolean;
}

export const createRouteElement = ({
  route,
  showHeader
}: RouteRendererProps): React.ReactElement => {
  const { component: Component, requireAuth = false } = route;

  const content = requireAuth ? (
    <AuthGuard requireAuth={true}>
      <Component />
    </AuthGuard>
  ) : (
    <Component />
  );

  return <Layout showHeader={showHeader}>{content}</Layout>;
};
