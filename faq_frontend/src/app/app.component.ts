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

    // When a FAQ is selected, simulate asking and update the selected item with (in-memory) answer and sources.
    effect(() => {
      const it = this.selected();
      if (!it) return;

      // Trigger in-memory ask
      this.faqService.ask({ question: it.question, faqId: it.id }, it.id);

      // Merge latest response back into selection
      const resp = this.faqService.getAnswerFor(it.id);
      if (resp) {
        const merged: FaqItem = {
          ...it,
          answer: resp.answer ?? it.answer,
          sources: resp.sources ?? it.sources,
        };
        this.selected.set(merged);
      }
    });
  }

  // PUBLIC_INTERFACE
  /** Called when the search input changes. If the user typed a custom question, simulate an answer and preview it on the right. */
  onSearchChange(v: string) {
    this.query.set(v);

    const trimmed = v.trim();
    if (trimmed.length > 0) {
      const temp: FaqItem = {
        id: 'custom',
        question: trimmed,
        answer: 'Thinking…',
        tags: [],
      };
      this.selected.set(temp);
      // Simulated answer for custom input
      this.faqService.ask({ question: trimmed }, 'custom');

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
    this.selected.set({ ...item, answer: item.answer || 'Loading answer…' });
  }
}
