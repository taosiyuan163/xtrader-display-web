/**
 * XTrader i18n (Internationalization) Module
 * Supports English (default) and Chinese
 */

class I18n {
  constructor() {
    this.currentLang = 'en'; // Default language is English
    this.translations = {};
    this.observers = [];
  }

  /**
   * Initialize i18n system
   * @param {Object} translations - Translation objects { en: {...}, zh: {...} }
   */
  init(translations) {
    this.translations = translations;

    // Load saved language preference or detect from browser
    const savedLang = localStorage.getItem('xtrader-lang');
    const browserLang = navigator.language.toLowerCase();

    if (savedLang && this.translations[savedLang]) {
      this.currentLang = savedLang;
    } else if (browserLang.startsWith('zh') && this.translations['zh']) {
      // Only switch to Chinese if browser language is Chinese
      // Otherwise keep English as default
      this.currentLang = 'zh';
    } else {
      this.currentLang = 'en'; // Default to English
    }

    this.applyTranslations();
  }

  /**
   * Switch to a different language
   * @param {string} lang - Language code ('en' or 'zh')
   */
  switchLang(lang) {
    if (!this.translations[lang]) {
      console.warn(`Language '${lang}' not available`);
      return;
    }

    this.currentLang = lang;
    localStorage.setItem('xtrader-lang', lang);
    this.applyTranslations();
    this.notifyObservers();
  }

  /**
   * Get translation for a key
   * @param {string} key - Translation key (supports nested keys with dot notation)
   * @returns {string} Translated text
   */
  t(key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLang];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        console.warn(`Translation key '${key}' not found for language '${this.currentLang}'`);
        return key;
      }
    }

    return value || key;
  }

  /**
   * Apply translations to all elements with data-i18n attribute
   */
  applyTranslations() {
    // Translate text content
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      element.textContent = this.t(key);
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = this.t(key);
    });

    // Translate aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      const key = element.getAttribute('data-i18n-aria');
      element.setAttribute('aria-label', this.t(key));
    });

    // Translate titles
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      element.title = this.t(key);
    });

    // Update HTML lang attribute
    document.documentElement.lang = this.currentLang === 'zh' ? 'zh-CN' : 'en';

    // Update page title if data-i18n-page-title exists
    const titleKey = document.querySelector('meta[name="i18n-page-title"]');
    if (titleKey) {
      document.title = this.t(titleKey.getAttribute('content'));
    }
  }

  /**
   * Subscribe to language change events
   * @param {Function} callback - Callback function to execute on language change
   */
  subscribe(callback) {
    this.observers.push(callback);
  }

  /**
   * Notify all observers of language change
   */
  notifyObservers() {
    this.observers.forEach(callback => callback(this.currentLang));
  }

  /**
   * Get current language
   * @returns {string} Current language code
   */
  getCurrentLang() {
    return this.currentLang;
  }
}

// Create global i18n instance
window.i18n = new I18n();

/**
 * Create language switcher UI
 */
function createLanguageSwitcher() {
  const switcher = document.createElement('div');
  switcher.className = 'lang-switcher';
  switcher.innerHTML = `
    <button class="lang-btn ${window.i18n.getCurrentLang() === 'en' ? 'active' : ''}" data-lang="en">English</button>
    <button class="lang-btn ${window.i18n.getCurrentLang() === 'zh' ? 'active' : ''}" data-lang="zh">中文</button>
  `;

  // Add click handlers
  switcher.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      window.i18n.switchLang(lang);

      // Update active state
      switcher.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  return switcher;
}

// Auto-insert language switcher after header (if header exists)
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  if (header && !document.querySelector('.lang-switcher')) {
    const switcher = createLanguageSwitcher();
    header.after(switcher);
  }
});
