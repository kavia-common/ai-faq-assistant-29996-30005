# Angular (Frontend-Only Standalone)

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.1.

Important:
- This app runs entirely in the browser with an in-memory data service. There is no backend container, and the app does not call `/api/faqs` or `/api/ask`.
- To re-enable backend integration in the future, replace the in-memory logic in `src/app/services/faq.service.ts` with HTTP calls and reintroduce an API.

## Development server

To start a local development server, run:

```bash
ng serve
```

By default the dev server runs on port 3000 in this repo’s config. Open your browser at:
- http://localhost:3000/

The application will automatically reload whenever you modify any source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use:

```bash
ng test
```

## Additional Notes on Standalone Mode

- The `FaqService` uses a small in-memory dataset and simulates “ask” responses without network requests.
- Environment files keep an `apiBaseUrl` key for compatibility, but it’s empty and unused in standalone mode.
- Components listen to the service’s signals, so the UI behaves the same without a backend.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
