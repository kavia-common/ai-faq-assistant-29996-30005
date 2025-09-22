import { Component, effect, signal, computed } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { FaqListComponent } from './components/faq-list/faq-list.component';
import { AnswerPanelComponent } from './components/answer-panel/answer-panel.component';
import { FaqService, AskResponse } from './services/faq.service';
import { FaqItem } from './theme';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, TopNavComponent, SearchBarComponent, FaqListComponent, AnswerPanelComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
/** Root application component assembling the Ocean Professional UI. */
export class AppComponent {
  /** Application title used in top navigation. */
  title = 'AI FAQ';

  protected query = signal<string>('');
  protected selected = signal<FaqItem | null>(null);
  protected items = signal<FaqItem[]>([]);
  protected selectedId = computed(() => this.selected()?.id ?? null);

  constructor(private readonly faqService: FaqService) {
    // Wire service filters to query
    effect(() => {
      this.faqService.setQuery(this.query());
    });

    // Reflect filtered list into component state
    effect(() => {
      this.items.set(this.faqService.filteredFaqs());
    });

    // When a FAQ is selected, ask backend for its answer and update the selected item with sources.
    effect(() => {
      const it = this.selected();
      if (!it) return;

      // Kick off backend ask call
      this.faqService.ask({ question: it.question, faqId: it.id }, it.id);

      // After some time the service will have the answer cached; we read it reactively on subsequent change detection
      const resp = this.faqService.getAnswerFor(it.id);
      if (resp) {
        const merged: FaqItem = {
          ...it,
          answer: resp.answer ?? it.answer,
          sources: resp.sources ?? it.sources,
        };
        // Update selection reference with enriched data
        this.selected.set(merged);
      }
    });
  }

  // PUBLIC_INTERFACE
  /** Called when the search input changes. If the user typed a custom question, trigger a backend ask and preview it on the right. */
  onSearchChange(v: string) {
    this.query.set(v);

    // If user enters a non-empty question that doesn't match a selected FAQ, treat as custom ask
    const trimmed = v.trim();
    if (trimmed.length > 0) {
      // Use a transient item to display the custom question and progressive answer.
      const temp: FaqItem = {
        id: 'custom',
        question: trimmed,
        answer: 'Thinking…',
        tags: [],
      };
      this.selected.set(temp);
      // Request answer for custom input
      this.faqService.ask({ question: trimmed }, 'custom');

      // Attempt to merge the latest response, if already available (subsequent change detection will also merge)
      const resp: AskResponse | null = this.faqService.getAnswerFor('custom');
      if (resp) {
        this.selected.set({
          ...temp,
          answer: resp.answer || temp.answer,
          sources: resp.sources || [],
        });
      }
    }
  }

  // PUBLIC_INTERFACE
  /** Called when a FAQ item is selected from the list. */
  onSelect(item: FaqItem) {
    // Show initial selection immediately, answer will be replaced on arrival.
    this.selected.set({ ...item, answer: item.answer || 'Loading answer…' });
    // The effect above will trigger the ask and merge answer/sources.
  }
}
