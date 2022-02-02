const {app, BrowserWindow, ipcMain} = require('electron');
const windowStateKeeper = require('electron-window-state');
const readItem = require('./readItem')
const appMenu = require('./menu');

let mainWindow = null;

const createWindow = () => {
  let state = windowStateKeeper({
    defaultHeight: 650, defaultWidth: 500
  })
  mainWindow = new BrowserWindow({
    x: state.x, y: state.y,
    width: state.width, height: state.height,
    minHeight: 300, minWidth: 350, maxWidth: 650,
    webPreferences: { contextIsolation: false, nodeIntegration: true }
  });

  appMenu(mainWindow.webContents);

  mainWindow.loadFile('renderer/main.html');
  state.manage(mainWindow);

  mainWindow.on('closed', () => {
    mainWindow = null;
  })
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (!!mainWindow) createWindow();
})


ipcMain.on('new-item', (e, itemUrl) => {
  readItem(itemUrl, item => {
    e.sender.send('new-item-success', item)
  })
})
