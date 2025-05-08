import React, { useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeRaw from 'rehype-raw';
import { MermaidDiagram } from './MermaidDiagram';

interface MarkdownRendererProps {
  markdown: string;
  className?: string;
}

/**
 * MarkdownRenderer component - Renders markdown content with extended features
 * 
 * Features:
 * - Standard Markdown rendering
 * - GitHub Flavored Markdown support (tables, strikethrough, etc.)
 * - Mermaid diagram support via custom code block handler
 * - Sanitized HTML for security
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  markdown, 
  className = '' 
}) => {
  // Custom component for handling code blocks,
  // with special handling for Mermaid diagrams
  const CodeBlock = useCallback(({ node, inline, className, children, ...props }: any) => {
    // Check if this is a Mermaid code block
    const match = /language-(\w+)/.exec(className || '');
    const language = match && match[1] ? match[1].toLowerCase() : '';
    const content = String(children).replace(/\n$/, '');

    if (language === 'mermaid') {
      // Render Mermaid diagram when language is specified as 'mermaid'
      return (
        <div className="mermaid-wrapper">
          <MermaidDiagram definition={content} />
        </div>
      );
    }
    
    // For all other code blocks, render normally
    return inline ? (
      <code className={className} {...props}>
        {children}
      </code>
    ) : (
      <pre className={className ? `${className} code-block` : 'code-block'}>
        <code {...props}>{children}</code>
      </pre>
    );
  }, []);

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          code: CodeBlock
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 