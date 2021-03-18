import React, { Fragment } from 'react';
import serialize from 'serialize-javascript';
import { matchPath } from 'react-router-dom';
import { LayoutProps } from '@/types/layout.d';
import Header from '@/components/Header';
import '@/assets/common.less';

import './index.less';

// 为了同时兼容ssr/csr请保留此判断，如果你的layout没有内容请使用 props.children ?  props.children  : ''
const commonNode = (props: LayoutProps) =>
  props.children ? (
    <Fragment>
      {!props.noheader && <Header />}
      <div className="layoutContainer" style={{ paddingTop: !props.noheader ? 58 : 0 }}>
        {props.children}
      </div>
    </Fragment>
  ) : null;

const Layout: SFC<LayoutProps> = (props: LayoutProps): JSX.Element | null => {
  if (__isBrowser__) {
    return commonNode(props);
  } else {
    const serverData = props.layoutData;
    const { url } = props;
    const { injectCss, injectScript, routes } = props.ssrConfig;
    const activeRoute = routes.find(route => matchPath(url, route) && route.loadable);
    const chunkName = activeRoute ? activeRoute.path.split('/')[1] : '';
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <title>React App</title>
          <link rel="icon" href="//static.codemao.cn/whitef/favicon.ico" type="image/x-icon" />
          {injectCss &&
            injectCss.map((item: string) => <link rel="stylesheet" href={item} key={item} />)}

          {chunkName && chunkName ? (
            <link rel="stylesheet" href={`/static/css/${chunkName}.chunk.css`} />
          ) : (
            ''
          )}
        </head>
        <body>
          {/* https://github.com/facebook/react/issues/10879 */}
          <div id="app">{commonNode(props)}</div>
          {serverData && (
            <script
              dangerouslySetInnerHTML={{
                __html: `window.__USE_SSR__=true;window.__INITIAL_DATA__ =${serialize(serverData)}`,
              }}
            />
          )}
          <div dangerouslySetInnerHTML={{ __html: injectScript && injectScript.join('') }} />
        </body>
      </html>
    );
  }
};

export default Layout;
