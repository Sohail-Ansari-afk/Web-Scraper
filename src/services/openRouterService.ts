const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export class OpenRouterService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async summarizeContent(content: string, url: string): Promise<{ summary: string; category: string }> {
    const prompt = `
    Analyze and summarize the following web content from ${url}:

    Content: ${content.substring(0, 4000)} ${content.length > 4000 ? '...[truncated]' : ''}

    Please provide:
    1. A concise, informative summary (2-3 sentences)
    2. A category classification (Technology, Business, News, Research, Entertainment, Other)

    Format your response as:
    SUMMARY: [your summary here]
    CATEGORY: [category here]
    `;

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Web Scraper',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1-distill-llama-70b',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const result = data.choices[0]?.message?.content || '';
      
      const summaryMatch = result.match(/SUMMARY:\s*(.*?)(?=CATEGORY:|$)/s);
      const categoryMatch = result.match(/CATEGORY:\s*(.*?)$/s);
      
      return {
        summary: summaryMatch?.[1]?.trim() || 'Summary unavailable',
        category: categoryMatch?.[1]?.trim() || 'Other'
      };
    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw new Error('Failed to generate summary');
    }
  }
}