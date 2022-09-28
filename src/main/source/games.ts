import { CSGO_BLACKLIST } from './blacklists';
import SourceGame from './SourceGame';

const games: SourceGame[] = [
  new SourceGame(
    'Counter-Strike: Global Offensive',
    730,
    'common/Counter-Strike Global Offensive',
    'csgo/cfg/',
    'csgo/',
    false,
    'csgo',
    22050,
    CSGO_BLACKLIST
  ),
];

export default games;

export const getAllGames = () => games;
