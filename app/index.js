const path = require('path');
const http = require('http');
const logger = require('morgan');
const request = require('request');
const qs = require('qs');
const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const renderToStream = require('./renderToStream')

const resolvePath = (filePath) => path.resolve(__dirname, filePath);

const ssrConfig = require('../config/config.ssr');

const { routes, useReactToString, serverPort } = ssrConfig;

const app = express();
app.use(compression());
app.use(express.static(resolvePath('../dist')));
app.use(cookieParser());

app.use(logger('dev'));

process.env.NODE_ENV === 'development' && app.use(/(\/static)|(\/sockjs-node)|(\/__webpack_dev_server__)|(.*\.hot-update)/, createProxyMiddleware({
  target: 'http://127.0.0.1:8000',
  changeOrigin: true,
}));


routes.map((item) => {
  app.get(item.path, async(req, res, next) => {
    if (item.handler) {
      item.handler(req, res, next);
    }
    try {
      res.status(200)
      res.set('Content-Type','text/html');
      const stream = await renderToStream(req, ssrConfig);
       if (useReactToString) {
        res.write('<!DOCTYPE html>'+stream);
        res.end();
      } else {
        res.write('<!DOCTYPE html>');
        stream.pipe(res, { end: false });
        stream.on('end', () => {
          res.end();
        });
      }
    } catch (error) {
      console.log('Page Controller renderToStream Error' + error);
    }
    
  })
});

app.get('/', (req, res) => {
  res.send('codemao');
});

const server = http.createServer(app);

server.listen(serverPort, () => {
  console.log('Listening on %j', serverPort);
});