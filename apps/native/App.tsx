import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {WorkspaceLayout} from './src/layout/WorkspaceLayout';

function App() {
  return (
    <SafeAreaProvider style={styles.root}>
      <StatusBar barStyle="light-content" />
      <WorkspaceLayout />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0b0f',
  },
});

export default App;
