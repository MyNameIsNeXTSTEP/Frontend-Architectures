# Simple SPA - JSON Placeholder Demo

A classical Single Page Application (SPA) built with vanilla HTML, CSS, and JavaScript that demonstrates API integration with JSONPlaceholder.

## Features

- 🎯 **Simple Widget Interface**: Easy-to-use radio button selection for different data types
- 🌐 **API Integration**: Fetches data from JSONPlaceholder API endpoints
- 📱 **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- ⚡ **Fast Loading**: Optimized with loading states and animations
- 🎨 **Modern UI**: Clean, gradient-based design with smooth transitions
- 🔄 **Error Handling**: Comprehensive error states with retry functionality
- 🖼️ **Rich Content Display**: Different layouts for different content types

## Data Types Available

- **Posts** - User blog posts with titles and content
- **Comments** - Post comments with email and content
- **Albums** - Photo album collections
- **Photos** - Album photos with thumbnails

## Project Structure

```
SPA/
├── index.html          # Main HTML file with widget structure
├── styles/
│   └── main.css       # Complete styling with responsive design
├── scripts/
│   └── main.js        # API integration and SPA logic
├── public/            # Static assets (empty, ready for expansion)
└── README.md          # This file
```

## Technologies Used

- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with flexbox, grid, and animations
- **Vanilla JavaScript (ES6+)** - Classes, async/await, fetch API
- **JSONPlaceholder API** - Mock REST API for testing

## How It Works

1. **User Selection**: User selects a data type (posts, comments, albums, photos)
2. **API Call**: JavaScript makes a fetch request to the corresponding JSONPlaceholder endpoint
3. **Data Processing**: Response is processed and limited to 20 items for performance
4. **Dynamic Display**: Results are rendered with appropriate layouts for each data type
5. **State Management**: Loading, success, and error states are handled gracefully

## API Endpoints Used

- Posts: `https://jsonplaceholder.typicode.com/posts`
- Comments: `https://jsonplaceholder.typicode.com/comments`
- Albums: `https://jsonplaceholder.typicode.com/albums`
- Photos: `https://jsonplaceholder.typicode.com/photos`

## Features Implemented

### Core Functionality
- ✅ Radio button widget for data type selection
- ✅ Fetch API integration with JSONPlaceholder
- ✅ Dynamic content rendering based on data type
- ✅ Responsive grid layout for results

### User Experience
- ✅ Loading states with spinners
- ✅ Error handling with retry functionality
- ✅ Smooth animations and transitions
- ✅ Clear results functionality
- ✅ Smooth scrolling to results
- ✅ Mobile-first responsive design

### Technical Features
- ✅ ES6+ Class-based architecture
- ✅ Async/await for API calls
- ✅ Event delegation and proper cleanup
- ✅ Error boundaries and global error handling
- ✅ Performance optimizations (image lazy loading, result limiting)

## Getting Started

1. Simply open `index.html` in a web browser
2. Select a data type from the widget
3. Click "Fetch Data" to see results
4. Use "Clear Results" to reset and try again

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Future Enhancements

- Service worker for offline functionality
- Local storage for caching results
- Pagination for large datasets
- Search and filter functionality
- Dark mode toggle
- Additional API endpoints

## About JSONPlaceholder

JSONPlaceholder is a free fake REST API for testing and prototyping. It provides 6 common resources:
- Posts (100 items)
- Comments (500 items)
- Albums (100 items) 
- Photos (5000 items)
- Todos (200 items)
- Users (10 items)

Learn more at: https://jsonplaceholder.typicode.com/
