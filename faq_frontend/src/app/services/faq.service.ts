import { Injectable, signal, computed } from '@angular/core';
import { FaqItem } from '../theme';

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
/** Provides FAQ items and client-side search. This is a mock in-memory data provider for the initial UI. */
export class FaqService {
  private readonly allFaqs = signal<FaqItem[]>([
    {
      id: '1',
      question: 'What is this AI-powered FAQ app?',
      answer:
        'It is a modern web interface that lets you browse frequently asked questions and see AI-generated answers quickly.',
      tags: ['general', 'about'],
    },
    {
      id: '2',
      question: 'How do I search for a question?',
      answer:
        'Use the search bar at the top. Results update instantly as you type, matching question text and tags.',
      tags: ['search', 'usage'],
    },
    {
      id: '3',
      question: 'Can I use this on mobile devices?',
      answer:
        'Yes. The layout is responsive, with a scrollable FAQ list and an answer panel optimized for smaller screens.',
      tags: ['mobile', 'responsive'],
    },
    {
      id: '4',
      question: 'How are answers generated?',
      answer:
        'Answers are produced by AI and can be integrated with a backend in future iterations. This build uses mock data only.',
      tags: ['ai', 'architecture'],
    },
    {
      id: '5',
      question: 'Is there keyboard accessibility?',
      answer:
        'Yes. You can navigate questions using Tab and activate selections with Enter. Focus styles are visible.',
      tags: ['accessibility', 'a11y'],
    },
  ]);

  private readonly query = signal<string>('');

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
}
