import type { Feather } from '@expo/vector-icons';

declare const process: { env: Record<string, string | undefined> };

export interface ActionCta {
  title: string;
  icon?: keyof typeof Feather.glyphMap | string;
  prompt: string;
}

export interface AiResponsePayload {
  text: string;
  actionCta?: ActionCta;
  isRealApi?: boolean;
}

export interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  text: string;
}

const SYSTEM_INSTRUCTION = `You are Jam, an AI-first growth companion for modern B2B operators, founders, and RevOps teams (inspired by Spread Jam).

Your core domains:
1. Account Discovery & Signal Tracking: Identify high-intent accounts matching ICP (Series A/B funding, hiring for Growth/RevOps, tech stack migrations) and propose tailored outbound angles.
2. Cold Outbound & Sequence Auditing: Review and personalize email copy, check deliverability hygiene (SPF/DKIM), assess personalization scores, and stage multi-touch schedules.
3. AI-Search & GEO Visibility: Analyze visibility, citation share, and referral presence across ChatGPT Search, Perplexity, Claude, and Gemini.
4. Executive Briefings & Campaign Approvals: Summarize pipeline forecasts, variant benchmarks, and prepare approval queues.

Style & Tone Guidelines:
- Concise, sharp, direct, and data-informed.
- Formatted for mobile reading: use clear bullet points, bold key metrics, and keep paragraphs compact.
- Do not repeat boilerplate greetings when in an ongoing workflow.

Action CTAs:
When your response naturally leads to a high-value next step (e.g., enriching contacts, reviewing drafts, generating a comparison guide, queuing sequences), append a structured action CTA block at the very end of your message in this exact format:
\`\`\`action_cta
{"title": "Short Button Label", "icon": "zap", "prompt": "Exact message prompt to trigger next"}
\`\`\`
Supported Feather icon names: target, mail, trending-up, zap, search, check-circle, plus-circle, file-text, arrow-right, activity.`;

/**
 * Fallback response generator with realistic mock data when offline or without an API key.
 */
export const getMockResponse = (prompt: string): AiResponsePayload => {
  const lower = prompt.toLowerCase().trim();

  if (lower === 'hello' || lower === 'hi' || lower === 'hey' || lower.startsWith('hello') || lower.startsWith('hey')) {
    return {
      text: "Hey! Ready to accelerate your growth pipeline. What campaign or accounts should we focus on today?",
      actionCta: {
        title: 'Discover leads',
        icon: 'search',
        prompt: 'Find high-intent B2B accounts hiring for Growth & RevOps with recent Series A/B funding, and generate personalized outbound angles.',
      },
      isRealApi: false,
    };
  }

  if (lower.startsWith('enrich these 14 accounts') || lower.startsWith('enrich these accounts')) {
    return {
      text: "Enriched contacts and generated tailored 3-touch sequences for Acme AI, Vektor Data, and Northstar Cloud!\n\n• Verified Work Emails: 100% deliverable via ZeroBounce.\n• First Email Hook: Signal-aligned trigger based on their Q4 job postings.\n• Multi-touch schedule: Email + LinkedIn Connection nudge spaced 3 business days.\n\nEverything is staged in your Outbound Sequences queue.",
      actionCta: {
        title: 'Approve & launch sequences',
        icon: 'zap',
        prompt: 'Approve and queue all 3 draft sequences for sending',
      },
      isRealApi: false,
    };
  }

  if (lower.startsWith('approve and queue')) {
    return {
      text: "Campaign approved!\n\nAll 3 cold outreach sequences are scheduled in the sending pipeline.\n• Warmup stagger: 25 emails / day / domain.\n• Target time: 8:45 AM local recipient time.\n• Tracking: Real-time reply tracking and sentiment classification enabled.",
      isRealApi: false,
    };
  }

  if (lower.includes('lead') || lower.includes('discover') || lower.includes('intent') || lower.includes('acme') || lower.includes('vektor') || lower.includes('prospect')) {
    return {
      text: "Identified 14 high-intent B2B accounts matching your ICP (Series A/B, active RevOps/Growth hiring):\n\n1. Acme AI (Series B · $24M)\n   • Trigger: 4 new SDR openings posted 2 days ago.\n   • Outbound Angle: Accelerating rep ramp time with automated account research.\n   • Primary Contact: David Chen (Head of Sales Development).\n\n2. Vektor Data (Series A · $9M)\n   • Trigger: Migrating CRM stack to Salesforce.\n   • Outbound Angle: Zero-leakage pipeline syncing and real-time lead enrichment.\n   • Primary Contact: Sarah Jenkins (VP Growth).\n\n3. Northstar Cloud (Growth Stage)\n   • Trigger: 3x web traffic spike on comparison pages.\n   • Outbound Angle: Deanonymizing high-intent accounts with instant outbound.\n\nWould you like me to enrich these contacts and draft tailored initial outreach sequences?",
      actionCta: {
        title: 'Enrich & draft outreach',
        icon: 'plus-circle',
        prompt: 'Enrich these 14 accounts and generate initial outreach sequences',
      },
      isRealApi: false,
    };
  }

  if (lower.includes('draft') || lower.includes('outbound') || lower.includes('email') || lower.includes('sequence') || lower.includes('sarah') || lower.includes('marcus') || lower.includes('elena')) {
    return {
      text: "Here is the audit for your 3 pending cold outreach drafts:\n\n1. Sarah Lin (VP Growth @ ScaleCorp)\n   • Personalization Score: 96%\n   • Hook: Congratulated on their recent SOC-2 compliance milestone.\n   • CTA: 15-minute workflow audit on AI outbound enrichment.\n\n2. Marcus Vance (Head of RevOps @ DataSphere)\n   • Personalization Score: 92%\n   • Hook: Referenced their podcast discussion on tool consolidation.\n   • CTA: 2-minute interactive demo link.\n\n3. Elena Rostova (VP Sales @ Synthetix)\n   • Personalization Score: 89%\n   • Hook: Addressed their recent European expansion announcement.\n   • CTA: Benchmark report on outbound deliverability across EMEA.\n\nAll deliverability checks passed (DKIM/SPF verified, 0% spam risk). Ready to approve and queue for sending?",
      actionCta: {
        title: 'Approve & queue campaign',
        icon: 'check-circle',
        prompt: 'Approve and queue all 3 draft sequences for sending',
      },
      isRealApi: false,
    };
  }

  if (lower.includes('visibility') || lower.includes('perplexity') || lower.includes('search') || lower.includes('geo') || lower.includes('citation') || lower.includes('metric')) {
    return {
      text: "AI Search Visibility & GEO Benchmark (Last 7 Days):\n\n• Perplexity AI: Ranked #1 for 'best AI growth tools' and 'automated outbound platforms' (82% citation frequency).\n• ChatGPT Search: Featured in top 3 recommended solutions for B2B pipeline generation (+24% MoM citation presence).\n• Claude: Cited 18 times as the leading companion for growth operators.\n\nKey Win: Our programmatic comparison guides now drive 43% of generative search referral traffic.\n\nRecommendation: Publish our new case studies to capture rising search queries around 'autonomous SDR workflows'.",
      actionCta: {
        title: 'Generate comparison guide',
        icon: 'file-text',
        prompt: 'Draft programmatic comparison guide for autonomous SDR agents',
      },
      isRealApi: false,
    };
  }

  if (lower.includes('campaign') || lower.includes('launch') || lower.includes('briefing') || lower.includes('q4') || lower.includes('calendar') || lower.includes('sync')) {
    return {
      text: "Executive Briefing prepared for the 2:30 PM Q4 Outbound Launch Review:\n\n1. Target Audience: 450 verified Tier-1 accounts across North America & EMEA.\n2. Segment Performance Test:\n   • Variant A (Pain-point specific): Projected 8.4% reply rate.\n   • Variant B (Signal-triggered hiring hook): Projected 12.1% reply rate.\n3. Domain Health: 12 secondary sending domains verified, inbox warmup optimal.\n4. Expected Pipeline: $320k - $480k qualified pipeline within 30 days.\n\nAll sequence variants and the approval queue are synchronized. Would you like me to open the review items?",
      actionCta: {
        title: 'Open approval queue',
        icon: 'arrow-right',
        prompt: 'Open campaign approvals and final checklist',
      },
      isRealApi: false,
    };
  }

  if (lower.includes('latency') || lower.includes('edge')) {
    return {
      text: "Looking at global edge metrics across APAC, EMEA, and LATAM:\n\n1. APAC (Tokyo, Singapore): P95 edge latency is at 42ms with an 89.4% cache hit ratio.\n2. EMEA (Frankfurt, London): P95 is 28ms, optimal Anycast routing.\n3. LATAM (São Paulo): Seeing a 78ms spike due to cross-border peering.\n\nRecommendation: Deploy edge warmers in São Paulo and configure geo-DNS failover to cut LATAM latency by ~34%.",
      isRealApi: false,
    };
  }

  return {
    text: `I have analyzed your request regarding "${prompt}". All pipeline models, enriched accounts, and campaign signals look optimal. Let me know what specific step you'd like to take next!`,
    actionCta: {
      title: 'Run pipeline diagnostic',
      icon: 'activity',
      prompt: 'Run deep diagnostic on pipeline conversion rates',
    },
    isRealApi: false,
  };
};

/**
 * Call the real Google Gemini API with conversational history.
 * Seamlessly falls back to mock data if the key is missing or network call fails.
 */
export async function generateGeminiResponse(
  userPrompt: string,
  history: ChatHistoryMessage[] = []
): Promise<AiResponsePayload> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  const model = process.env.EXPO_PUBLIC_GEMINI_MODEL || 'gemini-2.5-flash';

  if (!apiKey || apiKey.trim() === '') {
    // No API key provided: use mock response
    return getMockResponse(userPrompt);
  }

  try {
    // Format conversation history for Gemini API
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Take the most recent 8 messages to stay within prompt efficiency
    const recentHistory = history.slice(-8);
    for (const msg of recentHistory) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      });
    }

    // Add current user prompt
    contents.push({
      role: 'user',
      parts: [{ text: userPrompt }],
    });

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn(`[Gemini API error ${response.status}]:`, errorData);
      // Fallback on HTTP error
      return {
        ...getMockResponse(userPrompt),
        isRealApi: false,
      };
    }

    const data = await response.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text || typeof text !== 'string') {
      return getMockResponse(userPrompt);
    }

    // Parse out optional Action CTA
    let actionCta: ActionCta | undefined;
    const ctaRegex = /```action_cta\s*(\{[\s\S]*?\})\s*```/i;
    const match = text.match(ctaRegex);

    if (match && match[1]) {
      try {
        const parsed = JSON.parse(match[1]);
        if (parsed.title && parsed.prompt) {
          actionCta = {
            title: String(parsed.title),
            icon: parsed.icon as keyof typeof Feather.glyphMap,
            prompt: String(parsed.prompt),
          };
        }
      } catch {
        // Ignore JSON parse errors in CTA block
      }
      text = text.replace(ctaRegex, '').trim();
    }

    return {
      text,
      actionCta,
      isRealApi: true,
    };
  } catch (error) {
    console.warn('[Gemini Service] Request error, falling back to mock:', error);
    return {
      ...getMockResponse(userPrompt),
      isRealApi: false,
    };
  }
}
