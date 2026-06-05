import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {CloneRepoModal} from '../components/CloneRepoModal';
import {RepositoryProvider} from '../store/RepositoryContext';
import {CodeCanvas} from '../zones/CodeCanvas';
import {FileTreePanel} from '../zones/FileTreePanel';
import {RepoRail} from '../zones/RepoRail';

function WorkspaceGrid() {
  const [cloneModalVisible, setCloneModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.workspaceHeader}>
        <Text style={styles.workspaceTitle}>KIRI WORKSPACE</Text>
      </View>
      <View style={styles.grid}>
        <RepoRail onClonePress={() => setCloneModalVisible(true)} />
        <FileTreePanel />
        <CodeCanvas />
      </View>
      <CloneRepoModal
        visible={cloneModalVisible}
        onClose={() => setCloneModalVisible(false)}
      />
    </SafeAreaView>
  );
}

export function WorkspaceLayout() {
  return (
    <RepositoryProvider>
      <WorkspaceGrid />
    </RepositoryProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#010409',
    position: 'relative',
  },
  workspaceHeader: {
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#21262d',
    backgroundColor: '#010409',
  },
  workspaceTitle: {
    color: '#8b949e',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
  },
});
