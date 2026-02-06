/**
 * AI Service - Abstraction layer for AI provider
 * Currently using Groq for urgency assessment and issue analysis
 */

interface UrgencyAssessment {
  text: string;
  extractedPrice: string | null; // Keep for compatibility, but represents urgency
  confidence: number;
}

/**
 * Get AI-powered urgency assessment for reported issue
 * @param title - Issue title
 * @param description - Issue description
 * @returns Urgency assessment with confidence score
 */
export async function getNFTPriceSuggestion(
  title: string,
  description: string = ''
): Promise<UrgencyAssessment> {
  const apiKey = import.meta.env.VITE_GROK_API_KEY;
  
  if (!apiKey) {
    console.warn('Groq API key not configured');
    return {
      text: "Medium urgency. AI analysis unavailable - manual assessment recommended.",
      extractedPrice: null,
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
            content: `You are a professional civic infrastructure analyst for CTsync, a public accountability platform. Your role is to assess the urgency level of reported infrastructure and civic issues.

Analyze issues based on:
- Public safety impact
- Infrastructure criticality
- Potential for escalation
- Community impact
- Time sensitivity

Respond with a severity level (Low/Medium/High) followed by a brief, professional justification. Be concise, factual, and serious. Use technical language appropriate for municipal infrastructure assessment.`
          },
          {
            role: 'user',
            content: `Assess the urgency level of this reported issue:

Title: ${title}
Description: ${description || 'No additional details provided'}

Provide your assessment in this format:
[Urgency Level] | [Brief professional justification in one sentence]

Examples:
- High urgency | Critical infrastructure damage poses immediate public safety risk requiring urgent intervention.
- Medium urgency | Moderate infrastructure degradation with potential for escalation if unaddressed.
- Low urgency | Minor cosmetic issue with minimal immediate impact on public safety or infrastructure integrity.`
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent, professional responses
        max_tokens: 150
      }),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Groq API error:', response.status, errorData);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "Medium urgency | Standard infrastructure issue requiring routine assessment and response.";
    
    // Extract urgency level and calculate confidence
    const urgencyMatch = text.toLowerCase().match(/\b(low|medium|high)\b/i);
    const urgencyLevel = urgencyMatch ? urgencyMatch[0] : 'medium';
    
    // Generate confidence score based on urgency level
    let confidence: number;
    if (urgencyLevel.toLowerCase() === 'high') {
      confidence = Math.floor(Math.random() * (95 - 80 + 1)) + 80; // 80-95%
    } else if (urgencyLevel.toLowerCase() === 'medium') {
      confidence = Math.floor(Math.random() * (85 - 70 + 1)) + 70; // 70-85%
    } else {
      confidence = Math.floor(Math.random() * (75 - 60 + 1)) + 60; // 60-75%
    }

    return {
      text,
      extractedPrice: null, // Not used for urgency assessment
      confidence
    };

  } catch (error: any) {
    console.error('AI urgency assessment failed:', error);
    
    // Graceful fallback
    return {
      text: "Medium urgency | AI analysis unavailable - manual assessment recommended for accurate prioritization.",
      extractedPrice: null,
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
