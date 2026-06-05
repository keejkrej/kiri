export const SHIKI_VIEWER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background: #0d1117;
      color: #e6edf3;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      overflow: auto;
      user-select: text;
      -webkit-user-select: text;
    }
    #status {
      padding: 12px 16px;
      color: #8b949e;
      font-size: 13px;
    }
    #code {
      padding: 0 16px 24px;
      line-height: 1.5;
      font-size: 13px;
      caret-color: transparent;
    }
    #code pre {
      margin: 0;
      white-space: pre;
      overflow-x: auto;
    }
    #code code {
      font-family: inherit;
    }
    .shiki {
      background-color: transparent !important;
    }
    :focus { outline: none; }
  </style>
</head>
<body>
  <div id="status">Waiting for file…</div>
  <div id="code"></div>
  <script>
    const EXT_LANG = {
      ts: 'typescript', tsx: 'tsx', js: 'javascript', jsx: 'jsx', json: 'json',
      md: 'markdown', py: 'python', rs: 'rust', go: 'go', swift: 'swift',
      css: 'css', scss: 'scss', html: 'html', yaml: 'yaml', yml: 'yaml',
      sql: 'sql', sh: 'bash', rb: 'ruby', php: 'php', c: 'c', cpp: 'cpp',
      cs: 'csharp', vue: 'vue', svelte: 'svelte'
    };

    let highlighter = null;
    let highlighterReady = false;

    function langFromFilename(filename, fallback) {
      const ext = (filename || '').split('.').pop()?.toLowerCase() || '';
      return EXT_LANG[ext] || fallback || 'text';
    }

    function escapeHtml(value) {
      return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    function renderFallback(code, lang) {
      document.getElementById('status').textContent = lang + ' (plain)';
      document.getElementById('code').innerHTML =
        '<pre><code>' + escapeHtml(code) + '</code></pre>';
    }

    async function ensureHighlighter() {
      if (highlighterReady) return highlighter;
      document.getElementById('status').textContent = 'Loading highlighter…';
      const shiki = await import('https://esm.sh/shiki@3');
      highlighter = await shiki.createHighlighter({
        themes: ['github-dark-default'],
        langs: [
          'typescript', 'tsx', 'javascript', 'jsx', 'json', 'markdown', 'python',
          'rust', 'go', 'swift', 'css', 'html', 'yaml', 'bash', 'ruby', 'text'
        ],
      });
      highlighterReady = true;
      return highlighter;
    }

    async function renderCode(payload) {
      const code = payload.code || '';
      const filename = payload.filename || '';
      const lang = payload.lang || langFromFilename(filename, 'text');
      document.getElementById('status').textContent = filename || lang;

      try {
        const hl = await ensureHighlighter();
        const html = hl.codeToHtml(code, {
          lang,
          theme: 'github-dark-default',
        });
        document.getElementById('code').innerHTML = html;
      } catch (error) {
        renderFallback(code, lang);
      }
    }

    function handleMessage(event) {
      let payload = event.data;
      if (typeof payload === 'string') {
        try { payload = JSON.parse(payload); } catch { return; }
      }
      if (!payload || payload.type !== 'render') return;
      renderCode(payload);
    }

    document.addEventListener('message', handleMessage);
    window.addEventListener('message', handleMessage);

    ['keydown', 'paste', 'input', 'beforeinput'].forEach((eventName) => {
      document.addEventListener(eventName, (event) => event.preventDefault(), true);
    });

    document.addEventListener('focusin', (event) => {
      if (event.target && event.target !== document.body) {
        event.target.blur();
      }
    });
  </script>
</body>
</html>`;
