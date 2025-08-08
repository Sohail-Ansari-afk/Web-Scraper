import React, { useState, useEffect } from 'react';
import { Moon, Sun, Bot, Globe2 } from 'lucide-react';
import { ScrapedContent } from './types';
import { ScrapingService } from './services/scrapingService';
import { UrlInput } from './components/UrlInput';
import { ContentCard } from './components/ContentCard';
import { ApiKeyInput } from './components/ApiKeyInput';
import { StatsPanel } from './components/StatsPanel';
import { ExportPanel } from './components/ExportPanel';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [contents, setContents] = useState<ScrapedContent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scrapingService, setScrapingService] = useState<ScrapingService | null>(null);

  useEffect(() => {
    // Load saved settings
    const savedApiKey = localStorage.getItem('openrouter-api-key');
    const savedDarkMode = localStorage.getItem('dark-mode') === 'true';
    
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    setDarkMode(savedDarkMode);

    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('openrouter-api-key', apiKey);
      setScrapingService(new ScrapingService(apiKey));
    }
  }, [apiKey]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('dark-mode', String(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Apply dark mode class on initial load
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleUrlSubmit = async (urls: string[]) => {
    if (!scrapingService) {
      alert('Please enter your OpenRouter API key first');
      return;
    }

    setIsProcessing(true);
    const newContents: ScrapedContent[] = [];

    for (const url of urls) {
      const processingContent: ScrapedContent = {
        id: Math.random().toString(36).substr(2, 9),
        url,
        title: '',
        content: '',
        summary: '',
        category: '',
        extractedAt: new Date().toISOString(),
        wordCount: 0,
        status: 'processing'
      };
      
      newContents.push(processingContent);
      setContents(prev => [...prev, processingContent]);

      try {
        const result = await scrapingService.scrapeUrl(url);
        setContents(prev => 
          prev.map(c => c.id === processingContent.id ? result : c)
        );
      } catch (error) {
        const errorContent: ScrapedContent = {
          ...processingContent,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
        setContents(prev => 
          prev.map(c => c.id === processingContent.id ? errorContent : c)
        );
      }
    }

    setIsProcessing(false);
  };

  const clearAllResults = () => {
    setContents([]);
    scrapingService?.clearProcessedUrls();
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors ${darkMode ? 'dark' : ''}`}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  AI Web Scraper
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Intelligent content extraction and summarization
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
          >
            {darkMode ? (
              <Sun className="w-6 h-6 text-yellow-500" />
            ) : (
              <Moon className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </header>

        {/* API Key Input */}
        <ApiKeyInput apiKey={apiKey} onApiKeyChange={setApiKey} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Input and Stats */}
          <div className="lg:col-span-1 space-y-6">
            <UrlInput onSubmit={handleUrlSubmit} isProcessing={isProcessing} />
            <StatsPanel contents={contents} />
            <ExportPanel contents={contents} onClear={clearAllResults} />
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-6">
              <Globe2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Extracted Content
              </h2>
            </div>

            {contents.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
                <Globe2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">
                  No content extracted yet
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  Enter URLs above to start extracting and summarizing web content
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {contents.map((content) => (
                  <ContentCard key={content.id} content={content} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p className="mb-2">
              Powered by OpenRouter API (DeepSeek R1) • Built for content research and analysis
            </p>
            <p className="text-sm">
              Perfect for trend analysis, research automation, and news intelligence
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;