import { Component, input, output, EventEmitter, signal, computed } from '@angular/core';
import { NgFor, NgClass, NgIf } from '@angular/common';
import { FaqItem } from '../../theme';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-faq-list',
  standalone: true,
  imports: [NgFor, NgClass, NgIf],
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.css'],
})
/** Scrollable list of FAQs with visual selection and keyboard accessibility. */
export class FaqListComponent {
  // PUBLIC_INTERFACE
  /** Items to display in the list. */
  items = input<FaqItem[]>([]);
  // PUBLIC_INTERFACE
  /** Currently selected FAQ id. */
  selectedId = input<string | null>(null);
  // PUBLIC_INTERFACE
  /** Emits when an item is selected. */
  select = output<FaqItem>();

  private focusedIndex = signal<number>(-1);
  protected hoverIndex = signal<number>(-1);

  protected count = computed(() => this.items().length);

  onClick(item: FaqItem) {
    this.select.emit(item);
  }

  onKeyDown(e: globalThis.KeyboardEvent) {
    if (!this.count()) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.min(this.focusedIndex() + 1, this.count() - 1);
      this.focusedIndex.set(next);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = Math.max(this.focusedIndex() - 1, 0);
      this.focusedIndex.set(prev);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const idx = this.focusedIndex();
      if (idx >= 0 && idx < this.count()) {
        this.select.emit(this.items()[idx]);
      }
    }
  }

  trackById(_: number, it: FaqItem) {
    return it.id;
  }
}
