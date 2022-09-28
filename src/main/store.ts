import Store from 'electron-store';
import { getGamePath } from 'steam-game-path';
import Track from './source/Track';

export interface StoreSchema {
  settings: {
    csgo_path: string;
    steam_path: string;
    play_button: string;
  };
  current_game: number;
  tracks: Track[];
}

export const store = new Store<StoreSchema>({
  defaults: {
    settings: {
      csgo_path: getGamePath(730)?.game?.path || '',
      steam_path: getGamePath(730)?.steam?.path || '',
      play_button: 'x',
    },
    current_game: 730,
    tracks: [],
  },
  name: 'source-player-store',
});
