import { ipcMain } from 'electron';
import fs from 'fs';
import { store } from '../store';

ipcMain.on('manage-track', (event, type, gameId, trackId, trackName) => {
  const tracks = store.get('tracks')[gameId];
  const currentTrack = tracks[trackId];

  if (type === 'edit') {
    const newTrack = {
      ...currentTrack,
      name: trackName,
      path: currentTrack.path.replace(currentTrack.name, trackName),
      tags: trackName.split(' '),
    };

    tracks[trackId] = newTrack;
    store.set(`tracks.${gameId}`, tracks);
    fs.renameSync(
      currentTrack.path,
      currentTrack.path.replace(currentTrack.name, trackName)
    );
  }
  if (type === 'remove') {
    tracks.splice(trackId, 1);
    store.set(`tracks.${gameId}`, tracks);
    fs.rmSync(currentTrack.path);
  }
  event.sender.send('update-tracks');
});
