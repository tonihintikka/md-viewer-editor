import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '../hooks/useTheme';

/**
 * MermaidDiagram Component Props
 */
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

/**
 * MermaidDiagram component - Renders a Mermaid diagram from a text definition
 * 
 * This component uses the latest Mermaid API (2025) to render diagrams efficiently,
 * handling dark mode automatically and supporting all modern diagram types.
 * Enhanced with Finnish character support and multiple fallback mechanisms.
 */
export const MermaidDiagram = ({
  definition,
  id: propId,
  className = '',
  onError,
  theme: themeOverride,
  debug = false
}: MermaidDiagramProps) => {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawDefinition, setRawDefinition] = useState(definition);
  const [processedDefinition, setProcessedDefinition] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useRef(`mermaid-${propId || Math.random().toString(36).substring(2, 11)}`);
  const { theme: appTheme } = useTheme();

  // Initialize Mermaid once when component mounts
  useEffect(() => {
    if (!initialized) {
      try {
        // Log debug information
        console.log('Initializing Mermaid for diagram rendering');
        
        // Use type assertion to avoid TypeScript errors with complex config
        mermaid.initialize({
          startOnLoad: false,
          theme: themeOverride || (appTheme === 'dark' ? 'dark' : 'default'),
          logLevel: 'info',
          securityLevel: 'loose',
          fontFamily: 'inherit',
          flowchart: {
            htmlLabels: true,
            curve: 'basis',
            useMaxWidth: false,
            nodeSpacing: 30,
            rankSpacing: 50,
            padding: 15
          },
          deterministicIds: true,
          sequence: {
            useMaxWidth: false,
            boxMargin: 8,
            mirrorActors: false,
            bottomMarginAdj: 10,
            messageMargin: 40
          },
          er: {
            useMaxWidth: false,
            layoutDirection: 'TB'
          },
          gantt: {
            useMaxWidth: false,
            leftPadding: 75,
            rightPadding: 20,
            topPadding: 10,
            bottomPadding: 10,
            gridLineStartPadding: 35
          },
          themeVariables: appTheme === 'dark' ? {
            // Dark theme variables
            primaryColor: '#3182ce',
            primaryTextColor: '#e2e8f0',
            primaryBorderColor: '#4a5568',
            lineColor: '#a0aec0',
            secondaryColor: '#4a5568',
            tertiaryColor: '#2d3748'
          } : {
            // Light theme variables
            primaryColor: '#4299e1',
            primaryTextColor: '#2d3748',
            primaryBorderColor: '#cbd5e0',
            lineColor: '#718096',
            secondaryColor: '#f7fafc',
            tertiaryColor: '#edf2f7'
          }
        } as any);  // Use type assertion to bypass complex type validation
        
        setInitialized(true);
        console.log('Mermaid initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Mermaid:', error);
        setError(`Initialization error: ${error instanceof Error ? error.message : String(error)}`);
        onError?.(error);
      }
    }
  }, [initialized, themeOverride, appTheme, onError]);

  // Process the definition
  useEffect(() => {
    // Enhanced definition preprocessing function
    const processDefinition = (def: string) => {
      // Detect diagram type for specific optimizations
      let diagramType = 'unknown';
      if (def.trim().match(/^(flowchart|graph)\s/i)) {
        diagramType = 'flowchart';
      } else if (def.trim().match(/^sequenceDiagram/i)) {
        diagramType = 'sequence';
      } else if (def.trim().match(/^classDiagram/i)) {
        diagramType = 'class';
      } else if (def.trim().match(/^stateDiagram/i)) {
        diagramType = 'state';
      } else if (def.trim().match(/^gantt/i)) {
        diagramType = 'gantt';
      } else if (def.trim().match(/^pie/i)) {
        diagramType = 'pie';
      } else if (def.trim().match(/^erDiagram/i)) {
        diagramType = 'er';
      }
      
      console.log('Detected diagram type:', diagramType);
      
      // Base cleanup for all diagram types
      let processed = def
        .replace(/^\s+|\s+$/g, '') // Trim whitespace
        .replace(/[\u2018\u2019]/g, "'") // Replace smart quotes
        .replace(/[\u201C\u201D]/g, '"') // Replace smart double quotes
        .replace(/\\n/g, '\n') // Handle escaped newlines
        .replace(/\\t/g, '    '); // Handle escaped tabs
      
      // Type-specific optimizations
      if (diagramType === 'flowchart') {
        // Ensure subgraph titles are quoted (especially important for Finnish text)
        processed = processed.replace(/subgraph\s+([^"\n]+)(?!\s*")/g, 'subgraph "$1"');
        
        // Ensure edge labels with special characters are quoted
        processed = processed.replace(/-->(\s*)\|([^|]*[äöüÄÖÜåÅ][^|]*)\|/g, '-->$1|"$2"|');
      }
      
      return processed;
    };
    
    const processed = processDefinition(definition);
    setRawDefinition(processed);
    setProcessedDefinition(processed);
  }, [definition]);

  // Render the diagram whenever the definition or theme changes
  useEffect(() => {
    const renderDiagram = async () => {
      if (!initialized || !containerRef.current || !rawDefinition) return;

      try {
        // Clear previous content
        containerRef.current.innerHTML = '';
        setError(null);
        
        console.log('Trying to render mermaid diagram with definition:', rawDefinition);
        
        // Using the updated Mermaid API for version 11.6.0
        try {
          console.log('Attempting render with Mermaid 11.6.0 API');
          
          // Use a unique ID for each render
          const elementId = `mermaid-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
          
          // Create a container element with the ID
          const container = document.createElement('div');
          container.id = elementId;
          container.style.width = '100%';
          container.style.minHeight = '100px';
          container.className = 'mermaid-inner-container';
          
          // Add it to the main container
          containerRef.current.appendChild(container);
          
          console.log('Created container with ID:', elementId);
          
          // Render using the new API approach
          const result = await mermaid.render(elementId, rawDefinition);
          console.log('Render result:', result);
          
          if (result && result.svg) {
            console.log('Generated SVG:', result.svg.substring(0, 500) + '...');
            
            // Directly insert the SVG
            container.innerHTML = result.svg;
            
            // Apply bind functions if available
            if (typeof result.bindFunctions === 'function') {
              result.bindFunctions(container);
            }
            
            console.log('Mermaid diagram rendered successfully');
            
            // Check visibility
            setTimeout(() => {
              const svgElement = container.querySelector('svg');
              if (svgElement) {
                console.log('SVG dimensions:', {
                  width: svgElement.getAttribute('width'),
                  height: svgElement.getAttribute('height'),
                  style: svgElement.getAttribute('style'),
                  visibility: window.getComputedStyle(svgElement).visibility,
                  display: window.getComputedStyle(svgElement).display,
                });
              } else {
                console.warn('No SVG element found in container after rendering');
              }
            }, 500);
          } else {
            throw new Error('Mermaid render returned no SVG content');
          }
        } catch (renderError) {
          console.error('First render attempt failed:', renderError);
          
          // Fallback rendering methods...
          // Fallback 1: Alternative rendering approach with basic container
          try {
            console.log('Trying basic fallback render method for Mermaid');
            
            const simplifiedDefinition = rawDefinition
              .replace(/subgraph\s+([^"\n]+)(?!\s*")/g, 'subgraph "$1"') // Ensure subgraph titles are quoted
              .replace(/([A-Za-z0-9])(\[[^\]]*[äöüÄÖÜ][^\]]*\])/g, '$1$2') // Handle node labels with special chars
              .replace(/-->(\s*)\|([^|]*[äöüÄÖÜ][^|]*)\|/g, '-->$1|"$2"|'); // Quote edge labels with special chars
            
            // Create a bare element
            const fallbackId = `fallback-${Date.now()}`;
            const fallbackEl = document.createElement('div');
            fallbackEl.id = fallbackId;
            containerRef.current.appendChild(fallbackEl);
            
            // Render on the bare element - using any to bypass TypeScript errors
            // @ts-ignore - Ignoring this error as the mermaidAPI types are incorrect
            await (mermaid.mermaidAPI as any).render(fallbackId, simplifiedDefinition, (svg: string) => {
              if (containerRef.current) {
                fallbackEl.innerHTML = svg;
                console.log('Mermaid diagram rendered with basic fallback method');
              }
            });
          } catch (fallbackError) {
            // Final fallback: Use innerHTML directly
            console.error('Basic fallback also failed:', fallbackError);
            console.log('Trying direct innerHTML fallback for Mermaid');
            
            try {
              const finalId = `final-${Date.now()}`;
              containerRef.current.innerHTML = `<div class="mermaid" id="${finalId}">${rawDefinition}</div>`;
              
              mermaid.init(undefined, `#${finalId}`);
              console.log('Mermaid diagram rendered with init() method');
            } catch (finalError) {
              console.error('All fallback renders failed:', finalError);
              throw finalError;
            }
          }
        }
      } catch (error) {
        console.error('Mermaid general error:', error);
        setError(`General error: ${error instanceof Error ? error.message : String(error)}`);
        
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
        onError?.(error);
      }
    };

    renderDiagram();
  }, [rawDefinition, initialized, onError, appTheme]);

  if (error) {
    console.error('Mermaid rendering error state:', error);
  }

  return (
    <div className={`mermaid-diagram-wrapper ${className}`}>
      <div 
        ref={containerRef}
        id={uniqueId.current}
        className="mermaid-diagram-container"
        data-testid="mermaid-diagram"
      />
      {(error || debug) && (
        <details className="diagram-debug">
          <summary className="debug-toggle">
            {error ? "Show diagram debug information" : "Show diagram source"}
          </summary>
          <div>
            <p>Diagram source code:</p>
            <pre>{rawDefinition}</pre>
            {debug && !error && processedDefinition && (
              <details>
                <summary>Processed definition</summary>
                <pre>{processedDefinition}</pre>
              </details>
            )}
          </div>
        </details>
      )}
    </div>
  );
};

export default MermaidDiagram; 