import { Component, input } from '@angular/core';
import { THEME } from '../../theme';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-top-nav',
  standalone: true,
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css'],
})
/** Top navigation bar with branding and subtle gradient background. */
export class TopNavComponent {
  /** Application title to show in the nav. */
  title = input<string>('AI FAQ');
  protected theme = THEME;
}
