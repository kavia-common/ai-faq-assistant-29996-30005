import { Injectable, signal, computed } from '@angular/core';
import { FaqItem } from '../theme';

/** Data shape for an answer in the in-memory model. */
export interface AskResponse {
  id?: string;
  question: string;
  answer: string;
  // Optional citations/sources provided by the in-memory model.
  sources?: Array<{
    title?: string;
    url?: string;
    snippet?: string;
  }>;
  // Optional raw metadata passthrough.
  meta?: Record<string, unknown>;
}

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
/**
 * In-memory service for FAQs and AI answers.
 * Notes:
 * - No network calls are made. All data is served locally.
 * - This replaces previous backend integration (GET /api/faqs, POST /api/ask).
 */
export class FaqService {
  /** Seeded in-memory FAQs. Extend freely as needed. */
  private readonly allFaqs = signal<FaqItem[]>([
    {
      id: '1',
      question: 'How do I use the search to find FAQs?',
      answer:
        'Type keywords into the search bar. Results update instantly to match questions and tags.',
      tags: ['search', 'tips'],
    },
    {
      id: '2',
      question: 'Can I view AI-generated answers without a backend?',
      answer:
        'Yes. This demo uses an in-memory service to provide answers without calling a server.',
      tags: ['ai', 'offline', 'demo'],
    },
    {
      id: '3',
      question: 'How do I run the app locally?',
      answer:
        'Install dependencies and run ng serve. Open http://localhost:3000/. No backend is required.',
      tags: ['setup', 'local', 'serve'],
    },
  ]);

  /** Current search query used for client-side filtering. */
  private readonly query = signal<string>('');
  /**
   * Simulated in-memory answers keyed by faq id or 'custom'.
   * This can be extended to return richer responses or pseudo-streamed updates.
   */
  private readonly answers = signal<Record<string, AskResponse>>({});

  constructor() {
    // Pre-populate answers for the seeded FAQs for a snappy UX.
    for (const it of this.allFaqs()) {
      this.answers.set({
        ...this.answers(),
        [it.id]: {
          id: it.id,
          question: it.question,
          answer: it.answer,
          sources: [],
        },
      });
    }
  }

  // PUBLIC_INTERFACE
  /** Sets the current search query string used for client-side filtering. */
  setQuery(q: string) {
    this.query.set(q);
  }

  // PUBLIC_INTERFACE
  /** Returns the current query. */
  getQuery() {
    return this.query();
  }

  // PUBLIC_INTERFACE
  /** Returns the complete FAQ list (unfiltered). */
  getAllFaqs() {
    return this.allFaqs();
  }

  readonly filteredFaqs = computed(() => {
    const q = this.query().trim().toLowerCase();
    const list = this.allFaqs();
    if (!q) return list;
    return list.filter((f) => {
      const inQuestion = f.question.toLowerCase().includes(q);
      const inTags = (f.tags || []).some((t) => t.toLowerCase().includes(q));
      return inQuestion || inTags;
    });
  });

  // PUBLIC_INTERFACE
  /**
   * Refresh FAQs.
   * In-memory mode: no-op, but kept for API compatibility.
   */
  refreshFaqs() {
    // No network call in standalone mode.
    return;
  }

  // PUBLIC_INTERFACE
  /**
   * Simulate asking for an answer. In-memory: we compute a deterministic answer
   * to mimic an AI response, and store it under the given cache key.
   * @param payload Object containing question and optional faqId
   * @param cacheKey Key to store the result under; defaults to faqId or 'custom'
   */
  ask(
    payload: { question: string; faqId?: string },
    cacheKey?: string
  ) {
    const key = cacheKey ?? payload.faqId ?? 'custom';

    // Simple simulated answer logic
    const baseAnswer =
      'This is a simulated answer. In the full version, a backend model would generate a tailored response.';
    const answerText =
      payload.faqId && this.answers()[payload.faqId]
        ? this.answers()[payload.faqId].answer
        : `${baseAnswer}\n\nYour question: "${payload.question}"`;

    const resp: AskResponse = {
      id: key,
      question: payload.question,
      answer: answerText,
      sources: [],
    };

    // Store the response
    this.answers.set({ ...this.answers(), [key]: resp });
  }

  // PUBLIC_INTERFACE
  /**
   * Retrieve the last AskResponse for the provided key (faq id or 'custom').
   */
  getAnswerFor(key: string) {
    return this.answers()[key] ?? null;
  }
}
