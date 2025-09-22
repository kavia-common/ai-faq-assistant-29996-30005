import { Component, EventEmitter, output, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
/** Search input used to filter FAQ questions. Emits value changes immediately. */
export class SearchBarComponent {
  // PUBLIC_INTERFACE
  /** Current text value of the search box. */
  model = input<string>('');
  // PUBLIC_INTERFACE
  /** Emitted when the input value changes. */
  modelChange = output<string>();
  // PUBLIC_INTERFACE
  /** Optional placeholder text. */
  placeholder = input<string>('Search questions, topics, or tags...');

  onInput(v: string) {
    this.modelChange.emit(v);
  }
}
