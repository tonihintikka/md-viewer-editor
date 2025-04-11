import React, { useRef } from 'react';
import { useFileContext } from '../../hooks/useFileContext';
import styles from './FileList.module.css';

const FileList = () => {
  const { 
    files, 
    fileOrder, 
    activeFile, 
    setActiveFile, 
    removeFile, 
    reorderFiles 
  } = useFileContext();
  
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  
  const handleDragStart = (e, index) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add(styles.dragging);
  };
  
  const handleDragEnter = (e, index) => {
    dragOverItem.current = index;
    e.target.classList.add(styles.dragOver);
  };
  
  const handleDragLeave = (e) => {
    e.target.classList.remove(styles.dragOver);
  };
  
  const handleDragEnd = (e) => {
    e.target.classList.remove(styles.dragging);
    handleSort();
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    
    const newOrder = [...fileOrder];
    const draggedItemValue = newOrder[dragItem.current];
    
    // Remove the dragged item
    newOrder.splice(dragItem.current, 1);
    
    // Add it at the new position
    newOrder.splice(dragOverItem.current, 0, draggedItemValue);
    
    // Reset refs
    dragItem.current = null;
    dragOverItem.current = null;
    
    // Update the order
    reorderFiles(newOrder);
  };
  
  const handleFileClick = (filename) => {
    setActiveFile(filename);
  };
  
  const handleRemoveFile = (e, filename) => {
    e.stopPropagation();
    
    if (window.confirm(`Are you sure you want to remove "${filename}"?`)) {
      removeFile(filename);
    }
  };
  
  if (files.size === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No files yet</p>
        <small>Drag & drop Markdown files to get started</small>
      </div>
    );
  }
  
  return (
    <ul className={styles.fileList}>
      {fileOrder.map((filename, index) => (
        <li 
          key={filename}
          className={`${styles.fileItem} ${activeFile === filename ? styles.active : ''}`}
          onClick={() => handleFileClick(filename)}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnter={(e) => handleDragEnter(e, index)}
          onDragLeave={handleDragLeave}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <svg className={styles.fileIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M3 8l6.003-6h10.995C20.55 2 21 2.455 21 2.992v18.016a.993.993 0 0 1-.993.992H3.993A1 1 0 0 1 3 20.993V8zm7-4.5L4.5 9H10V3.5z"/>
          </svg>
          <span className={styles.fileName}>{filename}</span>
          <button 
            className={styles.removeButton}
            onClick={(e) => handleRemoveFile(e, filename)}
            aria-label={`Remove ${filename}`}
          >
            &times;
          </button>
        </li>
      ))}
    </ul>
  );
};

export default FileList;
