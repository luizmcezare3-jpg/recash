// Opcional: o site funciona sem este script (menu mobile e FAQ usam apenas HTML/CSS).
// Ele só fecha o menu mobile ao clicar em um link e destaca o item do menu da seção visível.
// Obs.: evitamos o operador "&&" de propósito, pois alguns filtros do WordPress o convertem em "&#038;&#038;".
(function () {
  var root = document.getElementById('recash');
  if (!root) { return; }

  var toggle = document.getElementById('rc-nav-toggle');
  var links = root.querySelectorAll('.rc-nav a, .rc-menu a');
  var i;

  function closeMenu() {
    if (toggle) { toggle.checked = false; }
  }
  for (i = 0; i < links.length; i++) {
    links[i].addEventListener('click', closeMenu);
  }

  // seção -> item de menu que deve ficar ativo
  var map = {
    'rc-home': 'rc-home',
    'rc-solucao': 'rc-home',
    'rc-quem-somos': 'rc-home',
    'rc-para-quem-e': 'rc-para-quem-e',
    'rc-como-funciona': 'rc-como-funciona',
    'rc-faq': 'rc-faq',
    'rc-contato': 'rc-contato',
    'rc-endereco': 'rc-endereco'
  };

  function setActive(id) {
    var target = map[id];
    var j;
    var href;
    for (j = 0; j < links.length; j++) {
      href = links[j].getAttribute('href');
      if (href === '#' + target) {
        links[j].classList.add('is-active');
      } else {
        links[j].classList.remove('is-active');
      }
    }
  }

  if (!('IntersectionObserver' in window)) { return; }

  var observer = new IntersectionObserver(function (entries) {
    var k;
    for (k = 0; k < entries.length; k++) {
      if (entries[k].isIntersecting) { setActive(entries[k].target.id); }
    }
  }, { rootMargin: '-35% 0px -60% 0px' });

  var id;
  var el;
  for (id in map) {
    el = document.getElementById(id);
    if (el) { observer.observe(el); }
  }
})();
