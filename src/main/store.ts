import Store from 'electron-store';
import { getGamePath } from 'steam-game-path';
import Track from './source/Track';

interface Tracks {
  [key: number]: Track[];
}

export interface StoreSchema {
  settings: {
    csgo_path: string;
    steam_path: string;
    play_button: string;
    saycurtrack_button: string;
    sayteamcurtrack_button: string;
  };
  current_game: number;
  tracks: Tracks;
}

export const store = new Store<StoreSchema>({
  name: 'sourcefm-store',
  beforeEachMigration: (_, context) => {
    console.log(
      `[main-config] migrate from ${context.fromVersion} → ${context.toVersion}`
    );
  },
  migrations: {
    '>=0.0.1': (store) => {
      console.log('Running migration 0.0.1');
      store.set('settings.csgo_path', getGamePath(730)?.game?.path || '');
      store.set('settings.steam_path', getGamePath(730)?.steam?.path || '');
      store.set('settings.play_button', 'x');
      store.set('current_game', 730);
      store.set('tracks', {});
    },
    '>=0.0.4': (store) => {
      console.log('Running migration 0.0.4');
      store.set('settings.saycurtrack_button', 'm');
      store.set('settings.sayteamcurtrack_button', 'n');
    },
  },
});
