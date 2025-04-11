import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { useFileContext } from '../../hooks/useFileContext';
import { useTheme } from '../../hooks/useTheme';
import styles from './Editor.module.css';

const Editor = () => {
  const { files, activeFile, updateFile, toggleEditMode } = useFileContext();
  const { theme } = useTheme();
  const [content, setContent] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  
  // Load content when activeFile changes
  useEffect(() => {
    if (activeFile && files.has(activeFile)) {
      setContent(files.get(activeFile));
      setHasChanges(false);
    }
  }, [activeFile, files]);
  
  const handleChange = (value) => {
    setContent(value);
    setHasChanges(true);
  };
  
  const handleSave = () => {
    updateFile(activeFile, content);
    setHasChanges(false);
    toggleEditMode();
  };
  
  const handleCancel = () => {
    if (hasChanges) {
      const confirmCancel = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmCancel) return;
    }
    
    toggleEditMode();
  };
  
  if (!activeFile || !files.has(activeFile)) {
    return <div className={styles.noFileSelected}>No file selected for editing</div>;
  }
  
  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorHeader}>
        <h2 className={styles.fileName}>Editing: {activeFile}</h2>
        <div className={styles.actions}>
          <button 
            className={`${styles.actionButton} ${styles.cancelButton}`}
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button 
            className={`${styles.actionButton} ${styles.saveButton}`}
            onClick={handleSave}
            disabled={!hasChanges}
          >
            Save
          </button>
        </div>
      </div>
      
      <div className={styles.editorWrapper}>
        <CodeMirror
          value={content}
          height="100%"
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages })
          ]}
          onChange={handleChange}
          theme={theme}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            autocompletion: true,
            foldGutter: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            bracketMatching: true
          }}
          className={styles.codeMirror}
        />
      </div>
    </div>
  );
};

export default Editor;
