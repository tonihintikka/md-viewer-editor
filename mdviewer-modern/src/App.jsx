import React, { useEffect } from 'react';
import { useFileContext } from './hooks/useFileContext';
import { useTheme } from './hooks/useTheme';
import Sidebar from './components/sidebar/Sidebar';
import Editor from './components/editor/Editor';
import Viewer from './components/viewer/Viewer';
import DropZone from './components/common/DropZone';
import Header from './components/common/Header';
import styles from './styles/App.module.css';

function App() {
  const { isEditing, activeFile, loadFilesFromStorage } = useFileContext();
  const { theme } = useTheme();
  
  useEffect(() => {
    // Load files from storage when the app starts
    loadFilesFromStorage();
  }, [loadFilesFromStorage]);

  return (
    <div className={`${styles.app} ${styles[theme]}`}>
      <Header />
      <main className={styles.mainContainer}>
        <Sidebar />
        <div className={styles.contentArea}>
          {activeFile ? (
            isEditing ? (
              <Editor />
            ) : (
              <Viewer />
            )
          ) : (
            <DropZone />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
