const {BrowserWindow} =require('electron');

let offScreenWindow;

module.exports = (url, callback) => {
  offScreenWindow = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
    webPreferences: {
      offScreen: true
    }
  });

  url = url.slice(0, 8) !== 'https://' && url.slice(0, 7) !== 'http://' ? 'https://' + url : url;
  offScreenWindow.loadURL(url);
  offScreenWindow.webContents.on('did-finish-load', e => {
    let title = offScreenWindow.getTitle();

    offScreenWindow.webContents.capturePage().then(img => {
      let screenshot = img.toDataURL();
      callback({title, screenshot, url});
      offScreenWindow.close();
      offScreenWindow = null;
    })
  })
}
