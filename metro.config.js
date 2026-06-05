const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, 'html'],
    extraNodeModules: {
      buffer: require.resolve('buffer'),
      stream: require.resolve('readable-stream'),
      events: require.resolve('events'),
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
