import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

import {FileTreeRow} from '../components/FileTreeRow';
import {buildFileTree} from '../services/repositoryService';
import {useRepository} from '../store/RepositoryContext';

export function FileTreePanel() {
  const {activeRepository, selectFile, state} = useRepository();

  const tree = useMemo(() => {
    if (!activeRepository) {
      return [];
    }
    return buildFileTree(activeRepository.files);
  }, [activeRepository]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {activeRepository ? activeRepository.name : 'File Tree'}
      </Text>
      {!state.isHydrated ? (
        <Text style={styles.empty}>Loading repositories…</Text>
      ) : !activeRepository ? (
        <Text style={styles.empty}>Clone a repository to browse files.</Text>
      ) : tree.length === 0 ? (
        <Text style={styles.empty}>No indexable text files found.</Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {tree.map((node) => (
            <FileTreeRow
              key={node.path}
              node={node}
              depth={0}
              onSelectFile={selectFile}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 260,
    backgroundColor: '#0d1117',
    borderRightWidth: 1,
    borderRightColor: '#21262d',
  },
  title: {
    color: '#f0f6fc',
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#21262d',
  },
  empty: {
    color: '#8b949e',
    fontSize: 13,
    padding: 16,
    lineHeight: 20,
  },
});
