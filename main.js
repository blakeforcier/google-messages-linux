const { app, BrowserWindow, shell, Tray, Menu, MenuItem, session } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 820,
    minWidth: 600,
    minHeight: 500,
    title: 'Messages',
    icon: path.join(__dirname, 'icon.png'),
    backgroundColor: '#18181b',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: true
    }
  });

  // Enable spellchecker language
  if (mainWindow.webContents.session) {
    mainWindow.webContents.session.setSpellCheckerLanguages(['en-US']);
  }

  // Right-click context menu with spellcheck suggestions
  mainWindow.webContents.on('context-menu', (event, params) => {
    if (!params.isEditable) return;

    const menu = new Menu();

    // Spelling suggestions
    if (params.dictionarySuggestions && params.dictionarySuggestions.length > 0) {
      for (const suggestion of params.dictionarySuggestions) {
        menu.append(new MenuItem({
          label: suggestion,
          click: () => mainWindow.webContents.replaceMisspelling(suggestion)
        }));
      }
      menu.append(new MenuItem({ type: 'separator' }));
    }

    if (params.misspelledWord) {
      menu.append(new MenuItem({
        label: `Add "${params.misspelledWord}" to dictionary`,
        click: () => mainWindow.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord)
      }));
      menu.append(new MenuItem({ type: 'separator' }));
    }

    // Standard editing actions
    menu.append(new MenuItem({ label: 'Undo', role: 'undo' }));
    menu.append(new MenuItem({ label: 'Redo', role: 'redo' }));
    menu.append(new MenuItem({ type: 'separator' }));
    menu.append(new MenuItem({ label: 'Cut', role: 'cut' }));
    menu.append(new MenuItem({ label: 'Copy', role: 'copy' }));
    menu.append(new MenuItem({ label: 'Paste', role: 'paste' }));
    menu.append(new MenuItem({ label: 'Select All', role: 'selectAll' }));

    menu.popup();
  });

  // Lock window title to "Messages" (or with unread count)
  mainWindow.on('page-title-updated', (event, title) => {
    event.preventDefault();
    const unread = (title || '').match(/^\((\d+)\)/);
    const clean = unread ? `(${unread[1]}) Messages` : 'Messages';
    mainWindow.setTitle(clean);
  });

  // Inject True Black CSS as early as possible
  const themeCss = fs.readFileSync(path.join(__dirname, 'theme.css'), 'utf-8');
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.insertCSS(themeCss);
  });
  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.insertCSS(themeCss);
  });

  // Handle external links (open in user's default browser)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith('https://messages.google.com/')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.loadURL('https://messages.google.com/web');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
