# Project memory

## Product intent & audience

- Full-stack plant disease detection web app: React/Vite frontend + Flask backend + existing trained Keras CNN.
- Users upload plant leaf images; backend returns predicted disease, confidence %, and healthy/diseased status.
- Audience: agricultural users, gardeners, and anyone needing AI-assisted plant health checks.

## Brand personality & voice

- Modern, professional agricultural-tech tone.
- Clear, practical, trustworthy language focused on helpful results.

## Visual design & UX direction

- Modern ag-tech / clean SaaS dashboard aesthetic; production-quality, not cookie-cutter.
- Responsive across desktop, tablet, and mobile.
- Pages: Home (hero, features, footer) and Disease Detection (drag-and-drop upload, preview, predict action, results card).
- Detection UX: JPG/JPEG/PNG support, remove/replace upload, loading animation during prediction, attractive result cards with disease name, confidence %, healthy/diseased status, and error messaging.
- Styling uses plain CSS files (not Tailwind) despite template defaults; JSX and Lucide React still available.
- Import via `@/` alias (`src/`); Axios for API calls with FormData multipart uploads.

## Decisions, constraints & rationale

- Must use existing `plant_disease_cnn.keras`; never retrain, modify, or replace it; no dummy/hardcoded predictions.
- Model inspected directly from archive config: input 128x128 RGB, output 38 classes, no internal scaling, no stored class names.
- `plant_disease_cnn copy.keras` is not a valid model file; ignored.
- Backend assumed pixel scaling = divide by 255 (needs user confirmation).
- Flask loads model once at startup; CORS enabled; `/api/health` and `/api/predict` endpoints.
- Prediction logic kept separate from routing where appropriate; API calls isolated in `services/api.js`.
- TensorFlow not installed in current environment, so backend remains untested here; must be run locally by user.
- Frontend builds cleanly; Python syntax-checks pass; lint clean.

## Open questions & assumptions

- Need ordered list of 38 class names from user (model doesn't contain them).
- Confirm preprocessing: pixel values divided by 255 (assumed).