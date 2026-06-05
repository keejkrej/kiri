import React, {useEffect, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {WebView} from 'react-native-webview';

import {SHIKI_VIEWER_HTML} from '../assets/shikiViewerHtml';
import {languageFromPath} from '../services/languageFromPath';
import {useRepository} from '../store/RepositoryContext';

export function CodeCanvas() {
  const {activeRepository, activeFileContent, state} = useRepository();
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    if (!state.activeFilePath || activeFileContent == null) {
      return;
    }

    const payload = JSON.stringify({
      type: 'render',
      code: activeFileContent,
      lang: languageFromPath(state.activeFilePath),
      filename: state.activeFilePath,
    });

    webViewRef.current?.postMessage(payload);
  }, [activeFileContent, state.activeFilePath]);

  const hasFile =
    !!state.activeFilePath && activeFileContent != null && !!activeRepository;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.lock}>🔒</Text>
        <Text style={styles.filename} numberOfLines={1}>
          {hasFile ? state.activeFilePath : 'Immutable Code Canvas'}
        </Text>
      </View>
      {hasFile ? (
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{html: SHIKI_VIEWER_HTML}}
          style={styles.webview}
          javaScriptEnabled
          domStorageEnabled
          scrollEnabled
          keyboardDisplayRequiresUserAction
          hideKeyboardAccessoryView
          dataDetectorTypes="none"
          onLoadEnd={() => {
            if (!state.activeFilePath || activeFileContent == null) {
              return;
            }
            const payload = JSON.stringify({
              type: 'render',
              code: activeFileContent,
              lang: languageFromPath(state.activeFilePath),
              filename: state.activeFilePath,
            });
            webViewRef.current?.postMessage(payload);
          }}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Read-only canvas</Text>
          <Text style={styles.emptyBody}>
            Select a source file from the tree to view highlighted code.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  header: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#21262d',
  },
  lock: {
    fontSize: 14,
  },
  filename: {
    flex: 1,
    color: '#f0f6fc',
    fontSize: 14,
    fontWeight: '600',
  },
  webview: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
  },
  emptyTitle: {
    color: '#f0f6fc',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyBody: {
    color: '#8b949e',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
