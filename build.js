// Gera:
//   dist/recash-wordpress.html  -> bloco para colar no WordPress (Bloco "HTML personalizado")
//   dist/preview.html           -> página completa só para testar no navegador
// Uso: node build.js
const fs = require('fs');
const path = require('path');

const read = (f) => fs.readFileSync(path.join(__dirname, 'src', f), 'utf8');
const css = read('recash.css');
const html = read('recash.html');
const js = read('recash.js');

/* ---------- CSS: prefixa seletores com #recash e minifica ---------- */
const stripCssComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '');

function prefixSelector(list) {
  return list
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      if (/^(html|body)\b/.test(s)) return s;
      if (s.startsWith('.rc-root')) return '#recash' + s.slice('.rc-root'.length);
      return '#recash ' + s;
    })
    .join(',');
}

const squash = (s) => s.replace(/\s+/g, ' ').replace(/\s*([{};,>])\s*/g, '$1').replace(/;}/g, '}').replace(/;$/, '').trim();

function processCss(src) {
  const out = [];
  let i = 0;
  while (i < src.length) {
    while (i < src.length && /\s/.test(src[i])) i++;
    if (i >= src.length) break;
    if (src.startsWith('@import', i)) {
      const end = src.indexOf(';', src.indexOf(')', i));
      out.push(src.slice(i, end + 1).replace(/\s+/g, ' '));
      i = end + 1;
      continue;
    }
    const open = src.indexOf('{', i);
    const prelude = src.slice(i, open).trim();
    let depth = 1;
    let j = open + 1;
    while (depth > 0) {
      if (src[j] === '{') depth++;
      else if (src[j] === '}') depth--;
      j++;
    }
    const body = src.slice(open + 1, j - 1);
    i = j;
    if (/^@(media|supports)/.test(prelude)) {
      out.push(prelude.replace(/\s+/g, ' ') + '{\n' + processCss(body) + '\n}');
    } else if (prelude.startsWith('@')) {
      out.push(squash(prelude + '{' + body + '}'));
    } else {
      out.push(prefixSelector(prelude) + '{' + squash(body) + '}');
    }
  }
  return out.join('\n');
}

const finalCss = processCss(stripCssComments(css));

/* ---------- HTML: sem comentários, sem indentação, sem linhas em branco ---------- */
const finalHtml = html
  .replace(/<!--[\s\S]*?-->/g, '')
  .split('\n')
  .map((l) => l.trim())
  .filter(Boolean)
  .join('\n');

/* ---------- JS: sem comentários de linha, sem linhas em branco ---------- */
const finalJs = js
  .split('\n')
  .filter((l) => !/^\s*\/\//.test(l))
  .map((l) => l.replace(/^\s+/, ''))
  .filter(Boolean)
  .join('\n');

const fragment = `<style>\n${finalCss}\n</style>\n${finalHtml}\n<script>\n${finalJs}\n</script>\n`;

fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'dist', 'recash-wordpress.html'), fragment, 'utf8');

const preview = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ReCash - Inteligência Financeira (preview)</title>
<style>
/* Simula um tema qualquer do WordPress (conteúdo estreito e estilos globais) para provar que o bloco não sofre interferência */
body{margin:0;font-family:Georgia,serif;background:#fff}
.entry-content{max-width:720px;margin:0 auto;padding:0 20px}
.entry-content h1,.entry-content h2,.entry-content h3,.entry-content h4{font-family:Georgia,serif;color:#c00;text-transform:uppercase;margin:1.4em 0 .6em}
.entry-content p{margin:0 0 1.5em;font-size:20px}
.entry-content a{color:#c00;text-decoration:underline;border-bottom:1px solid #c00}
.entry-content ul,.entry-content ol{margin:0 0 1.5em 2em;list-style:disc}
</style>
</head>
<body>
<main class="entry-content">
${fragment}
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(__dirname, 'dist', 'preview.html'), preview, 'utf8');

/* ---------- Verificações de segurança para o WordPress ---------- */
const problems = [];
if (/\n\s*\n/.test(fragment)) problems.push('há linhas em branco no bloco (o WordPress pode inserir <p>/<br>)');
if (/&&/.test(finalJs)) problems.push('há "&&" no JavaScript');
if (/<!--/.test(fragment)) problems.push('há comentários HTML no bloco');
const ids = [...finalHtml.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
const dup = ids.filter((v, k) => ids.indexOf(v) !== k);
if (dup.length) problems.push('IDs duplicados: ' + dup.join(', '));
const uses = [...finalHtml.matchAll(/href="#(rc-i-[^"]+)"/g)].map((m) => m[1]);
const missingIcons = [...new Set(uses)].filter((u) => !ids.includes(u));
if (missingIcons.length) problems.push('ícones sem símbolo: ' + missingIcons.join(', '));
const anchors = [...finalHtml.matchAll(/href="#(rc-(?!i-)[^"]+)"/g)].map((m) => m[1]);
const missingAnchors = [...new Set(anchors)].filter((a) => !ids.includes(a));
if (missingAnchors.length) problems.push('âncoras sem destino: ' + missingAnchors.join(', '));
const unprefixed = finalCss.split('\n').filter((l) => /^[.a-z*]/.test(l) && !/^(html|body|@)/.test(l));
if (unprefixed.length) problems.push('regras sem prefixo: ' + unprefixed.slice(0, 3).join(' | '));

console.log('CSS:', (finalCss.length / 1024).toFixed(1), 'KB | HTML:', (finalHtml.length / 1024).toFixed(1), 'KB | Total:', (fragment.length / 1024).toFixed(1), 'KB');
console.log(problems.length ? 'PROBLEMAS:\n - ' + problems.join('\n - ') : 'Verificações OK (sem linhas em branco, sem IDs duplicados, ícones e âncoras resolvidos, CSS 100% prefixado).');
