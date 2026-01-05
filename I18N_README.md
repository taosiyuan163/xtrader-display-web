# XTrader i18n (Internationalization) System

## Overview

The XTrader website now supports full internationalization (i18n) with English and Chinese language support. **English is the default language.**

## Features

- ✅ **Default Language**: English (en)
- ✅ **Supported Languages**: English (en), Chinese (zh)
- ✅ **Auto Language Detection**: Detects browser language preference (only switches to Chinese if browser language is Chinese)
- ✅ **Persistent Preferences**: Saves language choice in localStorage
- ✅ **Dynamic Switching**: Switch languages without page reload
- ✅ **Fixed Language Switcher**: Floating button in top-right corner of all pages

## File Structure

```
xtrader-display-web/
├── i18n.js                 # Core i18n module
├── lang/
│   ├── en.json            # English translations
│   └── zh.json            # Chinese translations
├── index.html             # Main page (with i18n support)
├── privacy.html           # Privacy page (existing i18n implementation)
├── test-i18n.html         # Test page for i18n functionality
└── styles.css             # Includes language switcher styles
```

## How to Use

### 1. Add i18n to a New Page

Include the i18n script and initialization code:

```html
<!-- At the end of <body>, before </body> -->
<script src="i18n.js"></script>
<script>
  // Load translations and initialize i18n
  Promise.all([
    fetch('lang/en.json').then(r => r.json()),
    fetch('lang/zh.json').then(r => r.json())
  ]).then(([en, zh]) => {
    window.i18n.init({ en, zh });
  }).catch(err => {
    console.error('Failed to load translations:', err);
  });
</script>
```

### 2. Mark Elements for Translation

Use `data-i18n` attributes to mark elements for translation:

```html
<!-- Text content -->
<h1 data-i18n="hero.title">XTrader</h1>

<!-- Placeholders -->
<input type="text"
       data-i18n-placeholder="login.emailPlaceholder"
       placeholder="Enter your email">

<!-- ARIA labels -->
<button data-i18n-aria="button.submit" aria-label="Submit">Submit</button>

<!-- Title attributes -->
<span data-i18n-title="tooltip.help" title="Help">?</span>
```

### 3. Add Translation Keys

Add your translation keys to both language files:

**lang/en.json:**
```json
{
  "hero": {
    "title": "Welcome to XTrader"
  },
  "login": {
    "emailPlaceholder": "Enter your email"
  }
}
```

**lang/zh.json:**
```json
{
  "hero": {
    "title": "欢迎使用XTrader"
  },
  "login": {
    "emailPlaceholder": "请输入邮箱"
  }
}
```

### 4. Language Switcher

The language switcher is automatically inserted after the `<header>` element on page load. It appears as a fixed floating button in the top-right corner.

To manually create a language switcher:

```javascript
const switcher = createLanguageSwitcher();
document.body.appendChild(switcher);
```

## API Reference

### `window.i18n`

The global i18n instance provides these methods:

#### `init(translations)`
Initialize the i18n system with translation objects.

```javascript
window.i18n.init({ en: {...}, zh: {...} });
```

#### `switchLang(lang)`
Switch to a different language.

```javascript
window.i18n.switchLang('zh'); // Switch to Chinese
window.i18n.switchLang('en'); // Switch to English
```

#### `t(key)`
Get translation for a key (supports dot notation).

```javascript
window.i18n.t('hero.title');        // Returns translated text
window.i18n.t('login.emailPlaceholder');
```

#### `getCurrentLang()`
Get the current language code.

```javascript
const lang = window.i18n.getCurrentLang(); // 'en' or 'zh'
```

#### `subscribe(callback)`
Subscribe to language change events.

```javascript
window.i18n.subscribe((lang) => {
  console.log('Language changed to:', lang);
  // Custom logic here
});
```

## Testing

Open [test-i18n.html](test-i18n.html) in your browser to test the i18n functionality:

1. Click the language switcher button
2. Verify all text changes between English and Chinese
3. Refresh the page and verify the language preference is remembered
4. Check browser console for any errors

## Translation Keys Structure

The translation files use a nested structure:

```json
{
  "section": {
    "subsection": {
      "key": "Translation text"
    }
  }
}
```

Current sections:
- `meta` - Page metadata (title, description)
- `nav` - Navigation links
- `hero` - Hero section
- `features` - Features section
- `prototype` - Product prototype section
- `splash`, `login`, `register` - App screens
- `dashboard`, `traders`, `detail` - Dashboard screens
- `ranking`, `profile`, `modal` - Other screens
- `bottomNav` - Bottom navigation
- `privacy` - Privacy section
- `contact` - Contact section
- `footer` - Footer

## Default Language Behavior

**Important**: The system defaults to English in these scenarios:
1. First-time visitor with no saved preference
2. Browser language is not Chinese
3. When localStorage is cleared

The system only switches to Chinese if:
- The user explicitly selects Chinese via the language switcher, OR
- The browser language starts with 'zh' (Chinese) on first visit

## Browser Compatibility

- Modern browsers with ES6+ support
- Requires `fetch` API for loading JSON files
- Uses `localStorage` for persistence
- Tested on Chrome, Firefox, Safari, Edge

## Troubleshooting

### Language switcher not appearing
- Check that `<header>` element exists in the HTML
- Verify `i18n.js` is loaded before initialization script
- Check browser console for errors

### Translations not working
- Verify JSON files are valid (use `node -e "require('./lang/en.json')"`)
- Check that translation keys exist in both language files
- Ensure `data-i18n` attributes match the keys in JSON files

### Language preference not persisting
- Check if localStorage is enabled in the browser
- Verify no browser extensions are blocking localStorage
- Check browser console for localStorage errors

## Future Enhancements

Potential improvements for the i18n system:
- [ ] Add more languages (Spanish, French, Japanese, etc.)
- [ ] Lazy load translation files
- [ ] Add translation fallback mechanism
- [ ] Support for pluralization
- [ ] Support for date/number formatting
- [ ] Translation management UI

## License

Part of the XTrader project. © 2025 XTrader. All rights reserved.
