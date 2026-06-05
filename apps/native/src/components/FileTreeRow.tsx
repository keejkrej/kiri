import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import type {FileTreeNode} from '../types/repository';

type Props = {
  node: FileTreeNode;
  depth: number;
  onSelectFile: (path: string) => void;
};

export function FileTreeRow({node, depth, onSelectFile}: Props) {
  const [expanded, setExpanded] = useState(depth < 2);

  if (node.type === 'file') {
    return (
      <Pressable
        style={[styles.row, {paddingLeft: 12 + depth * 16}]}
        onPress={() => onSelectFile(node.path)}>
        <Text style={styles.fileIcon}>📄</Text>
        <Text style={styles.label} numberOfLines={1}>
          {node.name}
        </Text>
      </Pressable>
    );
  }

  return (
    <View>
      <Pressable
        style={[styles.row, {paddingLeft: 12 + depth * 16}]}
        onPress={() => setExpanded((value) => !value)}>
        <Text style={styles.chevron}>{expanded ? '▾' : '▸'}</Text>
        <Text style={styles.folderIcon}>📁</Text>
        <Text style={styles.label} numberOfLines={1}>
          {node.name}
        </Text>
      </Pressable>
      {expanded &&
        node.children?.map((child) => (
          <FileTreeRow
            key={child.path}
            node={child}
            depth={depth + 1}
            onSelectFile={onSelectFile}
          />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2d333b',
  },
  chevron: {
    width: 12,
    color: '#8b949e',
    fontSize: 12,
  },
  folderIcon: {
    fontSize: 14,
  },
  fileIcon: {
    fontSize: 14,
    marginLeft: 12,
  },
  label: {
    flex: 1,
    color: '#e6edf3',
    fontSize: 14,
  },
});
