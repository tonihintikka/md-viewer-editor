import React, { createContext, useState, useCallback, useEffect } from 'react';
import { get, set } from 'idb-keyval';

// Storage keys
const STORAGE_KEY_FILES = 'mdviewer-files';
const STORAGE_KEY_ORDER = 'mdviewer-order';
const STORAGE_KEY_ACTIVE_FILE = 'mdviewer-active-file';

export const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState(new Map());
  const [fileOrder, setFileOrder] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState('single'); // 'single' or 'all'

  // Load files from IndexedDB
  const loadFilesFromStorage = useCallback(async () => {
    try {
      const storedFiles = await get(STORAGE_KEY_FILES);
      const storedOrder = await get(STORAGE_KEY_ORDER);
      const storedActiveFile = await get(STORAGE_KEY_ACTIVE_FILE);
      
      if (storedFiles) {
        setFiles(new Map(Object.entries(storedFiles)));
      }
      
      if (storedOrder) {
        setFileOrder(storedOrder);
      }
      
      if (storedActiveFile) {
        setActiveFile(storedActiveFile);
      }
      
      console.log('Files loaded from storage');
    } catch (error) {
      console.error('Error loading files from storage:', error);
    }
  }, []);

  // Save files to IndexedDB
  const saveFilesToStorage = useCallback(async () => {
    try {
      const filesObject = Object.fromEntries(files);
      await set(STORAGE_KEY_FILES, filesObject);
      await set(STORAGE_KEY_ORDER, fileOrder);
      
      if (activeFile) {
        await set(STORAGE_KEY_ACTIVE_FILE, activeFile);
      }
      
      console.log('Files saved to storage');
    } catch (error) {
      console.error('Error saving files to storage:', error);
    }
  }, [files, fileOrder, activeFile]);

  // Save to storage whenever files, order, or active file changes
  useEffect(() => {
    if (files.size > 0) {
      saveFilesToStorage();
    }
  }, [files, fileOrder, activeFile, saveFilesToStorage]);

  // Add a new file
  const addFile = useCallback((filename, content) => {
    setFiles(prevFiles => {
      const newFiles = new Map(prevFiles);
      newFiles.set(filename, content);
      return newFiles;
    });
    
    setFileOrder(prevOrder => {
      if (!prevOrder.includes(filename)) {
        return [...prevOrder, filename];
      }
      return prevOrder;
    });
    
    setActiveFile(filename);
  }, []);

  // Remove a file
  const removeFile = useCallback((filename) => {
    setFiles(prevFiles => {
      const newFiles = new Map(prevFiles);
      newFiles.delete(filename);
      return newFiles;
    });
    
    setFileOrder(prevOrder => prevOrder.filter(name => name !== filename));
    
    if (activeFile === filename) {
      const newActiveFile = fileOrder.find(name => name !== filename);
      setActiveFile(newActiveFile || null);
    }
  }, [activeFile, fileOrder]);

  // Update file content
  const updateFile = useCallback((filename, content) => {
    setFiles(prevFiles => {
      const newFiles = new Map(prevFiles);
      newFiles.set(filename, content);
      return newFiles;
    });
  }, []);

  // Reorder files
  const reorderFiles = useCallback((newOrder) => {
    setFileOrder(newOrder);
  }, []);

  // Toggle edit mode
  const toggleEditMode = useCallback(() => {
    setIsEditing(prev => !prev);
  }, []);

  // Toggle view mode
  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'single' ? 'all' : 'single');
  }, []);

  // Clear all files
  const clearAllFiles = useCallback(() => {
    setFiles(new Map());
    setFileOrder([]);
    setActiveFile(null);
    setIsEditing(false);
  }, []);

  const value = {
    files,
    fileOrder,
    activeFile,
    isEditing,
    viewMode,
    setActiveFile,
    addFile,
    removeFile,
    updateFile,
    reorderFiles,
    toggleEditMode,
    toggleViewMode,
    clearAllFiles,
    loadFilesFromStorage
  };

  return (
    <FileContext.Provider value={value}>
      {children}
    </FileContext.Provider>
  );
};
