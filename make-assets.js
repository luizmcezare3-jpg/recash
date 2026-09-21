// Gera src/assets.css com a logo e a foto do topo embutidas (base64), para o site continuar sendo um único bloco
// que dá para colar no WordPress sem depender de upload de imagens.
// Uso: node make-assets.js   (depois rode: node build.js)
const fs = require('fs');
const path = require('path');

const b64 = (f) => fs.readFileSync(path.join(__dirname, 'assets', f)).toString('base64');

const css = `/* Gerado por make-assets.js - não edite à mão. Logo original em assets/logo-recash-original.png */
.rc-logo__img{background:url(data:image/png;base64,${b64('logo-recash.png')}) center/contain no-repeat}
.rc-icon-img{background:url(data:image/png;base64,${b64('logo-recash-icone.png')}) center/contain no-repeat}
.rc-root{--rc-hero-img:url(data:image/jpeg;base64,${b64('hero-fundo.jpg')})}
`;

fs.writeFileSync(path.join(__dirname, 'src', 'assets.css'), css, 'utf8');
console.log('src/assets.css gerado (' + (css.length / 1024).toFixed(1) + ' KB)');
