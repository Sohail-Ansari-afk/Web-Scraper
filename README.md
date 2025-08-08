# AI Web Scraper & Content Summarization Platform

<div align="center">
![Uploading image.png…]()

**Intelligent web content extraction and AI-powered summarization platform**

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF.svg)](https://vitejs.dev/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-DeepSeek_R1-FF6B6B.svg)](https://openrouter.ai/)

</div>

## 🚀 Overview

AI Web Scraper is a sophisticated web application that combines intelligent web scraping with AI-powered content analysis. Built for researchers, analysts, and content professionals, it extracts comprehensive data from websites and generates human-readable summaries using OpenRouter's DeepSeek R1 model.

### ✨ Key Features

- **🌐 Comprehensive Web Scraping**: Extract text, images, links, metadata, and document structure
- **🤖 AI-Powered Summarization**: Generate intelligent summaries using DeepSeek R1 model
- **📊 Content Classification**: Automatic categorization (Technology, Business, News, Research, Entertainment)
- **🔍 Duplicate Detection**: Smart URL management to prevent redundant processing
- **📈 Analytics Dashboard**: Real-time statistics and processing metrics
- **🎨 Modern UI/UX**: Beautiful, responsive interface with dark/light theme support
- **📤 Export Capabilities**: JSON and CSV export for research workflows
- **⚡ Batch Processing**: Handle multiple URLs simultaneously
- **🛡️ Error Handling**: Robust error management with detailed feedback

## 🎯 Use Cases

- **📰 News Intelligence**: Monitor and analyze news articles across multiple sources
- **🔬 Research Automation**: Automate content collection for academic research
- **📊 Trend Analysis**: Track industry trends and emerging topics
- **🏢 Competitive Intelligence**: Monitor competitor content and strategies
- **📚 Content Curation**: Collect and organize content for knowledge bases
- **🎯 Market Research**: Analyze market sentiment and consumer insights

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - Modern UI library with hooks and functional components
- **TypeScript 5.5.3** - Type-safe development with enhanced IDE support
- **Tailwind CSS 3.4.1** - Utility-first CSS framework for rapid styling
- **Vite 5.4.2** - Lightning-fast build tool and development server
- **Lucide React** - Beautiful, customizable SVG icons

### AI & APIs
- **OpenRouter API** - Access to DeepSeek R1 model for content summarization
- **DeepSeek R1** - Advanced language model for intelligent content analysis

### Development Tools
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Automatic vendor prefix handling

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **OpenRouter API Key** (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-web-scraper.git
   cd ai-web-scraper
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Getting Your OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/keys)
2. Sign up for a free account
3. Generate your API key
4. Enter the key in the application's API configuration panel

## 📖 Usage Guide

### Basic Workflow

1. **Configure API Key**
   - Enter your OpenRouter API key in the configuration panel
   - The key is securely stored in your browser's local storage

2. **Add URLs**
   - Enter one or multiple website URLs
   - Use the "Add URL" button for batch processing
   - URLs are automatically validated and normalized

3. **Process Content**
   - Click "Extract & Summarize" to begin processing
   - Monitor real-time progress for each URL
   - View detailed extraction statistics

4. **Analyze Results**
   - Browse extracted content in organized tabs
   - View AI-generated summaries and categories
   - Explore images, links, and metadata
   - Access raw HTML and structured data

5. **Export Data**
   - Export results as JSON for programmatic use
   - Generate CSV reports for spreadsheet analysis
   - Clear results to start fresh processing

### Advanced Features

#### Content Tabs
- **Summary**: AI-generated summary with document structure
- **Content**: Full extracted text with paragraph breakdown
- **Images**: Visual gallery of all extracted images
- **Links**: Categorized internal and external links
- **Metadata**: Complete meta tag information
- **Raw Data**: HTML source and JSON object inspection

#### Statistics Dashboard
- Processing metrics and performance data
- Content categorization breakdown
- Image and link extraction counts
- Load time and data size analytics

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # React components
│   ├── ApiKeyInput.tsx     # API key configuration
│   ├── ContentCard.tsx     # Content display component
│   ├── ExportPanel.tsx     # Export functionality
│   ├── StatsPanel.tsx      # Statistics dashboard
│   └── UrlInput.tsx        # URL input interface
├── services/           # Business logic
│   ├── openRouterService.ts # AI API integration
│   └── scrapingService.ts   # Web scraping logic
├── types/              # TypeScript definitions
│   └── index.ts            # Type definitions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

### Data Flow

1. **URL Input** → Validation → Queue Management
2. **Web Scraping** → Content Extraction → Data Parsing
3. **AI Processing** → Summarization → Classification
4. **Data Storage** → State Management → UI Updates
5. **Export** → Format Conversion → File Download

### Key Components

#### ScrapingService
- Handles web content extraction
- Manages URL validation and deduplication
- Processes HTML parsing and data extraction
- Integrates with OpenRouter for AI analysis

#### ContentCard
- Displays extracted content in organized tabs
- Handles image galleries and link categorization
- Provides copy-to-clipboard functionality
- Shows processing status and error handling

#### StatsPanel
- Real-time processing statistics
- Content categorization analytics
- Performance metrics visualization
- Data export preparation

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#2563eb) - Main actions and highlights
- **Secondary**: Purple (#7c3aed) - API and configuration elements
- **Accent**: Green (#059669) - Success states and export actions
- **Warning**: Yellow (#eab308) - Processing states
- **Error**: Red (#dc2626) - Error states and destructive actions
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Headings**: Inter font family with proper hierarchy
- **Body**: Optimized line height (150%) for readability
- **Code**: Monospace font for technical content
- **Weights**: Light (300), Regular (400), Medium (500), Bold (700)

### Spacing System
- **Base Unit**: 8px grid system
- **Component Padding**: 16px, 24px for cards and panels
- **Section Margins**: 24px, 32px for layout separation
- **Element Gaps**: 8px, 12px, 16px for consistent spacing

## 🔧 Configuration

### Environment Variables
```env
# OpenRouter API Configuration
VITE_OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
VITE_DEFAULT_MODEL=deepseek/deepseek-r1-distill-llama-70b
```

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
  plugins: [],
}
```

## 📊 Performance Optimization

### Frontend Optimizations
- **Code Splitting**: Dynamic imports for large components
- **Image Optimization**: Lazy loading and responsive images
- **Bundle Analysis**: Optimized chunk sizes and dependencies
- **Caching**: Local storage for API keys and user preferences

### API Efficiency
- **Request Batching**: Minimize API calls through intelligent batching
- **Content Caching**: Avoid duplicate processing with URL tracking
- **Error Retry**: Exponential backoff for failed requests
- **Rate Limiting**: Respect API limits with queue management

### Memory Management
- **Component Cleanup**: Proper useEffect cleanup functions
- **State Optimization**: Efficient state updates and re-renders
- **Event Listeners**: Automatic cleanup on component unmount
- **Large Data Handling**: Pagination and virtualization for large datasets

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage
- **Unit Tests**: Component logic and utility functions
- **Integration Tests**: API service integration
- **E2E Tests**: Complete user workflows
- **Performance Tests**: Load time and memory usage

## 🚀 Deployment

### Build for Production
```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Deployment Options

#### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push

#### Vercel
1. Import project from GitHub
2. Configure build settings
3. Deploy with zero configuration

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔒 Security Considerations

### API Key Management
- **Client-Side Storage**: API keys stored in localStorage
- **No Server Exposure**: Keys never transmitted to backend
- **User Control**: Users manage their own API credentials

### CORS Handling
- **Proxy Service**: Uses CORS proxy for web scraping
- **Production Setup**: Implement backend proxy for production
- **Rate Limiting**: Respect website robots.txt and rate limits

### Data Privacy
- **No Data Persistence**: Content not stored on servers
- **Local Processing**: All data remains in user's browser
- **Export Control**: Users control data export and sharing

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with conventional commits: `git commit -m 'feat: add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Follow configured linting rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Structured commit messages

### Pull Request Process
1. Update documentation for new features
2. Add tests for new functionality
3. Ensure all tests pass
4. Update README if needed
5. Request review from maintainers

## 📝 Changelog

### Version 1.0.0 (Current)
- ✨ Initial release with core scraping functionality
- 🤖 OpenRouter API integration with DeepSeek R1
- 🎨 Modern UI with dark/light theme support
- 📊 Comprehensive analytics dashboard
- 📤 JSON and CSV export capabilities
- 🔍 Advanced content extraction and parsing
- 🛡️ Robust error handling and validation

### Upcoming Features
- 🔄 Scheduled scraping and monitoring
- 📱 Mobile app companion
- 🔌 Browser extension integration
- 🗄️ Database integration for content storage
- 🔍 Advanced search and filtering
- 📈 Enhanced analytics and reporting

## 🐛 Troubleshooting

### Common Issues

#### API Key Not Working
- Verify key is correctly entered
- Check OpenRouter account status
- Ensure sufficient API credits

#### CORS Errors
- Using CORS proxy for demo purposes
- Implement backend proxy for production
- Some websites may block scraping

#### Performance Issues
- Large websites may take longer to process
- Consider implementing pagination
- Monitor browser memory usage

#### Dark Mode Not Switching
- Clear browser cache and reload
- Check localStorage for saved preferences
- Verify Tailwind CSS configuration

### Getting Help
- 📧 Email: support@example.com
- 💬 Discord: [Join our community](https://discord.gg/example)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/ai-web-scraper/issues)
- 📖 Docs: [Full Documentation](https://docs.example.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenRouter** for providing access to advanced AI models
- **DeepSeek** for the powerful R1 language model
- **React Team** for the excellent frontend framework
- **Tailwind CSS** for the utility-first CSS framework
- **Vite** for the lightning-fast build tool
- **Lucide** for the beautiful icon library

## 📞 Support

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs and issues
- 💡 Suggesting new features
- 🤝 Contributing to the codebase
- 📢 Sharing with your network

---

<div align="center">

**Built with ❤️ for the developer community**

[Website](https://example.com) • [Documentation](https://docs.example.com) • [Support](mailto:support@example.com)

</div>
