const { dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
autoUpdater.logger = require("electron-log");

autoUpdater.logger.transports.file.level = "info";

autoUpdater.autoDownload = false;

module.exports = () => {
  autoUpdater.checkForUpdates();
  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Update available',
      message: 'A newer version of bookmark desktop is available. Do you want to update now?',
      buttons: ['Update', 'Not now']
    }).then (res => {
      let buttonIndex = res.response;
      if (buttonIndex === 0) autoUpdater.downloadUpdate();
    })
  })

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Update ready',
      message: 'Install & restart now?',
      buttons: ['Yes', 'Later']
    }).then(res => {
      let buttonIndex = res.response;
      if (buttonIndex === 0) autoUpdater.quitAndInstall(false, true);
    })
  })
}
