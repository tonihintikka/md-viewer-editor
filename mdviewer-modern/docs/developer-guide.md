# Developer Guide

This guide provides information for developers who want to understand, modify, or extend the Modern Markdown Viewer application.

## Project Structure

The application follows a modular architecture with clear separation of concerns:

```
mdviewer-modern/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Shared components like buttons, dropzones
│   │   ├── editor/         # Editor-related components
│   │   ├── viewer/         # Markdown rendering components
│   │   └── sidebar/        # File navigation components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # Core services (file handling, storage, etc.)
│   ├── utils/              # Helper functions
│   ├── styles/             # Global styles and themes
│   ├── context/            # React context for state management
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
└── docs/                   # Documentation
```

## Technology Stack

- **Framework**: React for UI components
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: CSS Modules for component-scoped styling
- **Markdown Processing**: React Markdown with plugins for GFM and syntax highlighting
- **Editor**: CodeMirror for the text editor
- **Diagram Support**: Mermaid for rendering diagrams
- **State Management**: React Context API with hooks
- **Storage**: IndexedDB for efficient local storage

## Key Components

### App Component

The main application component that orchestrates the overall layout and manages the application state.

### FileContext

Provides state management for files, including:
- Loading and saving files
- Managing the active file
- Handling file operations (add, remove, update)
- Controlling view and edit modes

### ThemeContext

Manages the application theme (light/dark) and persists user preferences.

### Sidebar Components

- `Sidebar`: Container for file navigation
- `FileList`: Displays and manages the list of files

### Viewer Component

Renders Markdown content with support for:
- GitHub Flavored Markdown
- Mermaid diagrams
- Syntax highlighting
- Single file or all files view

### Editor Component

Provides a full-featured Markdown editor with:
- Syntax highlighting
- Line numbers
- Auto-completion
- Theme support

### DropZone Component

Handles file uploads through drag and drop or file selection.

## Custom Hooks

- `useFileContext`: Provides access to the file context
- `useTheme`: Provides access to the theme context
- `useFileHandling`: Encapsulates file handling logic

## Adding New Features

### Adding a New Component

1. Create a new component file in the appropriate directory
2. Create a corresponding CSS module
3. Import and use the component where needed

### Adding a New Hook

1. Create a new hook file in the `hooks` directory
2. Export the hook function
3. Import and use the hook in components

### Extending the File Context

1. Add new state variables or functions to the `FileContext.jsx` file
2. Update the context value object to include the new functionality
3. Access the new functionality using the `useFileContext` hook

## Building for Production

To build the application for production:

```bash
npm run build
```

This will create a `dist` directory with optimized files ready for deployment.

## Deployment

The application can be deployed to any static hosting service:

1. Build the application
2. Upload the contents of the `dist` directory to your hosting service
3. Configure your server to serve `index.html` for all routes

## Contributing

When contributing to this project:

1. Follow the existing code style and architecture
2. Write clear, descriptive commit messages
3. Add or update documentation as needed
4. Test your changes thoroughly before submitting
