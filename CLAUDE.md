# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a React-based presentation application for Century Bank's Core Connected Marketing pitch. The presentation is a self-contained single-page application with 35 slides covering marketing solutions, data security, implementation timelines, and pricing.

## Project Structure

- `index.html` - Standalone HTML file with embedded React app (uses CDN-loaded React, Tailwind CSS, and Babel)
- `CenturyBankPresentation.jsx` - React component source (equivalent to the embedded code in index.html)

**Important**: The JSX file appears to be a source file, but the actual running application is in `index.html` with the React code embedded in a `<script type="text/babel">` tag. When making changes, you need to update the code inside `index.html`, not just the `.jsx` file.

## Development Approach

### Running the Application

Simply open `index.html` in a web browser. No build process, no npm install, no dependencies to manage.

```bash
open index.html
```

### Making Changes

1. All code modifications should be made directly in the `<script type="text/babel">` section of `index.html` (lines 28-634)
2. The `CenturyBankPresentation.jsx` file exists but is not actually used by the application
3. Changes are reflected immediately on browser refresh (no build step required)

## Application Architecture

### State Management

The presentation uses React hooks for all state:
- `slide` - current slide index (0-34)
- `platforms` - pricing calculator state (1 or 2 platforms)
- `showAnnual` - pricing display toggle (annual vs monthly)
- `editMode` - enables inline editing of slide content
- `editedContent` - stores user edits to slide text
- `isFullscreen` - fullscreen mode state
- `showNotes` - presenter notes panel visibility
- `presenterNotes` - editable presenter notes per slide
- `isTransitioning` - slide transition animation state

### Key Components

**Slide Wrappers**:
- `TitleSlide` - Full-screen title slides with centered content
- `ContentSlide` - Standard content slides with logo, title, and content area

**Interactive Features**:
- `EditableText` - Inline text editing component (click to edit in edit mode)
- `ProgressBar` - Visual progress indicator at top of screen
- `NotesPanel` - Slide-out presenter notes panel

**Navigation**:
- Keyboard: Arrow keys, Space, Enter (next), Backspace (prev), Home, End, F (fullscreen), N (notes), Escape (exit fullscreen)
- Mouse: Click navigation buttons or slide dots
- 35 slides total (0-34 index)

### Color Palette

Defined in `colors` object:
- `green: #d2f058` - Primary brand accent
- `graphite: #3b3b3c` - Dark background
- `powder: #b7e4f7` - Light blue accent
- `desert: #f9aa7d` - Orange accent
- `ash: #d3d1c5` - Light gray
- `ashLight: #eeeeea` - Very light gray background
- `darkBlue: #1a3a5c` - Corporate blue

### Slide Content Organization

The `slides` array contains 35 slides covering:
1. Title and introduction (slides 0-5)
2. Problem statement and solution (slides 6-13)
3. Security and compliance (slide 14)
4. Growth opportunities (slides 15-20)
5. Implementation and timeline (slides 21-24)
6. Team and credentials (slides 25-28)
7. Pricing calculator (slide 30)
8. Next steps and close (slides 31-34)

### Pricing Logic

Interactive pricing calculator (slide 30):
- Base integration: $27,500 (1 platform) or $42,500 (2 platforms)
- Prismatic annual: $12,000
- Support annual: $28,800
- HubSpot annual: $59,040
- Year 1 total = integration + all annual costs
- Toggle between monthly/annual display

### Presenter Notes System

Each slide has default presenter notes in `defaultPresenterNotes` object (indexed 0-34). Notes are editable during presentation and stored in component state. Notes provide speaking cues, timing guidance, and presentation strategy.

## Common Modifications

### Changing Slide Content

To update slide text, modify the content within the `slides` array in `index.html`. Most text uses the `EditableText` component which allows inline editing during presentations.

### Adding/Removing Slides

1. Add/remove slide JSX in the `slides` array
2. Update the slide count check in `goToSlide` function (currently checks `< 35`)
3. Add presenter notes entry in `defaultPresenterNotes` object
4. Navigation and progress bars will automatically adapt

### Styling Changes

The app uses Tailwind CSS via CDN. All styling is done with Tailwind utility classes and inline styles. The color palette object should be used for brand colors to maintain consistency.

### Animations

Two CSS animations defined:
- `fadeInUp` - Fade in with upward movement (0.5s)
- `fadeIn` - Simple fade in (0.4s)

Applied via `animate-fade-in-up` and `animate-fade-in` classes.

## Technical Notes

- **No TypeScript**: Plain JavaScript/JSX
- **No bundler**: Browser-native module system with CDN dependencies
- **React 18.2.0**: Loaded via UMD build from CDN
- **Babel Standalone**: Client-side JSX transformation (not for production, but fine for presentation tool)
- **Tailwind CSS**: JIT mode via CDN
- **Icons**: Lucide icons implemented as inline SVG components (not imported from library)

## Browser Compatibility

Requires modern browser with:
- ES6+ support
- Fullscreen API support
- CSS Grid and Flexbox

Tested primarily on Chrome/Safari on desktop. Responsive design includes mobile breakpoints but optimized for presentation on large screens.
