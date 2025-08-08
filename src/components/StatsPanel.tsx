import React from 'react';
import { BarChart3, FileText, Clock, CheckCircle, XCircle, Target, Image, Link, Timer, HardDrive } from 'lucide-react';
import { ScrapedContent } from '../types';

interface StatsPanelProps {
  contents: ScrapedContent[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ contents }) => {
  const stats = {
    total: contents.length,
    completed: contents.filter(c => c.status === 'completed').length,
    processing: contents.filter(c => c.status === 'processing').length,
    errors: contents.filter(c => c.status === 'error').length,
    totalWords: contents.reduce((sum, c) => sum + c.wordCount, 0),
    totalImages: contents.reduce((sum, c) => sum + (c.images?.length || 0), 0),
    totalLinks: contents.reduce((sum, c) => sum + (c.links?.length || 0), 0),
    avgLoadTime: contents.length > 0 ? Math.round(contents.reduce((sum, c) => sum + c.loadTime, 0) / contents.length) : 0,
    totalSize: contents.reduce((sum, c) => sum + c.responseSize, 0),
  };

  const categories = contents
    .filter(c => c.status === 'completed')
    .reduce((acc, content) => {
      acc[content.category] = (acc[content.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const statItems = [
    { icon: FileText, label: 'Total URLs', value: stats.total, color: 'text-blue-600 dark:text-blue-400' },
    { icon: CheckCircle, label: 'Completed', value: stats.completed, color: 'text-green-600 dark:text-green-400' },
    { icon: Clock, label: 'Processing', value: stats.processing, color: 'text-yellow-600 dark:text-yellow-400' },
    { icon: XCircle, label: 'Errors', value: stats.errors, color: 'text-red-600 dark:text-red-400' },
    { icon: Target, label: 'Total Words', value: stats.totalWords.toLocaleString(), color: 'text-purple-600 dark:text-purple-400' },
    { icon: Image, label: 'Images Found', value: stats.totalImages, color: 'text-indigo-600 dark:text-indigo-400' },
    { icon: Link, label: 'Links Found', value: stats.totalLinks, color: 'text-cyan-600 dark:text-cyan-400' },
    { icon: Timer, label: 'Avg Load Time', value: `${stats.avgLoadTime}ms`, color: 'text-orange-600 dark:text-orange-400' },
    { icon: HardDrive, label: 'Total Size', value: formatBytes(stats.totalSize), color: 'text-teal-600 dark:text-teal-400' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Processing Statistics
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mb-6">
        {statItems.map((item, index) => (
          <div key={index} className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex justify-center mb-2">
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <p className="text-base font-bold text-gray-800 dark:text-white mb-1 break-words min-h-[1.5rem]">
              {item.value}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {Object.keys(categories).length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
            Content Categories
          </h3>
          <div className="space-y-2">
            {Object.entries(categories).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">{category}</span>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};