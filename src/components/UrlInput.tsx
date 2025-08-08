import React, { useState } from 'react';
import { Plus, Trash2, Globe } from 'lucide-react';

interface UrlInputProps {
  onSubmit: (urls: string[]) => void;
  isProcessing: boolean;
}

export const UrlInput: React.FC<UrlInputProps> = ({ onSubmit, isProcessing }) => {
  const [urls, setUrls] = useState<string[]>(['']);

  const addUrl = () => {
    setUrls([...urls, '']);
  };

  const removeUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validUrls = urls.filter(url => url.trim() !== '');
    if (validUrls.length > 0) {
      onSubmit(validUrls);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Web Content Extraction
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {urls.map((url, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => updateUrl(index, e.target.value)}
              placeholder="Enter website URL (e.g., https://example.com)"
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              disabled={isProcessing}
            />
            {urls.length > 1 && (
              <button
                type="button"
                onClick={() => removeUrl(index)}
                className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                disabled={isProcessing}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={addUrl}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            disabled={isProcessing}
          >
            <Plus className="w-4 h-4" />
            Add URL
          </button>

          <button
            type="submit"
            disabled={isProcessing || urls.every(url => url.trim() === '')}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Extract & Summarize'}
          </button>
        </div>
      </form>
    </div>
  );
};