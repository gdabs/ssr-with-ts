export { Request } from 'express';

export interface ServerJs {
  (req: Request): Promise<React.ReactElement>;
}

export interface Config {
  baseDir?: string;
  baseName?: string;
  type?: string;
  serverJs: ServerJs | string;
  layout: ServerJs | string;
  env?: string;
  useCDN?: string;
  isRax?: boolean;
  useReactToString?: boolean;
  routes: RouteItem[];
  injectScript: string[];
  injectCss: string[];
}

export type LayoutProps = {
  layoutData?: any;
  ssrConfig?: Config;
  url?: string;
  children?: JSX.Element | null;
};
interface Preload {
  default: React.FC;
}

export interface FC extends React.FC<any> {
  getInitialProps?: (params: any, store: any) => Promise<any>;
  Layout?: React.FC<LayoutProps>;
  preload?: () => Promise<Preload>;
}

export interface RouteItem {
  path: string;
  exact?: boolean;
  Component: () => FC;
}
