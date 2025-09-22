# ai-faq-assistant-29996-30005

This project now runs as a frontend-only Angular application. The backend container has been removed, and the app uses an in-memory service for FAQs and answers. No calls are made to `/api/faqs` or `/api/ask`.

- Frontend path: `faq_frontend/`
- Start locally: `cd faq_frontend && npm install && npm run start`
- The app serves on port 3000 (see angular.json).

If you plan to reintroduce a backend later, replace the in-memory logic in `src/app/services/faq.service.ts` with HTTP calls and restore an API server accordingly.