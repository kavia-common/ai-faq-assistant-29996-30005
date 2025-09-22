import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FaqItem } from '../theme';
import { environment } from '../../environments/environment';

/** Data shape returned by the backend for a single answer. */
export interface AskResponse {
  id?: string;
  question: string;
  answer: string;
  // Additional citations/sources returned by the backend.
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
 * HTTP-backed service for FAQs and AI answers.
 * Integration points:
 * - GET `${apiBaseUrl}/faqs` to fetch FAQ list
 * - POST `${apiBaseUrl}/ask` with { question, faqId? } to fetch generated answer
 *
 * Error handling:
 * - Centralized here; components only deal with friendly states.
 */
export class FaqService {
  private readonly http = inject(HttpClient);

  // Configurable base URL from environment.ts/environment.prod.ts
  private readonly apiBase = environment.apiBaseUrl;

  /** Local cache of all FAQs loaded from the backend. */
  private readonly allFaqs = signal<FaqItem[]>([]);
  /** Current search query used for client-side filtering. */
  private readonly query = signal<string>('');
  /** Last answer received from the backend, keyed by faq id (or 'custom'). */
  private readonly answers = signal<Record<string, AskResponse>>({});

  constructor() {
    // Load FAQs on service creation. In SSR, guard against network if needed.
    this.refreshFaqs();
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
   * Refresh the FAQ list from the backend.
   * GET /api/faqs -> Array<FaqItem>
   */
  refreshFaqs() {
    this.http.get<FaqItem[]>(`${this.apiBase}/faqs`).subscribe({
      next: (items) => {
        // Defensive: normalize to expected fields
        const normalized = (items || []).map((it, idx) => ({
          id: it.id ?? String(idx + 1),
          question: it.question ?? '',
          answer: it.answer ?? '',
          tags: it.tags ?? [],
          // Any other fields are ignored here intentionally
        }));
        this.allFaqs.set(normalized);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load FAQs', err);
        // Keep previous value; optionally set to [] on first load failure
        if (!this.allFaqs().length) {
          this.allFaqs.set([]);
        }
      },
    });
  }

  // PUBLIC_INTERFACE
  /**
   * Ask the backend for an answer.
   * POST /api/ask -> AskResponse
   * @param payload Object containing question and optional faqId
   * @param cacheKey Key to store the result under; defaults to faqId or 'custom'
   */
  ask(
    payload: { question: string; faqId?: string },
    cacheKey?: string
  ) {
    const key = cacheKey ?? payload.faqId ?? 'custom';
    this.http.post<AskResponse>(`${this.apiBase}/ask`, payload).subscribe({
      next: (resp) => {
        // Store by key for quick retrieval
        this.answers.set({ ...this.answers(), [key]: resp });
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to get answer', err);
        // Provide a graceful fallback answer for the UI
        const fallback: AskResponse = {
          question: payload.question,
          answer:
            'Sorry, we could not retrieve an answer at this time. Please try again later.',
          sources: [],
        };
        this.answers.set({ ...this.answers(), [key]: fallback });
      },
    });
  }

  // PUBLIC_INTERFACE
  /**
   * Retrieve the last AskResponse for the provided key (faq id or 'custom').
   */
  getAnswerFor(key: string) {
    return this.answers()[key] ?? null;
  }
}
