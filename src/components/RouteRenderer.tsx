import type React from 'react';
import type { RouteConfig } from '../types/route';
import Layout from './Layout';

interface RouteRendererProps {
  route: RouteConfig;
  showHeader: boolean;
}

export const createRouteElement = ({
  route,
  showHeader
}: RouteRendererProps): React.ReactElement => {
  const { component: Component } = route;

  return (
    <Layout showHeader={showHeader}>
      <Component />
    </Layout>
  );
};
