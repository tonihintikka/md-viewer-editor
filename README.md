# Markdown Viewer

A versatile Markdown viewer and editor application with two implementations:

![Markdown Viewer Screenshot](docs/Screenshot%202025-04-11%20at%2017.29.10.png)

## Development Process

This project showcases a collaborative AI-assisted development process:

1. The initial single-file implementation was created with **Gemini 2.5 Pro** through a vibe coding session
2. Documentation and planning were developed collaboratively
3. The modern, modular implementation was created with **Augment Code** (powered by Claude 3.7 Sonnet)

The development followed an iterative process where the original HTML file was provided as a starting point, followed by documentation creation, planning, and research on modern best practices before implementing the enhanced version.

## Project Overview

This repository contains two implementations of a Markdown viewer and editor:

### 1. Classic Implementation (Original)

The original implementation is a single-file HTML/JavaScript application that provides:
- Markdown rendering with proper formatting
- Built-in editor using CodeMirror
- File management through drag & drop
- Mermaid diagram support
- Local storage persistence

**Location:** Root directory (`index.html`)

### 2. Modern Implementation (2025)

A completely redesigned, modular implementation built with modern web technologies:
- React component-based architecture
- Vite for fast development and optimized builds
- Light/dark theme support
- Responsive design for all devices
- Enhanced Markdown rendering with GitHub Flavored Markdown
- Improved file management
- Modern UI with intuitive controls

**Location:** [`mdviewer-modern/`](mdviewer-modern/) directory ([View README](mdviewer-modern/README.md))

## Getting Started with the Modern Implementation

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Navigate to the modern implementation:
```bash
cd mdviewer-modern
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Documentation

Comprehensive documentation is available for both implementations:

- **Classic Implementation:** See the [`docs/`](docs/) directory
  - [Introduction](docs/introduction.md)
  - [Getting Started](docs/getting-started.md)
  - [User Guide](docs/user-guide.md)
  - [Features](docs/features.md)
  - [Troubleshooting](docs/troubleshooting.md)

- **Modern Implementation:** See the [`mdviewer-modern/docs/`](mdviewer-modern/docs/) directory
  - [Developer Guide](mdviewer-modern/docs/developer-guide.md)

## Key Features

Both implementations offer:

- 📝 View and edit Markdown files
- 📊 Mermaid diagram rendering
- 💾 Local storage for persistence
- 📤 Export functionality
- 🔄 Drag and drop file management

The modern implementation additionally offers:

- 🎨 Light and dark theme support
- 📱 Responsive design optimized for all devices
- 🧩 Modular, maintainable codebase
- ⚡ Faster performance and improved user experience

## License

This project is licensed under the MIT License - see the LICENSE file for details.
