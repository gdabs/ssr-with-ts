import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, StaticRouter, Route, Switch } from 'react-router-dom';
import getWrappedComponent, { getComponent, preloadComponent } from './layout/getComponent';
import defaultLayout from './layout';
import { RouteItem, Request, Config } from '@/types/layout.d.ts';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ssrConfig: Config = require('../config/config.ssr');

const { routes } = ssrConfig;

const clientRender = async (): Promise<void> => {
  const clientRoutes = await preloadComponent(routes, ssrConfig);
  // 客户端渲染||hydrate
  ReactDOM[window.__USE_SSR__ ? 'hydrate' : 'render'](
    <BrowserRouter>
      <Switch>
        {
          // 使用高阶组件getWrappedComponent使得csr首次进入页面以及csr/ssr切换路由时调用getInitialProps
          clientRoutes.map((item: RouteItem) => {
            const activeComponent = item.Component();
            const Layout = activeComponent.Layout || defaultLayout;
            const WrappedComponent = getWrappedComponent(activeComponent);
            return (
              <Route
                exact={item.exact}
                key={item.path}
                path={item.path}
                render={() => (
                  <Layout key={window.location.pathname}>
                    <WrappedComponent />
                  </Layout>
                )}
              />
            );
          })
        }
      </Switch>
    </BrowserRouter>,
    document.getElementById('app')
  );
  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept();
  }
};

const serverRender = async (req: Request): Promise<JSX.Element> => {
  // 服务端渲染 根据req.path获取请求的具体组件，调用getInitialProps并渲染
  const ActiveComponent = getComponent(routes, req.path)();
  const Layout = ActiveComponent.Layout || defaultLayout;
  const getInitialProps = ActiveComponent.getInitialProps;
  const serverData = ActiveComponent.getInitialProps ? await getInitialProps(req) : {};
  return (
    <StaticRouter location={req.url} context={serverData}>
      <Layout layoutData={serverData} ssrConfig={ssrConfig} url={req.path}>
        <ActiveComponent {...serverData} />
      </Layout>
    </StaticRouter>
  );
};

export default __isBrowser__ ? clientRender() : serverRender;
