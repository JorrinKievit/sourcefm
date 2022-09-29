import { ipcMain } from 'electron';
import child_process from 'child_process';
import fs from 'fs';
import { writeSourceCfg, writeTracklistCfg } from '../source/cfgWriter';
import { store } from '../store';

let watchConfigFileForChanges: ReturnType<typeof setInterval>;

ipcMain.on('start-files-injection', async (event, gameId) => {
  const settings = store.get('settings');
  let steamId: number;
  const steamReq = child_process.execSync(
    'reg query HKCU\\Software\\Valve\\Steam\\ActiveProcess'
  );

  const value = steamReq.toString().match(/0x[0-9a-fA-F]+/g);
  if (value) {
    steamId = parseInt(value[1], 16);
  } else {
    event.sender.send('error', 'No Steam account found');
  }

  const isGameRunning = setInterval(() => {
    child_process.exec('tasklist', (_, stdout) => {
      if (stdout.match(/csgo.exe/g)) {
        clearInterval(isGameRunning);
        writeSourceCfg(gameId);
        writeTracklistCfg(gameId);
        event.sender.send('start-files-injection-done');
      }
    });
  }, 5000);

  // look for new bind being set aka track being loaded
  watchConfigFileForChanges = setInterval(() => {
    const relayPath = `${settings.steam_path}\\userdata\\${steamId}\\730\\local\\cfg\\source_relay.cfg`;
    try {
      const file = fs.readFileSync(relayPath);
      const regex = /bind\s+"(=)"\s+"(.*?)"/g;
      const matches = file.toString().match(regex);

      fs.unlinkSync(relayPath);

      if (matches) {
        const trackIndex = parseInt(
          matches[0].split(' ')[2].replace('"', ''),
          10
        );
        const tracks = store.get('tracks');
        const track = tracks.find((_t, i) => i === trackIndex - 1);

        event.sender.send('track-loaded', trackIndex - 1);

        if (track) {
          fs.copyFileSync(track.path, `${settings.csgo_path}\\voice_input.wav`);
        }
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }, 5);
});

ipcMain.on('clean-up', () => {
  clearInterval(watchConfigFileForChanges);
});
