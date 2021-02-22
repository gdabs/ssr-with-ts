const global = {};
const renderToStream = async (req, config) => {
  const { serverJs, baseDir, useReactToString } = config;
  const BASE_DIR = baseDir || process.cwd();
  const isLocal = process.env.NODE_ENV === 'development' || config.env === 'local'; // 标志非正式环境
  let SEVER_JS = serverJs;

  if (isLocal && typeof SEVER_JS === 'string') {
    // 本地开发环境下每次刷新的时候清空require服务端文件的缓存，保证服务端与客户端渲染结果一致
    delete require.cache[SEVER_JS];
  }

  if (!global.renderToNodeStream) {
    // for this issue https://github.com/ykfe/egg-react-ssr/issues/4
    if (useReactToString) {
      global.renderToNodeStream = require(BASE_DIR + '/node_modules/react-dom/server').renderToString;
    } else {
      global.renderToNodeStream = require(BASE_DIR + '/node_modules/react-dom/server').renderToNodeStream;
    }
  }

  const serverComponent = typeof SEVER_JS === 'string' ? await require(SEVER_JS).default(req) : await SEVER_JS(req);
  const stream = global.renderToNodeStream(serverComponent);

  return stream;

};

module.exports = renderToStream;
