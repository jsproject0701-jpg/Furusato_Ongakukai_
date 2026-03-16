// ============ NAV ============
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  if (nav) {
    if (window.scrollY > 200) {
      nav.classList.add('visible', 'scrolled');
    } else {
      nav.classList.remove('visible', 'scrolled');
    }
  }
});

// ============ HAMBURGER MENU ============
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
let menuOpen = false;

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', function () {
    menuOpen = !menuOpen;
    if (menuOpen) {
      mobileMenu.classList.add('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.cssText = 'transform:rotate(45deg) translate(5px,5px)';
      spans[1].style.cssText = 'opacity:0';
      spans[2].style.cssText = 'transform:rotate(-45deg) translate(5px,-5px)';
    } else {
      closeMobileMenu();
    }
  });
}

function closeMobileMenu() {
  menuOpen = false;
  if (mobileMenu) mobileMenu.classList.remove('open');
  if (hamburger) {
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.cssText = '';
    spans[1].style.cssText = '';
    spans[2].style.cssText = '';
  }
}

// ============ EMAIL（config.js から設定） ============
// cms.js の重複処理を削除し、こちらで一元管理
window.addEventListener("DOMContentLoaded", () => {
  if (typeof SITE_CONFIG === "undefined") return;
  const emailEl = document.getElementById("emailLink");
  if (emailEl && SITE_CONFIG.email) {
    emailEl.textContent = SITE_CONFIG.email;
    emailEl.href = "mailto:" + SITE_CONFIG.email;
  }
});
