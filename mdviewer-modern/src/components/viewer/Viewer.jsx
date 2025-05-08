import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { useFileContext } from '../../hooks/useFileContext';
import mermaid from 'mermaid'; // Import mermaid directly
import styles from './Viewer.module.css';

// Import custom component later to avoid circular dependencies
import MermaidDiagram from '../MermaidDiagram';

const Viewer = () => {
  const { files, fileOrder, activeFile, viewMode } = useFileContext();
  const viewerRef = useRef(null);
  const [mermaidError, setMermaidError] = useState(null);
  const [mermaidDebug, setMermaidDebug] = useState(false);
  
  // Initialize mermaid on component mount
  useEffect(() => {
    // Configure Mermaid globally
    mermaid.initialize({
      startOnLoad: true,
      theme: document.body.classList.contains('dark') ? 'dark' : 'default',
      logLevel: 'error',
      securityLevel: 'loose',
      fontFamily: 'inherit'
    });
    
    console.log('Mermaid initialized globally in Viewer');
  }, []);
  
  // Scroll to top when changing files
  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.scrollTop = 0;
    }
    // Clear any previous errors when changing files
    setMermaidError(null);
  }, [activeFile, viewMode]);
  
  // Enable debug mode with keyboard shortcut (Alt+Shift+D)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle debug mode with Alt+Shift+D
      if (e.altKey && e.shiftKey && e.key === 'D') {
        setMermaidDebug(prev => !prev);
        console.log('Mermaid debug mode:', !mermaidDebug);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mermaidDebug]);
  
  // Handle mermaid errors
  const handleMermaidError = (error) => {
    console.error('Mermaid error in viewer:', error);
    setMermaidError(error);
  };
  
  // Function to render mermaid directly
  const renderMermaidDirectly = (content, containerId) => {
    try {
      // Create a clean ID
      const cleanId = `mermaid-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
      
      // Try using both rendering approaches
      setTimeout(() => {
        try {
          // Use the direct rendering approach
          const element = document.getElementById(containerId);
          if (element) {
            element.innerHTML = `<div class="mermaid">${content}</div>`;
            mermaid.init(undefined, element.querySelector('.mermaid'));
            console.log('Mermaid rendered directly with init()');
          }
        } catch (err) {
          console.error('Direct mermaid rendering failed:', err);
          handleMermaidError(err);
        }
      }, 0);
      
      return <div id={containerId} className={styles.mermaidDirectContainer}></div>;
    } catch (error) {
      console.error('Failed to setup mermaid container:', error);
      return <pre className={styles.errorPre}>{content}</pre>;
    }
  };
  
  // Custom renderer for code blocks to handle mermaid
  const CodeBlock = ({ node, inline, className, children, ...props }) => {
    // Detailed logging of the code block props for debugging
    console.log('Code block props:', { className, inline, nodeType: node?.type });
    
    const match = /language-(\w+)/.exec(className || '');
    const language = match && match[1] ? match[1].toLowerCase() : '';
    const content = String(children).replace(/\n$/, '');
    
    console.log('Code block detected:', { language, contentPreview: content.substring(0, 50) });
    
    // Special handling for mermaid - try direct rendering first
    if (language === 'mermaid') {
      console.log('Mermaid diagram content found:', content);
      const containerId = `mermaid-container-${Date.now()}`;
      
      // Use direct rendering
      return renderMermaidDirectly(content, containerId);
    }
    
    // Also detect if content starts with flowchart, graph, sequenceDiagram etc.
    // This is a fallback in case the language tag is missing
    if (!language && content) {
      const mermaidPatterns = [
        /^flowchart\s+/i,
        /^graph\s+/i, 
        /^sequenceDiagram/i,
        /^classDiagram/i,
        /^stateDiagram/i,
        /^gantt/i,
        /^pie/i,
        /^erDiagram/i
      ];
      
      const isMermaid = mermaidPatterns.some(pattern => pattern.test(content.trim()));
      
      if (isMermaid) {
        console.log('Detected Mermaid content without language tag:', content);
        const containerId = `mermaid-container-${Date.now()}-auto`;
        
        // Use direct rendering
        return renderMermaidDirectly(content, containerId);
      }
    }
    
    return (
      <pre className={className}>
        <code {...props} className={className}>
          {children}
        </code>
      </pre>
    );
  };
  
  // Initialize mermaid content whenever content changes
  useEffect(() => {
    if (viewerRef.current) {
      // Add a small delay to ensure DOM is ready
      setTimeout(() => {
        try {
          console.log('Running mermaid content init...');
          // Initialize any mermaid diagrams in the DOM
          mermaid.init('.mermaid');
          console.log('Mermaid content initialization complete');
        } catch (err) {
          console.error('Error initializing mermaid content:', err);
        }
      }, 100);
    }
  }, [activeFile, files, viewMode]);
  
  // Render single file view
  const renderSingleFile = () => {
    if (!activeFile || !files.has(activeFile)) {
      return <div className={styles.noFileSelected}>No file selected</div>;
    }
    
    const content = files.get(activeFile);
    
    return (
      <div className={styles.singleFileView}>
        <h1 className={styles.fileTitle}>{activeFile}</h1>
        {mermaidError && (
          <div className={styles.errorNotice}>
            <p>There was an error rendering one or more diagrams in this document.</p>
            <p>
              <small>Tip: Press Alt+Shift+D to toggle diagram debug mode.</small>
            </p>
          </div>
        )}
        {mermaidDebug && (
          <div className={styles.debugNotice}>
            Mermaid Debug Mode Enabled
          </div>
        )}
        <div className={styles.markdownContent}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={{ code: CodeBlock }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    );
  };
  
  // Render all files view
  const renderAllFiles = () => {
    if (files.size === 0) {
      return <div className={styles.noFileSelected}>No files available</div>;
    }
    
    return (
      <div className={styles.allFilesView}>
        {mermaidDebug && (
          <div className={styles.debugNotice}>
            Mermaid Debug Mode Enabled
          </div>
        )}
        {fileOrder.map(filename => {
          if (!files.has(filename)) return null;
          
          const content = files.get(filename);
          
          return (
            <div key={filename} className={styles.fileContainer} id={`file-${filename}`}>
              <h2 className={styles.fileTitle}>{filename}</h2>
              <div className={styles.markdownContent}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={{ code: CodeBlock }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className={styles.viewer} ref={viewerRef}>
      {viewMode === 'single' ? renderSingleFile() : renderAllFiles()}
    </div>
  );
};

export default Viewer;
