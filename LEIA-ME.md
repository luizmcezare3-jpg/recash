# ReCash – site para WordPress

## Arquivo que você usa
`dist/recash-wordpress.html` → é o site inteiro (CSS + HTML + JS) em um único bloco.
`dist/preview.html` → só para testar no navegador (simula um tema de WordPress agressivo).

## Como colocar no WordPress
1. Páginas → Adicionar nova → título "Home" (ou a página que quiser).
2. Adicione o bloco **"HTML personalizado"** e cole **todo** o conteúdo de `recash-wordpress.html`.
   (No Elementor: widget "HTML". No editor clássico: aba "Texto".)
3. Em Configurações → Leitura, defina essa página como "Página inicial".
4. Use o modelo de página **largura total / sem título** (ou oculte o título) para o site ocupar a tela toda.
   O bloco já se "estica" para 100% da largura mesmo dentro de um tema com coluna estreita.
5. Precisa ser feito por usuário **Administrador** (o WordPress remove `<style>`, `<svg>` e `<script>` de usuários sem a permissão `unfiltered_html`).

## O que trocar antes de publicar (Ctrl+F no arquivo)
| Procure por | Troque por |
|---|---|
| `5500000000000` | número do WhatsApp com DDI+DDD, só dígitos (ex.: `5516999998888`) – aparece em links `wa.me` e `tel:` |
| `SEU_INSTAGRAM` | usuário do Instagram da ReCash |
| `Ribeirão Preto / SP` (seção Endereço) | endereço completo da empresa |

Também confirme: o prazo médio (20 dias) e a assinatura "Estúdio Pink Design" do rodapé (vieram das suas imagens de referência).

## Foto do topo
O fundo do topo é a foto do escritório com o notebook da ReCash, escurecida por uma camada roxa/preta. O monitor foi retocado (removido) para não atrapalhar a leitura do texto. A versão usada está em `assets/hero-fundo.jpg`; a foto original (com o monitor) continua em `assets/hero-original.jpeg`. A foto vai embutida no bloco.
Para trocar: substitua `assets/hero-fundo.jpg`, rode `node make-assets.js` e depois `node build.js`. Para clarear ou escurecer, ajuste os valores `rgba(...)` da regra `.rc-hero::after` em `src/recash.css`.

## Por que não dá problema no WordPress
- Todo o CSS é prefixado com `#recash`, então o tema não altera o visual (e o site não altera o tema).
- Nenhuma linha em branco e nenhum comentário HTML no código (evita o `<p>`/`<br>` automático do WordPress).
- Ícones em SVG inline: não depende de biblioteca de ícones, imagens ou plugins.
- FAQ e menu mobile funcionam só com HTML/CSS. O JavaScript é opcional (fecha o menu ao clicar e destaca o item ativo); o script não usa `&&`, que alguns filtros do WP corrompem.
- Única dependência externa: fonte Outfit do Google Fonts (se falhar, usa Segoe UI/Arial).

## Para editar o código-fonte
Edite os arquivos em `src/` e rode `node build.js` para gerar `dist/` de novo (o script também roda verificações).

## Logo e cores
- A logo enviada está em `assets/logo-recash-original.png` (original) e, recortada, em `assets/logo-recash.png` e `assets/logo-recash-icone.png`. Ela vai embutida no próprio bloco (base64), então não precisa subir imagem no WordPress.
- Para trocar a logo: substitua os PNGs em `assets/`, rode `node make-assets.js` e depois `node build.js`.
- Paleta baseada em rosath4.github.io/paginarecash: roxo #7c42d0 / #5d30a2, verde #3deb56 / #24b43a, lavanda #f5ecff, fundo #f5f5f8, texto #1a1229. As cores ficam nas variáveis do início de `src/recash.css`.
