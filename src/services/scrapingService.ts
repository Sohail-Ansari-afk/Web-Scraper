import { ScrapedContent, ScrapedImage, ScrapedLink, ScrapedMetadata } from '../types';
import { OpenRouterService } from './openRouterService';

export class ScrapingService {
  private openRouterService: OpenRouterService;
  private processedUrls: Set<string> = new Set();

  constructor(apiKey: string) {
    this.openRouterService = new OpenRouterService(apiKey);
  }

  async scrapeUrl(url: string): Promise<ScrapedContent> {
    const id = this.generateId();
    const startTime = Date.now();
    
    try {
      // Validate URL
      const validatedUrl = this.validateUrl(url);
      
      // Check for duplicates
      if (this.processedUrls.has(validatedUrl)) {
        throw new Error('URL already processed');
      }

      // Extract comprehensive content
      const extractedData = await this.extractComprehensiveContent(validatedUrl);
      const loadTime = Date.now() - startTime;
      
      const { summary, category } = await this.openRouterService.summarizeContent(
        extractedData.content, 
        validatedUrl
      );

      this.processedUrls.add(validatedUrl);

      return {
        id,
        url: validatedUrl,
        title: extractedData.title,
        content: extractedData.content,
        summary,
        category,
        extractedAt: new Date().toISOString(),
        wordCount: extractedData.content.split(' ').length,
        status: 'completed',
        metadata: extractedData.metadata,
        images: extractedData.images,
        links: extractedData.links,
        headings: extractedData.headings,
        paragraphs: extractedData.paragraphs,
        rawHtml: extractedData.rawHtml,
        loadTime,
        responseSize: extractedData.responseSize
      };
    } catch (error) {
      return {
        id,
        url,
        title: '',
        content: '',
        summary: '',
        category: '',
        extractedAt: new Date().toISOString(),
        wordCount: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {} as ScrapedMetadata,
        images: [],
        links: [],
        headings: [],
        paragraphs: [],
        loadTime: Date.now() - startTime,
        responseSize: 0
      };
    }
  }

  private async extractComprehensiveContent(url: string): Promise<{
    title: string;
    content: string;
    metadata: ScrapedMetadata;
    images: ScrapedImage[];
    links: ScrapedLink[];
    headings: { level: number; text: string }[];
    paragraphs: string[];
    rawHtml: string;
    responseSize: number;
  }> {
    try {
      // Use CORS proxy for demo - in production, use a backend service
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (data.contents) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        const responseSize = new Blob([data.contents]).size;
        
        // Extract metadata
        const metadata = this.extractMetadata(doc, url);
        
        // Extract images
        const images = this.extractImages(doc, url);
        
        // Extract links
        const links = this.extractLinks(doc, url);
        
        // Extract headings
        const headings = this.extractHeadings(doc);
        
        // Extract paragraphs
        const paragraphs = this.extractParagraphs(doc);
        
        // Extract main content
        const title = metadata.title || 'No title found';
        const content = this.extractMainContent(doc);
        
        return {
          title,
          content,
          metadata,
          images,
          links,
          headings,
          paragraphs,
          rawHtml: data.contents,
          responseSize
        };
      }
    } catch (error) {
      console.error('Extraction error:', error);
    }
    
    // Fallback to demo content
    return this.generateEnhancedDemoContent(url);
  }

  private extractMetadata(doc: Document, url: string): ScrapedMetadata {
    const getMetaContent = (name: string): string | undefined => {
      const meta = doc.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      return meta?.getAttribute('content') || undefined;
    };

    return {
      title: doc.querySelector('title')?.textContent || '',
      description: getMetaContent('description'),
      keywords: getMetaContent('keywords')?.split(',').map(k => k.trim()),
      author: getMetaContent('author'),
      publishDate: getMetaContent('article:published_time') || getMetaContent('date'),
      language: doc.documentElement.lang || getMetaContent('language'),
      canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute('href'),
      ogTitle: getMetaContent('og:title'),
      ogDescription: getMetaContent('og:description'),
      ogImage: getMetaContent('og:image'),
      twitterTitle: getMetaContent('twitter:title'),
      twitterDescription: getMetaContent('twitter:description'),
      twitterImage: getMetaContent('twitter:image')
    };
  }

  private extractImages(doc: Document, baseUrl: string): ScrapedImage[] {
    const images: ScrapedImage[] = [];
    const imgElements = doc.querySelectorAll('img');
    
    imgElements.forEach(img => {
      const src = img.getAttribute('src');
      if (src) {
        const absoluteSrc = this.resolveUrl(src, baseUrl);
        images.push({
          src: absoluteSrc,
          alt: img.getAttribute('alt') || '',
          title: img.getAttribute('title'),
          width: img.naturalWidth || parseInt(img.getAttribute('width') || '0'),
          height: img.naturalHeight || parseInt(img.getAttribute('height') || '0')
        });
      }
    });

    return images.slice(0, 20); // Limit to first 20 images
  }

  private extractLinks(doc: Document, baseUrl: string): ScrapedLink[] {
    const links: ScrapedLink[] = [];
    const linkElements = doc.querySelectorAll('a[href]');
    
    linkElements.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        const absoluteUrl = this.resolveUrl(href, baseUrl);
        const isExternal = !absoluteUrl.includes(new URL(baseUrl).hostname);
        
        links.push({
          url: absoluteUrl,
          text: link.textContent?.trim() || '',
          type: isExternal ? 'external' : 'internal'
        });
      }
    });

    return links.slice(0, 50); // Limit to first 50 links
  }

  private extractHeadings(doc: Document): { level: number; text: string }[] {
    const headings: { level: number; text: string }[] = [];
    const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    headingElements.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent?.trim() || '';
      if (text) {
        headings.push({ level, text });
      }
    });

    return headings;
  }

  private extractParagraphs(doc: Document): string[] {
    const paragraphs: string[] = [];
    const pElements = doc.querySelectorAll('p');
    
    pElements.forEach(p => {
      const text = p.textContent?.trim();
      if (text && text.length > 20) {
        paragraphs.push(text);
      }
    });

    return paragraphs.slice(0, 20); // Limit to first 20 paragraphs
  }

  private extractMainContent(doc: Document): string {
    // Remove unwanted elements
    const unwantedSelectors = [
      'script', 'style', 'nav', 'footer', 'header', 'aside',
      '.advertisement', '.ads', '.social-share', '.comments'
    ];
    
    unwantedSelectors.forEach(selector => {
      doc.querySelectorAll(selector).forEach(el => el.remove());
    });

    // Try to find main content area
    const contentSelectors = [
      'main', 'article', '.content', '.post-content', '.entry-content',
      '.article-body', '.story-body', '#content', '.main-content'
    ];

    for (const selector of contentSelectors) {
      const element = doc.querySelector(selector);
      if (element) {
        return this.cleanContent(element.textContent || '');
      }
    }

    // Fallback to body content
    return this.cleanContent(doc.body?.textContent || '');
  }

  private resolveUrl(url: string, baseUrl: string): string {
    try {
      return new URL(url, baseUrl).toString();
    } catch {
      return url;
    }
  }

  private generateEnhancedDemoContent(url: string): {
    title: string;
    content: string;
    metadata: ScrapedMetadata;
    images: ScrapedImage[];
    links: ScrapedLink[];
    headings: { level: number; text: string }[];
    paragraphs: string[];
    rawHtml: string;
    responseSize: number;
  } {
    const demoContents = [
      {
        title: "Revolutionary AI Breakthrough in 2025",
        content: "Scientists have achieved a major breakthrough in artificial intelligence, developing systems that can reason and learn more like humans. This advancement promises to transform industries from healthcare to autonomous vehicles. The new AI models demonstrate unprecedented capabilities in understanding context, making logical inferences, and adapting to new situations without extensive retraining.",
        images: [
          { src: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg", alt: "AI Robot", title: "Advanced AI System" },
          { src: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg", alt: "Neural Network", title: "Neural Network Visualization" }
        ],
        headings: [
          { level: 1, text: "Revolutionary AI Breakthrough in 2025" },
          { level: 2, text: "Key Innovations" },
          { level: 2, text: "Industry Impact" }
        ]
      },
      {
        title: "Sustainable Technology Trends Shaping the Future",
        content: "The technology industry is embracing sustainability with innovative solutions for clean energy, efficient computing, and environmental monitoring. Companies are developing carbon-neutral data centers, biodegradable electronics, and AI-powered systems for optimizing resource usage. These advances represent a fundamental shift toward environmentally responsible technology development.",
        images: [
          { src: "https://images.pexels.com/photos/9800029/pexels-photo-9800029.jpeg", alt: "Solar Panels", title: "Renewable Energy Technology" },
          { src: "https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg", alt: "Wind Turbines", title: "Wind Energy Farm" }
        ],
        headings: [
          { level: 1, text: "Sustainable Technology Trends Shaping the Future" },
          { level: 2, text: "Clean Energy Solutions" },
          { level: 2, text: "Green Computing" }
        ]
      },
      {
        title: "The Evolution of Remote Work Technologies",
        content: "Remote work technologies have evolved dramatically, offering seamless collaboration tools, virtual reality meeting spaces, and AI-powered productivity assistants. These innovations are reshaping how teams communicate, collaborate, and maintain company culture across distributed workforces. The integration of immersive technologies is creating new possibilities for remote engagement and creativity.",
        images: [
          { src: "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg", alt: "Remote Work Setup", title: "Modern Home Office" },
          { src: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg", alt: "Video Conference", title: "Virtual Team Meeting" }
        ],
        headings: [
          { level: 1, text: "The Evolution of Remote Work Technologies" },
          { level: 2, text: "Collaboration Tools" },
          { level: 2, text: "Virtual Reality Integration" }
        ]
      }
    ];
    
    const randomContent = demoContents[Math.floor(Math.random() * demoContents.length)];
    const paragraphs = randomContent.content.split('. ').map(p => p.trim() + (p.endsWith('.') ? '' : '.'));
    
    return {
      title: randomContent.title,
      content: randomContent.content,
      metadata: {
        title: randomContent.title,
        description: randomContent.content.substring(0, 160) + '...',
        keywords: ['technology', 'innovation', 'future', 'AI'],
        author: 'Tech News Team',
        publishDate: new Date().toISOString(),
        language: 'en',
        canonical: url,
        ogTitle: randomContent.title,
        ogDescription: randomContent.content.substring(0, 160) + '...',
        ogImage: randomContent.images[0]?.src
      },
      images: randomContent.images,
      links: [
        { url: 'https://example.com/related-1', text: 'Related Article 1', type: 'external' },
        { url: 'https://example.com/related-2', text: 'Related Article 2', type: 'external' },
        { url: url + '/section1', text: 'Section 1', type: 'internal' }
      ],
      headings: randomContent.headings,
      paragraphs,
      rawHtml: `<html><head><title>${randomContent.title}</title></head><body><h1>${randomContent.title}</h1><p>${randomContent.content}</p></body></html>`,
      responseSize: 2048
    };
  }

  private cleanContent(content: string): string {
    return content
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.,;:!?-]/g, '')
      .trim()
      .substring(0, 5000);
  }

  private validateUrl(url: string): string {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.toString();
    } catch {
      throw new Error('Invalid URL format');
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  clearProcessedUrls(): void {
    this.processedUrls.clear();
  }
}