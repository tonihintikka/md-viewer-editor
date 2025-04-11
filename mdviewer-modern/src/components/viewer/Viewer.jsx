import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { useFileContext } from '../../hooks/useFileContext';
import mermaid from 'mermaid';
import styles from './Viewer.module.css';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'strict'
});

const Viewer = () => {
  const { files, fileOrder, activeFile, viewMode } = useFileContext();
  const viewerRef = useRef(null);
  
  // Render mermaid diagrams after markdown is rendered
  useEffect(() => {
    const renderMermaidDiagrams = async () => {
      if (!viewerRef.current) return;
      
      try {
        await mermaid.run({
          nodes: document.querySelectorAll('.language-mermaid')
        });
      } catch (error) {
        console.error('Error rendering mermaid diagrams:', error);
      }
    };
    
    renderMermaidDiagrams();
  }, [files, activeFile, viewMode]);
  
  // Scroll to top when changing files
  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.scrollTop = 0;
    }
  }, [activeFile, viewMode]);
  
  // Custom renderer for code blocks to handle mermaid
  const CodeBlock = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match && match[1] ? match[1] : '';
    
    if (language === 'mermaid') {
      return (
        <div className={`${styles.mermaidContainer} language-mermaid`}>
          {String(children).replace(/\n$/, '')}
        </div>
      );
    }
    
    return (
      <pre className={className}>
        <code {...props} className={className}>
          {children}
        </code>
      </pre>
    );
  };
  
  // Render single file view
  const renderSingleFile = () => {
    if (!activeFile || !files.has(activeFile)) {
      return <div className={styles.noFileSelected}>No file selected</div>;
    }
    
    const content = files.get(activeFile);
    
    return (
      <div className={styles.singleFileView}>
        <h1 className={styles.fileTitle}>{activeFile}</h1>
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
