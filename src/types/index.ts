export interface ScrapedImage {
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
}

export interface ScrapedLink {
  url: string;
  text: string;
  type: 'internal' | 'external';
}

export interface ScrapedMetadata {
  title: string;
  description?: string;
  keywords?: string[];
  author?: string;
  publishDate?: string;
  language?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

export interface ScrapedContent {
  id: string;
  url: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  extractedAt: string;
  wordCount: number;
  status: 'processing' | 'completed' | 'error';
  error?: string;
  
  // Enhanced data
  metadata: ScrapedMetadata;
  images: ScrapedImage[];
  links: ScrapedLink[];
  headings: { level: number; text: string }[];
  paragraphs: string[];
  rawHtml?: string;
  loadTime: number;
  responseSize: number;
}

export interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface ScrapeJob {
  id: string;
  urls: string[];
  status: 'pending' | 'processing' | 'completed' | 'error';
  results: ScrapedContent[];
  createdAt: string;
}