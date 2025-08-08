import React from 'react';
import { Download, FileJson, FileSpreadsheet, Trash2 } from 'lucide-react';
import { ScrapedContent } from '../types';

interface ExportPanelProps {
  contents: ScrapedContent[];
  onClear: () => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ contents, onClear }) => {
  const completedContents = contents.filter(c => c.status === 'completed');

  const exportAsJson = () => {
    const dataStr = JSON.stringify(completedContents, null, 2);
    downloadFile(dataStr, 'scraped-content.json', 'application/json');
  };

  const exportAsCSV = () => {
    if (completedContents.length === 0) return;

    const headers = ['Title', 'URL', 'Category', 'Summary', 'Word Count', 'Extracted At'];
    const csvContent = [
      headers.join(','),
      ...completedContents.map(content => [
        `"${content.title.replace(/"/g, '""')}"`,
        `"${content.url}"`,
        content.category,
        `"${content.summary.replace(/"/g, '""')}"`,
        content.wordCount,
        new Date(content.extractedAt).toISOString()
      ].join(','))
    ].join('\n');

    downloadFile(csvContent, 'scraped-content.csv', 'text/csv');
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Download className="w-6 h-6 text-green-600 dark:text-green-400" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Export & Actions
        </h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={exportAsJson}
            disabled={completedContents.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
          >
            <FileJson className="w-5 h-5" />
            Export JSON
          </button>

          <button
            onClick={exportAsCSV}
            disabled={completedContents.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
          >
            <FileSpreadsheet className="w-5 h-5" />
            Export CSV
          </button>
        </div>

        <button
          onClick={onClear}
          disabled={contents.length === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-200 hover:border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 className="w-5 h-5" />
          Clear All Results
        </button>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>{completedContents.length} items ready for export</p>
          {contents.length > completedContents.length && (
            <p className="text-yellow-600 dark:text-yellow-400">
              {contents.length - completedContents.length} items still processing or failed
            </p>
          )}
        </div>
      </div>
    </div>
  );
};