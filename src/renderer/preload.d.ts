import { StoreSchema } from 'main/store';
import Store from 'electron-store';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        importFile(
          channel: 'import-file',
          file: { name: string; path: string; gameId: number }
        ): void;
        importYoutube(
          channel: 'import-youtube',
          file: { url: string; gameId: number }
        ): void;
        startFilesInjection(
          channel: 'start-files-injection',
          gameId: number
        ): void;
        cleanUp(channel: 'clean-up'): void;
        on(
          channel: string,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
      };
      store: Store<StoreSchema>;
    };
  }
}

export {};
