/* eslint-env jest */

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
}));

jest.mock('isomorphic-git', () => ({
  __esModule: true,
  default: {
    clone: jest.fn(),
  },
}));

jest.mock('isomorphic-git/http/web', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('react-native-webview', () => ({
  WebView: 'WebView',
}));
