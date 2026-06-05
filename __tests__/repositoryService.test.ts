import {
  buildFileTree,
  createRepoId,
  parseRepoName,
} from '../src/services/fileTree';

describe('repositoryService helpers', () => {
  it('parses repository names from git urls', () => {
    expect(parseRepoName('https://github.com/facebook/react.git')).toBe('react');
    expect(parseRepoName('https://github.com/org/repo/')).toBe('repo');
  });

  it('creates stable-looking repo ids', () => {
    const id = createRepoId('Hello World');
    expect(id.startsWith('hello-world-')).toBe(true);
  });

  it('builds a nested file tree from flat paths', () => {
    const tree = buildFileTree({
      'src/index.ts': 'export {}',
      'src/utils/math.ts': 'export const add = (a: number, b: number) => a + b;',
      'README.md': '# Kiri',
    });

    expect(tree).toHaveLength(2);
    expect(tree[0].name).toBe('src');
    expect(tree[1].name).toBe('README.md');
    expect(tree[0].children).toHaveLength(2);
  });
});
