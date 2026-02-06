/**
 * AI Service - Abstraction layer for AI provider
 * Currently using Groq for NFT recommendations and pricing
 */

interface PriceSuggestion {
  text: string;
  extractedPrice: string | null;
  confidence: number;
}

/**
 * Get AI-powered price suggestion for NFT
 * @param title - NFT title
 * @param description - NFT description
 * @returns Price suggestion with confidence score
 */
export async function getNFTPriceSuggestion(
  title: string,
  description: string = ''
): Promise<PriceSuggestion> {
  const apiKey = import.meta.env.VITE_GROK_API_KEY;
  
  if (!apiKey) {
    console.warn('Groq API key not configured');
    return {
      text: "1.0 | Our AI servers are fried from too much drip. Just guess it.",
      extractedPrice: "1.0",
      confidence: 60
    };
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an expert NFT pricing analyst for an underground marketplace. Respond with a price in ETH followed by a one-sentence vibe-check using Gen-Z crypto slang. Be humorous and concise.'
          },
          {
            role: 'user',
            content: `Analyze this NFT and suggest a realistic floor price in ETH for an underground marketplace.
Title: ${title}
Description: ${description}

Format: [price] | [one-sentence vibe-check]
Example: 0.5 | This vibe is immaculate, definitely floor-breaker material.`
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      }),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API error:', response.status, errorData);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "0.5 | This vibe is immaculate, definitely floor-breaker material.";
    
    // Extract price from response
    const match = text.match(/\d+(\.\d+)?/);
    const extractedPrice = match ? match[0] : null;
    
    // Generate confidence score (85-98%)
    const confidence = Math.floor(Math.random() * (98 - 85 + 1)) + 85;

    return {
      text,
      extractedPrice,
      confidence
    };

  } catch (error: any) {
    console.error('AI pricing failed:', error);
    
    // Graceful fallback
    return {
      text: "1.0 | Our AI servers are fried from too much drip. Just guess it.",
      extractedPrice: "1.0",
      confidence: 60
    };
  }
}

/**
 * Get AI insights for NFT (placeholder for future features)
 * @param metadata - NFT metadata
 * @returns AI-generated insights
 */
export async function getNFTInsights(metadata: {
  name: string;
  description: string;
  attributes?: Array<{ trait_type: string; value: string }>;
}): Promise<{ summary: string; insights: string[]; confidence: number }> {
  // Placeholder for future implementation
  return {
    summary: "AI insights coming soon",
    insights: [],
    confidence: 0
  };
}

/**
 * Get rarity summary for NFT traits (placeholder for future features)
 * @param traits - NFT traits
 * @returns Rarity analysis
 */
export async function getRaritySummary(
  traits: Array<{ trait_type: string; value: string }>
): Promise<{ rarity: string; score: number }> {
  // Placeholder for future implementation
  return {
    rarity: "Common",
    score: 0
  };
}
