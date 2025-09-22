import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

// PUBLIC_INTERFACE
/** Application routes. Currently the app is a single-page view bootstrapped at root. */
export const routes: Routes = [
  // With standalone bootstrap this is not strictly required, but kept for future extensibility.
  { path: '', component: AppComponent },
];
