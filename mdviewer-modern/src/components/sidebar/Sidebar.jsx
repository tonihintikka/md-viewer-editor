import React, { useState } from 'react';
import { useFileContext } from '../../hooks/useFileContext';
import { useFileHandling } from '../../hooks/useFileHandling';
import FileList from './FileList';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { 
    files, 
    fileOrder, 
    activeFile, 
    viewMode, 
    toggleViewMode, 
    clearAllFiles 
  } = useFileContext();
  const { exportFile } = useFileHandling();
  
  const handleExport = () => {
    if (activeFile && files.has(activeFile)) {
      exportFile(activeFile, files.get(activeFile));
    }
  };
  
  const handleSort = () => {
    const sortedOrder = [...fileOrder].sort();
    reorderFiles(sortedOrder);
  };
  
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all files? This cannot be undone.')) {
      clearAllFiles();
    }
  };
  
  const toggleMobileSidebar = () => {
    setIsMobileOpen(prev => !prev);
  };
  
  return (
    <>
      <button 
        className={styles.mobileToggle}
        onClick={toggleMobileSidebar}
        aria-label={isMobileOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
        </svg>
      </button>
      
      <aside className={`${styles.sidebar} ${isMobileOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2>Files</h2>
          <span className={styles.fileCount}>{files.size}</span>
        </div>
        
        <div className={styles.fileListContainer}>
          <FileList />
        </div>
        
        <div className={styles.actions}>
          <button 
            className={styles.actionButton}
            onClick={toggleViewMode}
            disabled={files.size === 0}
          >
            {viewMode === 'single' ? 'View All' : 'Single View'}
          </button>
          
          <button 
            className={styles.actionButton}
            onClick={handleSort}
            disabled={files.size <= 1}
          >
            Sort A-Z
          </button>
          
          <button 
            className={styles.actionButton}
            onClick={handleExport}
            disabled={!activeFile || viewMode !== 'single'}
          >
            Export
          </button>
          
          <button 
            className={`${styles.actionButton} ${styles.dangerButton}`}
            onClick={handleClearAll}
            disabled={files.size === 0}
          >
            Clear All
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
