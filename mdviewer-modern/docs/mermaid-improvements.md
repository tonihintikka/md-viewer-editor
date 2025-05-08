# Technical Improvements for MermaidDiagram Component

This document outlines technical improvements that can be made to the `MermaidDiagram` component to better support Finnish characters and special characters in general.

## Current Implementation Analysis

The current implementation in `MermaidDiagram.tsx` has several features that help with rendering diagrams:

1. It uses `securityLevel: 'loose'` in the Mermaid configuration
2. It replaces smart quotes with regular quotes
3. It has a fallback mechanism that attempts to render by replacing `ä` with `a` and `ö` with `o`

While these are good steps, there are several improvements that could be made for better support of Finnish content.

## Recommended Improvements

### 1. Update Mermaid Configuration

```typescript
mermaid.initialize({
  startOnLoad: false,
  theme: themeOverride || (appTheme === 'dark' ? 'dark' : 'default'),
  logLevel: 1, // 1 = error, 2 = warn, etc.
  securityLevel: 'loose',
  fontFamily: 'inherit',
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
    useMaxWidth: false
  },
  // Add these lines:
  deterministicIds: true, // Helps with rendering stability
  sequence: {
    useMaxWidth: false, // Better for wide diagrams
  },
  er: {
    useMaxWidth: false,
  },
  gantt: {
    useMaxWidth: false,
  }
});
```

### 2. Improve Character Preprocessing

The current preprocessing only handles smart quotes. We should expand this to handle more special character cases:

```typescript
// Process the definition
useEffect(() => {
  // Enhanced definition preprocessing function
  const processDefinition = (def: string) => {
    return def
      .replace(/^\s+|\s+$/g, '') // Trim whitespace
      .replace(/[\u2018\u2019]/g, "'") // Replace smart quotes
      .replace(/[\u201C\u201D]/g, '"') // Replace smart double quotes
      .replace(/subgraph\s+([^"\n]+)(?!\s*")/g, 'subgraph "$1"') // Ensure subgraph titles are quoted
      .replace(/\\n/g, '\n') // Handle escaped newlines
      .replace(/\\t/g, '    '); // Handle escaped tabs
  };
  
  setRawDefinition(processDefinition(definition));
}, [definition]);
```

### 3. Enhance Fallback Rendering

Improve the fallback rendering mechanism to be more comprehensive:

```typescript
// Second try: fallback with improved syntax
try {
  console.log('Trying fallback render method for Mermaid');
  const simplifiedDefinition = rawDefinition
    .replace(/subgraph\s+([^"\n]+)(?!\s*")/g, 'subgraph "$1"') // Ensure subgraph titles are quoted
    .replace(/([A-Za-z0-9])(\[[^\]]*[äöüÄÖÜ][^\]]*\])/g, '$1$2') // Handle node labels with special chars
    .replace(/-->(\s*)\|([^|]*[äöüÄÖÜ][^|]*)\|/g, '-->$1|"$2"|'); // Quote edge labels with special chars
  
  const { svg, bindFunctions } = await mermaid.render(
    `${uniqueId.current}-fallback`,
    simplifiedDefinition
  );
  
  if (containerRef.current) {
    containerRef.current.innerHTML = svg;
    bindFunctions?.(containerRef.current);
    console.log('Mermaid diagram rendered with fallback method');
  }
} catch (fallbackError) {
  // If all else fails, try with HTML entities
  try {
    console.log('Trying HTML entity fallback for Mermaid');
    const entityDefinition = rawDefinition
      .replace(/ä/g, '&auml;')
      .replace(/ö/g, '&ouml;')
      .replace(/å/g, '&aring;')
      .replace(/Ä/g, '&Auml;')
      .replace(/Ö/g, '&Ouml;')
      .replace(/Å/g, '&Aring;');
    
    const { svg, bindFunctions } = await mermaid.render(
      `${uniqueId.current}-entity-fallback`,
      entityDefinition
    );
    
    if (containerRef.current) {
      containerRef.current.innerHTML = svg;
      bindFunctions?.(containerRef.current);
      console.log('Mermaid diagram rendered with HTML entity fallback method');
    }
  } catch (entityError) {
    console.error('All fallback renders failed:', entityError);
    throw entityError;
  }
}
```

### 4. Update Mermaid Version

The current implementation uses Mermaid version 10.0.2, which may have limitations with international character support. Consider upgrading to the latest version:

```bash
npm install mermaid@latest
```

### 5. Improve Error Reporting

Enhance the error reporting to provide more actionable information about Finnish character issues:

```typescript
if (containerRef.current) {
  containerRef.current.innerHTML = `
    <div class="diagram-error">
      <p>Diagram processing failed: ${error instanceof Error ? error.message : 'Unknown error'}</p>
      <details>
        <summary>Show diagram source</summary>
        <pre>${rawDefinition}</pre>
      </details>
      <details>
        <summary>Troubleshooting tips</summary>
        <ul>
          <li>Ensure subgraph titles are in quotes: <code>subgraph "Title with ä and ö"</code></li>
          <li>Check for balanced quotes, brackets, and parentheses</li>
          <li>Try simplifying complex diagrams</li>
          <li>See <a href="./docs/mermaid-finnish.md">Finnish Mermaid guide</a> for more tips</li>
        </ul>
      </details>
    </div>
  `;
}
```

### 6. Add Debugging Support

Add a debug mode option to help identify issues with Finnish character rendering:

```typescript
interface MermaidDiagramProps {
  /** The Mermaid diagram definition text */
  definition: string;
  /** Optional component ID (will be auto-generated if not provided) */
  id?: string;
  /** Optional class name for styling the container */
  className?: string;
  /** Optional callback for error handling */
  onError?: (error: unknown) => void;
  /** Optional theme override */
  theme?: 'default' | 'dark' | 'forest' | 'neutral';
  /** Enable debug mode for additional information */
  debug?: boolean;
}

// Then in the component:
{(error || props.debug) && (
  <div className="diagram-debug">
    <p>Diagram source code:</p>
    <pre>{rawDefinition}</pre>
    {props.debug && !error && (
      <details>
        <summary>Processed definition</summary>
        <pre>{processedDefinition}</pre>
      </details>
    )}
  </div>
)}
```

## CSS Improvements for Finnish Character Support

Ensure the CSS properly handles special characters in the Mermaid diagrams:

```css
/* Add international font fallbacks */
.mermaid-diagram-container {
  font-family: 'Segoe UI', Arial, -apple-system, BlinkMacSystemFont, 'Noto Sans', sans-serif;
}

/* Ensure proper text rendering for non-ASCII characters */
.mermaid-diagram-container text {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

## Testing for Finnish Character Support

To ensure proper support for Finnish characters, implement tests with:

1. Unit tests with Finnish content
2. Visual regression tests to catch rendering issues
3. A test suite specifically for special character handling

## Implementation Roadmap

1. Start by updating the preprocessing logic for subgraph titles
2. Update Mermaid to the latest version
3. Implement improved fallback mechanisms
4. Add enhanced error reporting
5. Add CSS improvements
6. Implement debugging support

These changes will significantly improve the rendering of Mermaid diagrams with Finnish characters and provide better feedback to users when issues occur. 