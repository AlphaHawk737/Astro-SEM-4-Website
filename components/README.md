# Navigation Component Guide

## Overview
The navigation bar is now a separate, reusable component located in the `components/` folder. It appears after the home page animations complete (after 4.7 seconds) and fades in smoothly.

## Files Structure
```
components/
├── nav.html    (Navigation structure)
├── nav.css     (Navigation styling)
└── nav.js      (Navigation functionality)
```

## How to Customize

### 1. **Change Navigation Links**
Edit `components/nav.html` to modify the menu sections and links:

```html
<div class="navbar-section">
  <h3 class="navbar-title">Overview</h3>
  <ul class="navbar-links">
    <li><a href="introduction.html" class="navbar-link">Introduction</a></li>
    <li><a href="evidence.html" class="navbar-link">Evidence</a></li>
  </ul>
</div>
```

**To add a new section:**
```html
<div class="navbar-section">
  <h3 class="navbar-title">Your Section Title</h3>
  <ul class="navbar-links">
    <li><a href="your-page.html" class="navbar-link">Your Link</a></li>
  </ul>
</div>
```

### 2. **Change Navigation Colors/Theme**
Edit `components/nav.css` to modify the styling:

- **Background color**: Change `rgba(0, 0, 0, 0.95)` in `.navbar`
- **Text color**: Change `color: white` to any other color in `.navbar-logo`, `.navbar-link`
- **Hover effects**: Modify the `:hover` states for custom interactions
- **Animation speed**: Change `0.6s` in `.navbar` transition

Example: Dark theme with purple accents:
```css
.navbar {
  background: rgba(20, 0, 40, 0.95);  /* Darker purple */
}

.navbar-link:hover {
  color: #a855f7;  /* Purple accent */
}
```

### 3. **Change Logo Text**
Edit `components/nav.html`, line with `.navbar-logo`:
```html
<span class="navbar-logo">YOUR LOGO TEXT</span>
```

### 4. **Customize Appearance Timing**
Edit `components/nav.js` to change when the nav appears:

```javascript
// Change 4700 to your desired milliseconds
setTimeout(() => {
  navbar.classList.remove("hidden");
  navbar.classList.add("show");
  navToggle.classList.remove("hidden");
  navToggle.classList.add("show");
}, 4700);  // ← Modify this value
```

### 5. **Disable Sound Effects**
In `components/nav.js`, comment out or remove lines with `clickSound.play()`:
```javascript
// if (clickSound) {
//   clickSound.currentTime = 0;
//   clickSound.play().catch(() => {});
// }
```

## Features

✅ **Fade-in animation** - Appears smoothly after home page animations  
✅ **Toggle button** - Hamburger menu in top-right corner  
✅ **Click to close** - Closes when clicking a link or outside the nav  
✅ **Sound effects** - Integrated with existing click.mp3  
✅ **Responsive** - Works on mobile and desktop  
✅ **Theme-matched** - Styled to fit the dark matter aesthetic  

## How It Works

1. The nav component is loaded dynamically via `fetch()` in `index.html`
2. After 4.7 seconds (when home animations complete), it becomes visible
3. The toggle button (☰) appears in the top-right corner
4. Users can click the button to open/close the nav
5. Navigation closes automatically when a link is clicked

## Integration Notes

- The component requires the `assets/click.mp3` file for sound effects
- CSS must be loaded before HTML: `<link rel="stylesheet" href="components/nav.css" />`
- The component is self-contained and doesn't require additional dependencies
