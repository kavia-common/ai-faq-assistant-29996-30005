import { Component, effect, signal, computed } from '@angular/core';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { FaqListComponent } from './components/faq-list/faq-list.component';
import { AnswerPanelComponent } from './components/answer-panel/answer-panel.component';
import { FaqService } from './services/faq.service';
import { FaqItem } from './theme';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TopNavComponent, SearchBarComponent, FaqListComponent, AnswerPanelComponent],
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
    // Bind service-derived computed after DI to avoid "used before initialization".
    effect(() => {
      this.faqService.setQuery(this.query());
    });
    effect(() => {
      this.items.set(this.faqService.filteredFaqs());
    });
  }

  onSearchChange(v: string) {
    this.query.set(v);
  }

  onSelect(item: FaqItem) {
    this.selected.set(item);
  }
}
