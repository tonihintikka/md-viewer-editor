import { useCallback } from 'react';
import { useFileContext } from './useFileContext';

export const useFileHandling = () => {
  const { addFile } = useFileContext();
  
  // Handle file drop
  const handleFileDrop = useCallback(async (files) => {
    if (!files || files.length === 0) return;
    
    for (const file of files) {
      // Only process Markdown files
      if (!file.name.toLowerCase().endsWith('.md')) {
        console.warn(`Skipping non-Markdown file: ${file.name}`);
        continue;
      }
      
      try {
        const content = await readFileContent(file);
        addFile(file.name, content);
      } catch (error) {
        console.error(`Error reading file ${file.name}:`, error);
      }
    }
  }, [addFile]);
  
  // Read file content
  const readFileContent = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsText(file);
    });
  }, []);
  
  // Export file
  const exportFile = useCallback((filename, content) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
  }, []);
  
  return {
    handleFileDrop,
    readFileContent,
    exportFile
  };
};
