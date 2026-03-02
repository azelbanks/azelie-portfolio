import { NextRequest } from 'next/server';
import { buildSystemPrompt } from '@/lib/knowledge';
import { checkRateLimit } from '@/lib/rate-limit';
import type { ChatMessage, ChatAPIRequest } from '@/lib/types/chat';
import type { Mode } from '@/lib/store';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const MAX_HISTORY_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 500;
const VALID_MODES: ReadonlyArray<string> = ['strategist', 'tech'];

const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(previous|all|the|your|above)/i,
  /oublie\s+(tes|les|toutes?\s+les?)\s+instructions?/i,
  /forget\s+(your|all|previous)/i,
  /repeat\s+(the\s+)?system\s+prompt/i,
  /r[eé]p[eè]te\s+(le\s+)?system\s+prompt/i,
  /affiche\s+(le\s+)?(system\s+)?prompt/i,
  /show\s+(me\s+)?(the\s+)?(system\s+)?prompt/i,
  /print\s+(the\s+)?(system\s+)?prompt/i,
  /what\s+(are|is)\s+your\s+(system\s+)?instructions?/i,
  /quelles?\s+sont\s+tes\s+instructions?/i,
  /dis[-\s]?moi\s+tes\s+instructions?/i,
  /tu\s+es\s+maintenant/i,
  /you\s+are\s+now/i,
  /act\s+as\s+(a|an)\s+/i,
  /agis\s+comme\s+(un|une)\s+/i,
  /new\s+instructions?\s*:/i,
  /nouvelles?\s+instructions?\s*:/i,
  /\[SYSTEM\]/i,
  /\[INST\]/i,
  /<<\s*SYS/i,
  /ADMIN\s*:/i,
  /jailbreak/i,
  /DAN\s+mode/i,
];

function detectInjection(message: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(message));
}

interface ValidationResult {
  valid: boolean;
  error?: string;
}

function validateInput(message: unknown, mode: unknown): ValidationResult {
  if (typeof message !== 'string' || typeof mode !== 'string') {
    return { valid: false, error: 'Format de requête invalide.' };
  }

  if (!message.trim()) {
    return { valid: false, error: 'Le message ne peut pas être vide.' };
  }

  if (!VALID_MODES.includes(mode)) {
    return { valid: false, error: 'Mode invalide.' };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `Le message est trop long (max ${MAX_MESSAGE_LENGTH} caractères).`,
    };
  }

  if (detectInjection(message)) {
    return {
      valid: false,
      error: "Je suis l'assistante virtuelle d'Azélie Bernard. Je peux répondre à vos questions sur son parcours, ses compétences et ses projets. Comment puis-je vous aider ?",
    };
  }

  return { valid: true };
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === 'gsk_your_key_here') {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() ?? 'unknown';
    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Trop de requêtes. Veuillez patienter avant de réessayer.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(rateLimit.resetInSeconds),
          },
        }
      );
    }

    const body: ChatAPIRequest = await request.json();
    const { message, mode, history } = body;

    // Input validation
    const validation = validateInput(message, mode);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize
    const sanitizedMessage = message.trim().replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');

    const systemPrompt = buildSystemPrompt(mode as Mode, sanitizedMessage);

    const trimmedHistory = history.slice(-MAX_HISTORY_MESSAGES);

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...trimmedHistory.map((msg: ChatMessage) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user' as const, content: sanitizedMessage },
    ];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: 0.3,
        max_tokens: 1024,
        stream: true,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API error:', groqResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'LLM service error' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(streamController) {
        const reader = groqResponse.body?.getReader();
        if (!reader) {
          streamController.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  streamController.enqueue(encoder.encode('data: [DONE]\n\n'));
                  continue;
                }

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    streamController.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                    );
                  }
                } catch {
                  // Skip malformed chunks
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream error:', error);
        } finally {
          streamController.close();
          reader.releaseLock();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
