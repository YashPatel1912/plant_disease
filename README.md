# PlantGuard AI: Plant Disease Detection

A React (Vite) web app that sends leaf photos to a Flask API, which runs them through your trained Keras model (`backend/model/plant_disease_cnn.keras`) and returns the predicted disease, confidence, and healthy/diseased status.

## Backend setup (Flask)

Requires Python 3.10 to 3.12.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # then review PIXEL_SCALE
python app.py
```

The API runs at `http://localhost:5000`.

### Class names (required for readable results)

The model file does not store its class names. Create `backend/model/class_labels.json` containing a JSON array with one name per output, in the same order the model was trained on:

```json
["Apple___Apple_scab", "Apple___Black_rot", "...", "Tomato___healthy"]
```

Until this file exists, predictions return `Class <number>` with status `Unknown`. The file must contain exactly as many names as the model outputs.

## Frontend setup (React)

```bash
npm install
cp .env.example .env             # points the app at the Flask API
npm run dev
```

Open the address Vite prints (usually `http://localhost:5173`). The backend allows this origin by default; to change it, set `CORS_ORIGINS` in `backend/.env`.

## API

- `GET /api/health`: backend status, whether the model is loaded, and whether class names are configured.
- `POST /api/predict`: multipart form upload with the image in the `image` field. Accepts JPG, JPEG, and PNG up to `MAX_UPLOAD_MB`.

Example success response:

```json
{ "success": true, "prediction": "Tomato___Early_blight", "confidence": 96.45, "status": "Diseased", "class_index": 4, "labels_configured": true }
```

## Configuration

| Variable | Where | Purpose |
| --- | --- | --- |
| `PIXEL_SCALE` | `backend/.env` | Multiplier applied to 0-255 pixel values. Must match training. |
| `CORS_ORIGINS` | `backend/.env` | Comma-separated frontend origins allowed to call the API. |
| `MAX_UPLOAD_MB` | `backend/.env` | Maximum upload size. |
| `VITE_API_BASE_URL` | `.env` | Backend address used by the frontend. |
