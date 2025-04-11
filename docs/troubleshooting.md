# Troubleshooting

This guide helps you resolve common issues that may occur when using the Markdown Viewer application.

## Common Issues and Solutions

### Files Not Loading

**Issue**: Dragged files don't appear in the viewer.

**Possible Solutions**:
1. Ensure you're dragging files with the `.md` extension
2. Check that your browser supports the File API
3. Try dragging the files directly into the drop zone area
4. Verify that the files aren't too large (try with a small test file)

### Content Not Displaying Correctly

**Issue**: Markdown content doesn't render as expected.

**Possible Solutions**:
1. Check your Markdown syntax for errors
2. Ensure there are proper line breaks between different Markdown elements
3. Try viewing the file in another Markdown viewer to compare
4. For complex formatting, check the [Marked.js syntax guide](https://marked.js.org/)

### Mermaid Diagrams Not Rendering

**Issue**: Mermaid diagrams show as code blocks instead of visualizations.

**Possible Solutions**:
1. Verify your Mermaid syntax is correct
2. Ensure you're using the proper code fence with `mermaid` language identifier:
   ```
   ```mermaid
   graph TD
       A --> B
   ```
   ```
3. Check if your browser has JavaScript enabled
4. Try a simpler diagram to test if it's a complexity issue
5. Look for error messages in the browser console

### Editor Not Working

**Issue**: The editor doesn't appear or doesn't work correctly.

**Possible Solutions**:
1. Make sure you're in single file view and have selected a file
2. Check your internet connection (CodeMirror needs to load)
3. Try refreshing the page
4. Verify that JavaScript is enabled in your browser
5. Try a different browser

### Local Storage Issues

**Issue**: Files don't persist between sessions or you see storage errors.

**Possible Solutions**:
1. Check if your browser has cookies and local storage enabled
2. Clear some browser storage if you receive "storage full" errors
3. Export important files to your computer as a backup
4. Try using private/incognito mode if you're on a shared computer

## Browser-Specific Issues

### Chrome

- If files don't load, check if your Chrome version supports the latest File API
- For performance issues with large files, try disabling unnecessary extensions

### Firefox

- If the editor doesn't load, ensure you haven't disabled JavaScript for the site
- For rendering issues, try refreshing with cache clearing (Ctrl+F5)

### Safari

- If drag and drop doesn't work, ensure you've allowed the page to use JavaScript
- For persistence issues, check if you have "Prevent cross-site tracking" enabled

### Edge

- If the application is slow, try enabling hardware acceleration in browser settings
- For rendering issues, ensure you're using the latest version of Edge

## Performance Tips

If the application becomes slow:

1. Try viewing fewer files at once
2. Split very large Markdown files into smaller ones
3. Reduce the number of complex Mermaid diagrams
4. Clear the application data occasionally using the "Clear All" button
5. Export and remove files you don't need to actively work with

## Getting Additional Help

If you continue to experience issues:

1. Check the browser console (F12 or Ctrl+Shift+I) for error messages
2. Try clearing your browser cache and reloading
3. Report the issue to the application maintainer with:
   - Browser name and version
   - Steps to reproduce the issue
   - Example Markdown content that causes the problem
