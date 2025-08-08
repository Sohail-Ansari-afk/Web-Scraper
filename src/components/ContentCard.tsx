import React, { useState } from 'react';
import { 
  ExternalLink, Copy, CheckCircle, XCircle, Clock, FileText, Calendar, Hash,
  Image, Link, Heading, FileCode, Globe, Timer, HardDrive, Eye, ChevronDown, ChevronUp
} from 'lucide-react';
import { ScrapedContent } from '../types';

interface ContentCardProps {
  content: ScrapedContent;
}

export const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'content' | 'images' | 'links' | 'metadata' | 'raw'>('summary');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getStatusIcon = () => {
    switch (content.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Technology: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      Business: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      News: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      Research: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      Entertainment: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      Other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (content.status === 'error') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-red-500">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <span className="text-red-600 dark:text-red-400 font-medium">Error</span>
          </div>
          <a
            href={content.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        <p className="text-gray-600 dark:text-gray-400 break-all">{content.url}</p>
        <p className="text-red-600 dark:text-red-400 mt-2">{content.error}</p>
      </div>
    );
  }

  const tabs = [
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'content', label: 'Content', icon: Globe },
    { id: 'images', label: `Images (${content.images?.length || 0})`, icon: Image },
    { id: 'links', label: `Links (${content.links?.length || 0})`, icon: Link },
    { id: 'metadata', label: 'Metadata', icon: Hash },
    { id: 'raw', label: 'Raw Data', icon: FileCode }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(content.category)}`}>
              {content.category}
            </span>
          </div>
          <a
            href={content.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
          {content.title || 'No title available'}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 break-all mb-4">
          {content.url}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <FileText className="w-4 h-4" />
            <span>{content.wordCount} words</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Timer className="w-4 h-4" />
            <span>{content.loadTime}ms</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <HardDrive className="w-4 h-4" />
            <span>{formatBytes(content.responseSize)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{new Date(content.extractedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  AI Summary
                </span>
                <button
                  onClick={() => copyToClipboard(content.summary)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {content.summary}
              </p>
            </div>

            {content.headings && content.headings.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <Heading className="w-4 h-4" />
                  Document Structure
                </h4>
                <div className="space-y-2">
                  {content.headings.slice(0, 10).map((heading, index) => (
                    <div
                      key={index}
                      className={`text-sm text-gray-600 dark:text-gray-400 ${
                        heading.level === 1 ? 'font-semibold' : 
                        heading.level === 2 ? 'font-medium ml-4' : 'ml-8'
                      }`}
                    >
                      H{heading.level}: {heading.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
              <h4 className="font-medium text-gray-800 dark:text-white mb-3">Extracted Content</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {content.content}
              </p>
            </div>

            {content.paragraphs && content.paragraphs.length > 0 && (
              <div>
                <button
                  onClick={() => toggleSection('paragraphs')}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  {expandedSections.has('paragraphs') ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  Paragraphs ({content.paragraphs.length})
                </button>
                {expandedSections.has('paragraphs') && (
                  <div className="mt-3 space-y-3">
                    {content.paragraphs.slice(0, 10).map((paragraph, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded p-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{paragraph}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'images' && (
          <div className="space-y-4">
            {content.images && content.images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.images.map((image, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-600 rounded-lg mb-3 overflow-hidden">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden flex items-center justify-center h-full text-gray-400">
                        <Image className="w-8 h-8" />
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="font-medium text-gray-800 dark:text-white">
                        {image.alt || 'No alt text'}
                      </p>
                      {image.title && (
                        <p className="text-gray-600 dark:text-gray-400">{image.title}</p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-500 break-all">
                        {image.src}
                      </p>
                      {(image.width || image.height) && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {image.width} × {image.height}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Image className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No images found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'links' && (
          <div className="space-y-4">
            {content.links && content.links.length > 0 ? (
              <div className="space-y-3">
                {content.links.map((link, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-1 rounded ${
                        link.type === 'external' 
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                          : 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
                      }`}>
                        <Link className="w-3 h-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 dark:text-white text-sm">
                          {link.text || 'No link text'}
                        </p>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 break-all"
                        >
                          {link.url}
                        </a>
                        <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                          link.type === 'external'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {link.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Link className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No links found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'metadata' && (
          <div className="space-y-4">
            {content.metadata && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(content.metadata).map(([key, value]) => {
                  if (!value) return null;
                  return (
                    <div key={key} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h5 className="font-medium text-gray-800 dark:text-white text-sm mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 break-words">
                        {Array.isArray(value) ? value.join(', ') : value}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'raw' && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-800 dark:text-white">Raw HTML</h4>
                <button
                  onClick={() => copyToClipboard(content.rawHtml || '')}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-x-auto max-h-64 overflow-y-auto">
                {content.rawHtml?.substring(0, 2000)}
                {(content.rawHtml?.length || 0) > 2000 && '...[truncated]'}
              </pre>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 dark:text-white mb-3">Complete Data Object</h4>
              <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-x-auto max-h-64 overflow-y-auto">
                {JSON.stringify(content, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};