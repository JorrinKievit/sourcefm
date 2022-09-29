import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'import-file'
  | 'start-files-injection'
  | 'import-youtube'
  | 'clean-up'
  | 'manage-track';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    importFile(
      channel: 'import-file',
      file: { name: string; path: string; gameId: number }
    ): void {
      ipcRenderer.send(channel, file);
    },
    importYoutube(
      channel: 'import-youtube',
      file: { url: string; gameId: number }
    ): void {
      ipcRenderer.send(channel, file);
    },
    startFilesInjection(
      channel: 'start-files-injection',
      gameId: number
    ): void {
      ipcRenderer.send(channel, gameId);
    },
    cleanUp(channel: 'clean-up'): void {
      ipcRenderer.send(channel);
    },
    manageTrack(
      channel: 'manage-track',
      type: 'remove' | 'edit',
      trackId: number,
      trackName?: string
    ): void {
      ipcRenderer.send(channel, type, trackId, trackName);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  store: {
    get(val: string) {
      return ipcRenderer.sendSync('electron-store-get', val);
    },
    set(property: string, value: unknown) {
      ipcRenderer.send('electron-store-set', property, value);
    },
  },
});
