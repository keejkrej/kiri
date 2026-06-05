const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(projectRoot);

const config = {
  watchFolders: [workspaceRoot],
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, 'html'],
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
    ],
    extraNodeModules: {
      buffer: require.resolve('buffer'),
      stream: require.resolve('readable-stream'),
      events: require.resolve('events'),
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
