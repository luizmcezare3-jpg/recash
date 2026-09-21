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

Também confirme: o prazo (20 dias), os 40% de honorários e a assinatura "Estúdio Pink Design" do rodapé (vieram das suas imagens de referência).

## Foto no topo (opcional)
No CSS, dentro de `#recash{...}`, troque `--rc-hero-img:none;` por `--rc-hero-img:url(https://seusite.com/foto.jpg);`

## Por que não dá problema no WordPress
- Todo o CSS é prefixado com `#recash`, então o tema não altera o visual (e o site não altera o tema).
- Nenhuma linha em branco e nenhum comentário HTML no código (evita o `<p>`/`<br>` automático do WordPress).
- Ícones em SVG inline: não depende de biblioteca de ícones, imagens ou plugins.
- FAQ e menu mobile funcionam só com HTML/CSS. O JavaScript é opcional (fecha o menu ao clicar e destaca o item ativo); o script não usa `&&`, que alguns filtros do WP corrompem.
- Única dependência externa: fonte Outfit do Google Fonts (se falhar, usa Segoe UI/Arial).

## Para editar o código-fonte
Edite os arquivos em `src/` e rode `node build.js` para gerar `dist/` de novo (o script também roda verificações).
