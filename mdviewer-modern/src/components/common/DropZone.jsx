import React, { useState, useCallback } from 'react';
import { useFileHandling } from '../../hooks/useFileHandling';
import styles from './DropZone.module.css';

const DropZone = () => {
  const [isDragging, setIsDragging] = useState(false);
  const { handleFileDrop } = useFileHandling();
  
  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  
  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    handleFileDrop(files);
  }, [handleFileDrop]);
  
  const onFileInputChange = useCallback((e) => {
    const files = e.target.files;
    handleFileDrop(files);
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  }, [handleFileDrop]);
  
  return (
    <div 
      className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className={styles.content}>
        <svg className={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M12 12.586l4.243 4.242-1.415 1.415L13 16.415V22h-2v-5.587l-1.828 1.83-1.415-1.415L12 12.586zM12 2a7.001 7.001 0 0 1 6.954 6.194 5.5 5.5 0 0 1-.953 10.784v-2.014a3.5 3.5 0 1 0-1.112-6.91 5 5 0 1 0-9.777 0 3.5 3.5 0 0 0-1.292 6.88l.18.03v2.014a5.5 5.5 0 0 1-.954-10.784A7 7 0 0 1 12 2z"/>
        </svg>
        <h2>Drop Markdown Files Here</h2>
        <p>or</p>
        <label className={styles.fileInputLabel}>
          Browse Files
          <input 
            type="file" 
            accept=".md" 
            multiple 
            onChange={onFileInputChange}
            className={styles.fileInput}
          />
        </label>
      </div>
    </div>
  );
};

export default DropZone;
