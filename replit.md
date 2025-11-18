# Video Meeting Viewer

A synchronized video meeting viewer with waveform visualization, clickable transcripts, and support for Recall.ai transcript parsing.

## Overview

This application allows users to upload video files and transcripts, then navigate through meetings with synchronized playback. The interface features a video player, audio waveform visualization, and an interactive transcript view that automatically highlights and scrolls as the video plays.

## Features

- **Dual File Upload**: Upload video (MP4, WebM, OGG) and transcript files (JSON, TXT, VTT, SRT) via drag-and-drop or file browser
- **Recall.ai Transcript Parser**: Native support for Recall.ai JSON transcript format with participant tracking and word-level timestamps
- **Video Player**: HTML5 video player with:
  - Play/pause controls
  - Seek bar for timeline navigation
  - Playback speed adjustment (0.5x to 2x)
  - Current time display
- **Audio Waveform**: 
  - Visual representation of audio amplitude
  - Synchronized playhead indicator
  - Click-to-seek functionality
  - Zoom controls for detailed viewing
- **Interactive Transcript**:
  - Auto-scrolling that follows video playback
  - Active line highlighting
  - Click any line to jump to that timestamp
  - Search functionality to find specific content
  - Speaker names and timestamps displayed
- **Preset Selector**: Support for multiple transcript formats (Recall.ai, Zoom, Google Meet, Microsoft Teams, Raw Text)
- **Sample Meeting Loader**: Pre-loaded sample for quick testing

## Architecture

### Frontend (React + TypeScript)
- **Components**: Modular, reusable components for file upload, video player, waveform, and transcript views
- **State Management**: React hooks for local state, synchronized time tracking across components
- **Styling**: Tailwind CSS with shadcn/ui components following design guidelines
- **Waveform**: WaveSurfer.js for audio visualization

### Backend (Express + Node.js)
- **File Upload**: Multer for handling multipart form data
- **Security**: MIME type validation, file extension checks, JSON validation
- **Storage**: Local file system storage in `/uploads` directory
- **File Serving**: Static file serving with CORS headers

### Data Flow
1. User uploads video and transcript files
2. Backend validates file types and stores them
3. Frontend receives file URLs and content
4. Transcript parser converts content to normalized format
5. Synchronized playback updates video, waveform, and transcript simultaneously

## Transcript Parsing

### Recall.ai Format
The application natively parses Recall.ai JSON transcripts with the following structure:
```json
[
  {
    "participant": {
      "id": 100,
      "name": "Speaker Name",
      "is_host": true
    },
    "words": [
      {
        "text": "word",
        "start_timestamp": { "relative": 6.45 },
        "end_timestamp": { "relative": 6.69 }
      }
    ]
  }
]
```

### Supported Formats
- **Recall.ai**: JSON format with participant metadata and word-level timestamps
- **VTT**: WebVTT subtitle format
- **SRT**: SubRip subtitle format
- **Raw Text**: Plain text with auto-generated timestamps

## Security

File uploads implement multiple security layers:
- MIME type validation on upload
- File extension whitelist enforcement
- JSON schema validation for transcript files
- File size limits (500MB max)
- Separate upload handling for video and transcript endpoints

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── FileUpload.tsx          # Drag-and-drop file uploader
│   │   ├── VideoPlayer.tsx         # Video playback controls
│   │   ├── Waveform.tsx            # Audio waveform visualization
│   │   ├── TranscriptBlock.tsx     # Individual transcript entry
│   │   ├── TranscriptView.tsx      # Scrollable transcript list
│   │   └── PresetSelector.tsx      # Transcript format selector
│   ├── lib/
│   │   └── parsers.ts              # Transcript parsing logic
│   └── pages/
│       └── home.tsx                # Main application page
server/
├── routes.ts                        # API endpoints for file upload
└── storage.ts                       # Storage interface (in-memory)
uploads/                             # File upload directory
```

## Recent Changes

**2025-11-18**: Initial implementation
- Created video meeting viewer with full synchronization
- Implemented Recall.ai transcript parser
- Added file upload endpoints with security validation
- Built waveform visualization with zoom controls
- Implemented search and click-to-seek functionality

## User Preferences

- Clean, professional interface with minimal distractions
- Synchronized time tracking across all components
- Responsive design for different screen sizes
