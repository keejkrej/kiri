import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {CloneRepoModal} from '../components/CloneRepoModal';
import {RepositoryProvider} from '../store/RepositoryContext';
import {theme} from '../theme';
import {CodeCanvas} from '../zones/CodeCanvas';
import {FileTreePanel} from '../zones/FileTreePanel';
import {RepoRail} from '../zones/RepoRail';

function WorkspaceGrid() {
  const [cloneModalVisible, setCloneModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.workspaceHeader}>
        <Text style={styles.workspaceTitle}>KIRI</Text>
        <Text style={styles.workspaceSubtitle}>Repository topography</Text>
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
    backgroundColor: theme.ink,
    position: 'relative',
  },
  workspaceHeader: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    backgroundColor: theme.ink,
  },
  workspaceTitle: {
    color: theme.parchment,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3,
  },
  workspaceSubtitle: {
    color: theme.mist,
    fontSize: 11,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
  },
});
