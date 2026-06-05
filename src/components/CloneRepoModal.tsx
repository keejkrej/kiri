import React, {useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {useRepository} from '../store/RepositoryContext';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function CloneRepoModal({visible, onClose}: Props) {
  const {cloneRepo, state} = useRepository();
  const [url, setUrl] = useState('');
  const isBusy =
    state.cloneStatus === 'cloning' || state.cloneStatus === 'indexing';

  if (!visible) {
    return null;
  }

  const handleClone = async () => {
    try {
      await cloneRepo(url);
      setUrl('');
      onClose();
    } catch {
      // Error state is surfaced via context.
    }
  };

  const statusLabel =
    state.cloneStatus === 'cloning'
      ? 'Cloning repository…'
      : state.cloneStatus === 'indexing'
        ? 'Indexing files…'
        : null;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable onPress={() => undefined}>
          <View style={styles.card}>
            <Text style={styles.title}>Clone Repository</Text>
            <Text style={styles.subtitle}>
              Enter a public git URL. Files are stored in virtual sandbox storage.
            </Text>
            <TextInput
              value={url}
              onChangeText={setUrl}
              placeholder="https://github.com/org/repo.git"
              placeholderTextColor="#6e7681"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              style={styles.input}
              editable={!isBusy}
            />
            {statusLabel ? (
              <View style={styles.statusRow}>
                <ActivityIndicator color="#58a6ff" size="small" />
                <Text style={styles.statusText}>{statusLabel}</Text>
              </View>
            ) : null}
            {state.cloneError ? (
              <Text style={styles.errorText}>{state.cloneError}</Text>
            ) : null}
            <View style={styles.actions}>
              <Pressable
                style={[styles.button, styles.secondaryButton]}
                onPress={onClose}
                disabled={isBusy}>
                <Text style={styles.secondaryLabel}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.button,
                  styles.primaryButton,
                  isBusy && styles.disabled,
                ]}
                onPress={handleClone}
                disabled={isBusy || url.trim().length === 0}>
                <Text style={styles.primaryLabel}>Clone</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(1, 4, 9, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#161b22',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#30363d',
    gap: 12,
  },
  title: {
    color: '#f0f6fc',
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    color: '#8b949e',
    fontSize: 13,
    lineHeight: 18,
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#e6edf3',
    backgroundColor: '#0d1117',
    fontSize: 14,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    color: '#8b949e',
    fontSize: 13,
  },
  errorText: {
    color: '#f85149',
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 4,
  },
  button: {
    minHeight: 40,
    minWidth: 88,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  primaryButton: {
    backgroundColor: '#238636',
  },
  secondaryButton: {
    backgroundColor: '#21262d',
    borderWidth: 1,
    borderColor: '#30363d',
  },
  disabled: {
    opacity: 0.5,
  },
  primaryLabel: {
    color: '#ffffff',
    fontWeight: '600',
  },
  secondaryLabel: {
    color: '#e6edf3',
  },
});
