# Simple Multi-Page Application (MPA)

A basic Multi-Page Application demonstration with clean, modern styling and proper navigation between pages.

## Project Structure

```
Frontend_architectures/
├── index.html          # Main homepage
├── about.html          # About page
├── contact.html        # Contact page
├── styles/
│   └── main.css        # Main stylesheet
├── scripts/
│   └── main.js         # JavaScript functionality
├── public/
│   └── favicon.ico     # Favicon placeholder
└── README.md          # This file
```

## Features

- **Multi-Page Architecture**: Each page is a separate HTML file with full page reloads
- **Responsive Design**: Works well on desktop and mobile devices
- **Modern Styling**: Clean, professional CSS with smooth transitions
- **Navigation**: Easy navigation between pages with active state indicators
- **Contact Form**: Interactive contact form with basic validation
- **SEO-Friendly**: Each page has proper meta tags and structure

## How to Run

1. **Using a Local Server (Recommended)**:
   ```bash
   # Using Python (if you have Python installed)
   python -m http.server 8000
   # or
   python3 -m http.server 8000
   
   # Using Node.js live-server (if you have Node.js)
   npx live-server
   
   # Using PHP (if you have PHP installed)
   php -S localhost:8000
   ```

2. **Or simply open `index.html` in your browser**:
   - Double-click on `index.html`
   - Or drag and drop it into your browser

## Pages

- **Home (`index.html`)**: Main landing page with navigation buttons and feature overview
- **About (`about.html`)**: Information about the MPA and its characteristics
- **Contact (`contact.html`)**: Contact form and information

## Technology Stack

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox and Grid
- **Vanilla JavaScript**: Basic interactivity and form handling
- **No frameworks**: Pure web technologies for simplicity

## MPA vs SPA

This is a Multi-Page Application (MPA) where:
- Each navigation loads a new HTML document
- Full page reloads occur on navigation
- Server-side routing (or file-based routing)
- SEO-friendly by default
- Simple and straightforward architecture

## Customization

- Modify `styles/main.css` to change the appearance
- Edit the HTML files to change content
- Add more pages by creating new HTML files and updating navigation
- Enhance `scripts/main.js` for additional functionality 