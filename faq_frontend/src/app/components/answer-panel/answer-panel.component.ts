import { Component, input } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FaqItem } from '../../theme';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-answer-panel',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './answer-panel.component.html',
  styleUrls: ['./answer-panel.component.css'],
})
/** Displays the answer for a selected FAQ with emphasis and clean typography. */
export class AnswerPanelComponent {
  // PUBLIC_INTERFACE
  /** Selected FAQ item to display. If null, shows an empty state. */
  item = input<FaqItem | null>(null);
}
