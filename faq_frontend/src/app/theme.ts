export const THEME = {
  name: 'Ocean Professional',
  colors: {
    primary: '#2563EB',
    secondary: '#F59E0B',
    error: '#EF4444',
    background: '#f9fafb',
    surface: '#ffffff',
    text: '#111827',
    textMuted: '#4B5563',
    border: '#E5E7EB',
    shadow: '0 4px 14px rgba(37, 99, 235, 0.08)',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
  },
  transition: {
    base: 'all .2s ease',
    slow: 'all .35s ease',
  },
};

// Types
// PUBLIC_INTERFACE
export interface FaqSource {
  /** Title of the source, if available. */
  title?: string;
  /** URL to the source/citation. */
  url?: string;
  /** Short snippet/summary provided by backend. */
  snippet?: string;
}

// PUBLIC_INTERFACE
export interface FaqItem {
  /** Unique identifier of the FAQ. */
  id: string;
  /** The question text. */
  question: string;
  /** The latest known answer for this question (initial or from backend). */
  answer: string;
  /** Optional tags for filtering. */
  tags?: string[];
  /** Optional citations/sources related to the answer (from backend). */
  sources?: FaqSource[];
}
