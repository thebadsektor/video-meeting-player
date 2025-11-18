# Design Guidelines: Video Meeting Viewer

## Design Approach

**Selected Approach:** Design System - Productivity-Focused
**Primary Inspiration:** Linear's minimalism + Loom's video interface + Notion's content hierarchy
**Justification:** This is a utility-focused productivity tool requiring clarity, efficiency, and information density. Visual appeal serves functional goals.

## Core Design Principles

1. **Information Clarity:** Every element serves the primary goal of understanding meeting content
2. **Synchronized Experience:** Visual feedback reinforces time-based connections across all views
3. **Efficiency First:** Minimal clicks, keyboard shortcuts, clear affordances
4. **Professional Polish:** Clean, modern aesthetic that feels trustworthy for business use

## Typography System

**Font Families:**
- Primary: Inter (UI elements, transcript text)
- Monospace: JetBrains Mono (timestamps, technical data)

**Hierarchy:**
- App Title/Headers: 20px, semibold
- Section Labels: 14px, medium, uppercase tracking
- Transcript Speaker Names: 14px, semibold
- Transcript Content: 15px, regular, 1.6 line-height
- Timestamps: 13px, monospace, medium
- UI Controls: 14px, medium
- Helper Text: 12px, regular

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8 (e.g., p-4, gap-6, mb-8)

**Application Structure:**

**Header (Fixed):**
- Height: h-16
- App title (left), preset selector (center), sample loader button (right)
- Padding: px-6, py-4
- Border bottom for separation

**Main Content (Two-Column Split):**
- Left Pane (60% width): Video player + waveform stack
- Right Pane (40% width): Scrollable transcript
- Gap between panes: gap-4
- Responsive: Stack vertically on mobile (lg:flex-row)

**Video Player Section:**
- Video: 16:9 aspect ratio, rounded corners (rounded-lg)
- Controls bar below video: h-16, px-4
- Playback controls, timeline scrubber, speed selector
- Spacing below video: mb-4

**Waveform Section:**
- Height: h-32
- Rounded container with subtle border
- Current position indicator (vertical line)
- Zoom controls (top-right corner)
- Padding: p-4

**Transcript Pane:**
- Full height with overflow scroll
- Padding: p-6
- Each transcript block: mb-6 spacing

## Component Library

### File Upload Zone
- Dashed border, rounded-xl, min-height 200px
- Center-aligned icon (48px), upload text, file format helper
- Hover state: slightly elevated appearance
- Padding: p-8

### Video Controls Bar
- Play/pause button (40px), seek bar (flex-1), time display, speed dropdown
- Buttons: rounded-md, 40px height
- Seek bar: h-2, rounded-full, with progress indicator

### Waveform Display
- Canvas-based rendering with bars representing amplitude
- Active region highlight (semi-transparent overlay)
- Playhead: 2px vertical line spanning full height
- Click-to-seek interaction area

### Transcript Block
- Speaker name: bold, mb-2
- Timestamp: monospace, inline with speaker, opacity-70
- Transcript text: mb-4, selectable
- Active state: distinct background treatment, smooth transition
- Click interaction: entire block is clickable

### Preset Selector
- Dropdown with options: Recall.ai, Zoom, Google Meet, Teams, Raw Text
- Width: w-48, rounded-md
- Icon + label layout

### Search Bar (Optional Feature)
- Width: full in transcript pane
- Height: h-10, rounded-md
- Icon prefix, clear button suffix
- Sticky at top of transcript pane

### Sample Loader Button
- Outlined style, rounded-md
- Icon + "Load Sample Meeting" text
- Height: h-10, px-4

## Interaction Patterns

**Synchronized Highlighting:**
- Active transcript line: subtle background shift, smooth 200ms transition
- Waveform playhead: animated with video playback
- Auto-scroll transcript: smooth behavior with 100px offset from top

**Click-to-Seek:**
- Transcript lines: cursor-pointer, entire block clickable
- Waveform: click anywhere to jump to that time
- Visual feedback: brief pulse animation on target

**Keyboard Shortcuts:**
- Display shortcut hints on hover (tooltips)
- Space: play/pause
- J/K: rewind/forward 10 seconds
- Arrow keys: 5-second jumps

## Layout Specifications

**Container Widths:**
- App container: max-w-screen-2xl, mx-auto
- Video player: aspect-video constraint
- Transcript: no max-width (fills pane)

**Responsive Breakpoints:**
- Desktop (lg): Two-column layout
- Tablet (md): Two-column, adjusted proportions (50/50)
- Mobile (base): Stacked, video on top

**Vertical Rhythm:**
- Section spacing: space-y-6
- Component internal spacing: p-4 or p-6
- Transcript blocks: mb-6

## Accessibility Features

- High contrast for active states
- Keyboard navigation for all controls
- ARIA labels for video controls
- Focus indicators: 2px ring with offset
- Skip to transcript/video buttons

## Visual Enhancements

**Subtle Depth:**
- Video player: subtle shadow (shadow-lg)
- Waveform container: light border, minimal shadow
- Transcript pane: border-left separator
- Active elements: slightly elevated (shadow-md)

**Professional Polish:**
- All interactive elements: smooth transitions (transition-all duration-200)
- Rounded corners: liberal use of rounded-lg and rounded-md
- Icon consistency: 20px for UI controls, 16px for inline elements

This design creates a professional, efficient video analysis tool that prioritizes function while maintaining visual polish. The layout supports intensive use without visual fatigue, and all interactions reinforce the time-synchronized relationship between video, audio, and transcript.