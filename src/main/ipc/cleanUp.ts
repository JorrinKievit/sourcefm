import { ipcMain } from 'electron';
import { cleanUp } from '../util';

ipcMain.on('clean-up', (event) => {
  cleanUp();

  event.sender.send('toast', 'success', 'Cleaned up');
});
