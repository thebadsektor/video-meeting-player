# MeetingViewer
© Gerald Villaran 2025

MeetingViewer is a full-stack TypeScript application for reviewing recorded meetings. It pairs a modern React client (Vite + shadcn/ui) with an Express API that handles uploads, secure media serving, and transcript parsing utilities. Quickly jump between transcript segments, scrub detailed waveforms, and control playback speed/volume while reviewing calls.

---

## Features

- **Video playback UI** with play/pause, scrubbing, speed presets (0.5×–2×), mute & volume controls.
- **Transcript navigation**: searchable list with active-line highlighting and click-to-seek synchronization.
- **Waveform visualization** driven by WaveSurfer for precise audio scrubbing.
- **Uploads & sample content**: drag-and-drop video/transcript uploaders plus bundled demo assets.
- **Server-side safeguards**: file-type validation, uploads stored outside the web root, and secure streaming with HTTP range requests.

---

## Tech Stack

- **Frontend:** React 18, Vite, shadcn/ui (Radix primitives + Tailwind CSS), wavesurfer.js.
- **Backend:** Node.js 20+, Express 4, Multer for uploads, TypeScript everywhere.
- **Tooling:** Vite dev middleware, tsx for server hot reload, esbuild for production bundling.

---

## Getting Started

### Prerequisites

- Node.js **v20+** (LTS recommended)  
- npm **v9+**

### Installation

```bash
git clone <your-repo-url>
cd MeetingViewer
npm install
```

### Development

```bash
npm run dev
```

This runs `server/index.ts` through `tsx`. In development, the server bootstraps Vite in middleware mode, so the API (default `http://127.0.0.1:5000`) and client share the same origin.

### Production Build

```bash
npm run build   # builds client (vite) + bundles server (esbuild)
npm run start   # serves dist/
```

---

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start Express + Vite in development (HMR enabled). |
| `npm run build` | Build the client and bundle the server into `dist/`. |
| `npm run start` | Run the production bundle from `dist/`. |
| `npm run check` | Type-check the entire project via `tsc`. |

---

## Project Structure

```
.
├── client/               # Vite/React application
│   ├── public/           # Static assets (sample mp4 + transcript)
│   └── src/
│       ├── components/   # UI building blocks (VideoPlayer, Waveform, TranscriptView, etc.)
│       ├── hooks/        # Reusable hooks (toast, mobile detection)
│       ├── lib/          # Parsers & utilities
│       └── pages/        # Route-level components (Home)
├── server/               # Express server, routes, storage helpers
├── shared/               # Shared schemas/types
├── dist/                 # Production output (after build)
└── README.md
```

---

## API Endpoints

| Method & Path | Description |
| --- | --- |
| `POST /api/upload/video` | Accepts `multipart/form-data` with a `video` field (`.mp4`, `.webm`, `.ogg`). Returns `{ url, filename, size }`. |
| `POST /api/upload/transcript` | Accepts `transcript` files (`.json`, `.txt`, `.vtt`, `.srt`). Returns `{ content, filename, size }`. |
| `GET /api/files/:filename` | Streams uploaded files from `/tmp/uploads` with range support and extension whitelisting. |

All uploads are stored outside the public directory and must pass MIME + extension validation. The client fetches returned URLs to play videos and parse transcripts.

---

## Using the App

1. **Load sample data** via the “Load Sample Meeting” button, or upload your own video + transcript pair.
2. **Play & navigate**:
   - Use the player controls for play/pause, scrubbing, speed, and volume.
   - Click transcript entries or waveform positions to seek.
3. **Search transcripts**: filter by speaker or text with the search bar.

Transcripts support Recall AI JSON, WebVTT, or plain text. Unsupported formats fall back to the raw-text parser.

---

## Troubleshooting

- **Video won’t play**: ensure uploads are `.mp4`, `.webm`, or `.ogg`. Check server logs for validation errors.
- **Transcript parsing fails**: invalid JSON or unknown format will trigger the raw-text parser. Inspect console/log output for parser errors.
- **Large files**: upload limit is 500 MB (configured in Multer). Adjust `limits.fileSize` in `server/routes.ts` if needed.

---

## License

MIT © Contributors to MeetingViewer