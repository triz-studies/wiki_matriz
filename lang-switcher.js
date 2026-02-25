<script>
(function () {
  'use strict';

  // ── Configuration ─────────────────────────────────────────────────────────
  var VN_HREFS = [
    'Problem-identification-tools_vn.html',
    'Problem-solving-tools_vn.html',
    'Concept-substantiation-tools_vn.html',
    'TESE_vn.html',
    'Glossary_vn.html',
    'Resources_vn.html'
  ];

  var EN_HREFS = [
    'index.html',
    'Problem-identification-tools.html',
    'Problem-solving-tools.html',
    'Concept-substantiation-tools.html',
    'TESE.html',
    'Glossary.html',
    'Resources.html'
  ];

  // ── Detect language ────────────────────────────────────────────────────────
  function detectLanguage() {
    var path = window.location.pathname;
    var filename = path.split('/').pop() || 'index.html';

    for (var i = 0; i < VN_HREFS.length; i++) {
        if (filename.toLowerCase() === VN_HREFS[i].toLowerCase()) return 'vn';
    }

    if (filename === 'index.html' || filename === '') {
        var saved = localStorage.getItem('wiki-lang');
        if (saved) return saved;
        
        var browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
        return browserLang.startsWith('vi') ? 'vn' : 'en';
    }
    return 'en';
  }

  // ── Apply language ─────────────────────────────────────────────────────────
  function applyLang(lang) {
    var navItems = document.querySelectorAll('.navbar-nav .nav-item');
    
    navItems.forEach(function(li) {
      var link = li.querySelector('.nav-link');
      if (!link) return;
      
      var href = link.getAttribute('href');
      var txt = link.textContent.trim();
      
      // Skip flag buttons and internal hash links from the toggling logic
      if (txt === '🇬🇧' || txt === '🇻🇳' || !href || href === '#' || href.startsWith('#')) {
          li.style.display = ''; // Ensure visible
          return;
      }
      
      var baseHref = href.split('?')[0].split('#')[0].split('/').pop();
      // Only fallback to index.html for relative links that seem to be the root
      if ((href === '.' || href === './' || href === '/') && (baseHref === '.' || baseHref === '')) {
          baseHref = 'index.html';
      }
      
      var isVnLink = false;
      var isEnLink = false;
      
      // 1. Check for explicit text-based classification first (highest priority)
      if (txt === 'Source: MATRIZ') {
          isEnLink = true;
      } else if (txt === 'Nguồn: MATRIZ') {
          isVnLink = true;
      } else {
          // 2. Fallback to href-based classification
          for (var i = 0; i < VN_HREFS.length; i++) {
            if (baseHref.toLowerCase() === VN_HREFS[i].toLowerCase()) { isVnLink = true; break; }
          }
          if (!isVnLink) {
            for (var j = 0; j < EN_HREFS.length; j++) {
              if (baseHref.toLowerCase() === EN_HREFS[j].toLowerCase()) { isEnLink = true; break; }
            }
          }
      }

      if (isEnLink) {
        li.style.display = (lang === 'en') ? '' : 'none';
      } else if (isVnLink) {
        li.style.display = (lang === 'vn') ? '' : 'none';
      }
    });

    // Handle flag buttons state
    var btnEn = document.getElementById('lang-btn-en');
    var btnVn = document.getElementById('lang-btn-vn');
    
    if (!btnEn || !btnVn) {
      document.querySelectorAll('.navbar-nav .nav-link, .quarto-navbar-tools a').forEach(function(l) {
        var txt = l.textContent.trim();
        if (txt === '🇬🇧') btnEn = l;
        if (txt === '🇻🇳') btnVn = l;
      });
    }

    if (btnEn) {
        var liEn = btnEn.closest('li');
        if (liEn) {
            liEn.classList.toggle('lang-active', lang === 'en');
            liEn.style.display = ''; 
        }
    }
    if (btnVn) {
        var liVn = btnVn.closest('li');
        if (liVn) {
            liVn.classList.toggle('lang-active', lang === 'vn');
            liVn.style.display = '';
        }
    }
  }

  // ── Switch Logic ───────────────────────────────────────────────────────────
  function wireButtons() {
    var btnEn = document.getElementById('lang-btn-en');
    var btnVn = document.getElementById('lang-btn-vn');

    if (!btnEn || !btnVn) {
      document.querySelectorAll('.navbar-nav .nav-link, .quarto-navbar-tools a').forEach(function(l) {
        var txt = l.textContent.trim();
        if (txt === '🇬🇧') btnEn = l;
        if (txt === '🇻🇳') btnVn = l;
      });
    }

    function switchTo(newLang) {
      localStorage.setItem('wiki-lang', newLang);
      applyLang(newLang);

      var currentPath = window.location.pathname;
      var filename = currentPath.split('/').pop() || 'index.html';
      
      var partnerMap = {
        'Problem-identification-tools_vn.html': 'Problem-identification-tools.html',
        'Problem-solving-tools_vn.html':        'Problem-solving-tools.html',
        'Concept-substantiation-tools_vn.html': 'Concept-substantiation-tools.html',
        'TESE_vn.html':                          'TESE.html',
        'Glossary_vn.html':                      'Glossary.html',
        'Resources_vn.html':                     'Resources.html',
        'Problem-identification-tools.html':     'Problem-identification-tools_vn.html',
        'Problem-solving-tools.html':            'Problem-solving-tools_vn.html',
        'Concept-substantiation-tools.html':     'Concept-substantiation-tools_vn.html',
        'TESE.html':                             'TESE_vn.html',
        'Glossary.html':                         'Glossary_vn.html',
        'Resources.html':                        'Resources_vn.html'
      };
      
      var partner = partnerMap[filename];
      if (partner) window.location.href = partner;
    }

    if (btnEn) {
      btnEn.addEventListener('click', function (e) { e.preventDefault(); switchTo('en'); });
    }
    if (btnVn) {
      btnVn.addEventListener('click', function (e) { e.preventDefault(); switchTo('vn'); });
    }
  }

  // ── Initialize ─────────────────────────────────────────────────────────────
  function init() {
    var lang = detectLanguage();
    // Auto-update localStorage if visiting a specific language URL
    var path = window.location.pathname.toLowerCase();
    if (path.indexOf('_vn.html') !== -1) {
        localStorage.setItem('wiki-lang', 'vn');
        lang = 'vn';
    } else {
        // Check if current page is one of the known English pages
        var filename = path.split('/').pop() || 'index.html';
        for (var i = 0; i < EN_HREFS.length; i++) {
            if (filename === EN_HREFS[i].toLowerCase()) {
                localStorage.setItem('wiki-lang', 'en');
                lang = 'en';
                break;
            }
        }
    }
    applyLang(lang);
    wireButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>
