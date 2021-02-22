import React from 'react';
import serialize from 'serialize-javascript';
import '@/assets/common.less';
import { LayoutProps } from '@/types/layout.d.ts';

import './index.less';

// 为了同时兼容ssr/csr请保留此判断，如果你的layout没有内容请使用 props.children ?  props.children  : ''
const commonNode = (props: LayoutProps) => (props.children ? props.children : null);

const Layout: SFC<LayoutProps> = (props: LayoutProps): JSX.Element | null => {
  if (__isBrowser__) {
    return commonNode(props);
  } else {
    const serverData = props.layoutData;
    const { url } = props;
    const { injectCss, injectScript } = props.ssrConfig;
    const chunkName = url ? url.split('/')[1] : '';
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
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__USE_SSR__=true;window.__INITIAL_DATA__ =${serialize(serverData)}`,
            }}
          />
          <div dangerouslySetInnerHTML={{ __html: injectScript && injectScript.join('') }} />
        </body>
      </html>
    );
  }
};

export default Layout;
