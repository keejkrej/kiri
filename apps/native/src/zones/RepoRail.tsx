import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';

import {repoInitials} from '@kiri/domain';

import {useRepository} from '../store/RepositoryContext';
import {theme} from '../theme';

type Props = {
  onClonePress: () => void;
};

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
    width: 72,
    backgroundColor: theme.inkRaised,
    borderRightWidth: 1,
    borderRightColor: theme.border,
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  header: {
    color: theme.parchment,
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
    backgroundColor: theme.inkMuted,
    borderWidth: 1,
    borderColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  repoButtonActive: {
    borderColor: theme.copper,
    backgroundColor: '#b8733322',
  },
  repoInitials: {
    color: theme.fog,
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
