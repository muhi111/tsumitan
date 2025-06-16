import type { ComponentType } from 'react';

export interface RouteConfig {
  path: string;
  component: ComponentType;
  requireAuth?: boolean;
  showHeader?: boolean;
}
