'use strict';

const path = require('path');
const fs = require('fs');

function getPublicUrlOrPath(isEnvDevelopment, homepage, envPublicUrl) {
  if (envPublicUrl) {
    // ensure last slash exists
    return envPublicUrl.endsWith('/') ? envPublicUrl : envPublicUrl + '/';
  }

  if (!isEnvDevelopment && homepage) {
    // strip last slash if exists
    return homepage.endsWith('/') ? homepage : homepage + '/';
  }

  return '/';
}

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  require(resolveApp('package.json')).homepage,
  process.env.PUBLIC_URL
);

const moduleFileExtensions = ['js', 'ts', 'tsx', 'json', 'jsx'];

// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp('env/.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('dist'),
  appPublic: resolveApp('app/public'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  entry: resolveApp('src/entry'),
  layout: resolveApp('src/layout'),
  swSrc: resolveApp('src/service-worker'),
  appNodeModules: resolveApp('node_modules'),
  resolveApp: resolveApp,
  publicUrlOrPath,
};

module.exports.moduleFileExtensions = moduleFileExtensions;
