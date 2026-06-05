import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';

import {useRepository} from '../store/RepositoryContext';

type Props = {
  onClonePress: () => void;
};

function repoInitials(name: string): string {
  const parts = name.split(/[-_]/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function RepoRail({onClonePress}: Props) {
  const {state, selectRepository} = useRepository();

  return (
    <View style={styles.container}>
        <Text style={styles.header}>KIRI</Text>
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}>
          {state.repositories.map((repo) => {
            const isActive = repo.id === state.activeRepoId;
            return (
              <Pressable
                key={repo.id}
                style={[styles.repoButton, isActive && styles.repoButtonActive]}
                onPress={() => selectRepository(repo.id)}>
                <Text style={styles.repoInitials}>{repoInitials(repo.name)}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <Pressable
          style={styles.addButton}
          onPress={onClonePress}
          accessibilityLabel="Clone repository">
          <Text style={styles.addLabel}>+</Text>
        </Pressable>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 70,
    backgroundColor: '#010409',
    borderRightWidth: 1,
    borderRightColor: '#21262d',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  header: {
    color: '#8b949e',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    transform: [{rotate: '-90deg'}],
    marginBottom: 8,
  },
  list: {
    gap: 10,
    alignItems: 'center',
    paddingBottom: 8,
  },
  repoButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  repoButtonActive: {
    borderColor: '#58a6ff',
    backgroundColor: '#1f6feb22',
  },
  repoInitials: {
    color: '#e6edf3',
    fontSize: 14,
    fontWeight: '700',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#21262d',
    borderWidth: 1,
    borderColor: '#30363d',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  addLabel: {
    color: '#e6edf3',
    fontSize: 24,
    lineHeight: 26,
  },
});
