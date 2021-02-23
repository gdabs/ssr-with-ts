const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const clientConfig = require('./webpack.config.client');
const cwd = process.env.BASE_CWD || process.cwd();

const PORT = process.env.FE_PORT || 8000;
const compiler = webpack(clientConfig);
const server = new WebpackDevServer(
  compiler,
  Object.assign(
    {
      stats: {
        assets: true, // 添加资源信息
        cachedAssets: false, // 显示缓存的资源（将其设置为 `false` 则仅显示输出的文件）
        children: false, // 添加 children 信息
        chunks: false, // 添加 chunk 信息（设置为 `false` 能允许较少的冗长输出）
        colors: true, // 以不同颜色区分构建信息
        modules: false, // 添加构建模块信息
        warnings: false,
        entrypoints: false,
      },
      disableHostCheck: true,
      publicPath: clientConfig.output.publicPath || '/',
      host: '0.0.0.0',
      sockPort: PORT,
      contentBase: cwd + '/dist',
      hot: true,
      port: PORT,
      clientLogLevel: 'warning',
      headers: {
        'access-control-allow-origin': '*',
      },
      proxy: {
        '/api': 'http://localhost:7001',
      },
    },
    clientConfig.devServer
  )
);
server.listen(PORT, '0.0.0.0', err => {
  if (err) {
    throw err;
  }
  process.send && process.send({ msg: 'start dev finish' });
});
