import fs from 'fs';
import { store } from '../store';
import { getAllGames } from './games';

export const writeSourceCfg = (gameId: number) => {
  const tracks = store.get('tracks').filter((track) => track.gameId === gameId);
  const game = getAllGames().find((val) => val.id === gameId);
  const settings = store.get('settings');

  const sourceCfg = fs.createWriteStream(
    `${settings.csgo_path}\\${game?.toCfg}\\source.cfg`
  );
  sourceCfg.write('alias tracklist "exec source_tracklist.cfg"\n');
  sourceCfg.write('alias source_play source_play_on\n');
  sourceCfg.write(
    'alias source_play_on "alias source_play source_play_off; voice_inputfromfile 1; voice_loopback 1; +voicerecord"\n'
  );
  sourceCfg.write(
    'alias source_play_off "-voicerecord; voice_inputfromfile 0; voice_loopback 0; alias source_play source_play_on"\n'
  );
  sourceCfg.write('alias source_updatecfg "host_writeconfig source_relay"\n');
  sourceCfg.write(`bind ${settings.play_button.toUpperCase()} source_play\n`);
  sourceCfg.write('alias source_curtrack "exec source_curtrack.cfg"\n');
  sourceCfg.write('alias source_saycurtrack "exec source_saycurtrack.cfg"\n');
  sourceCfg.write(
    'alias source_sayteamcurtrack "exec source_sayteamcurtrack.cfg"\n'
  );

  tracks.forEach((track, i) => {
    sourceCfg.write(
      `alias ${i + 1} "bind = ${i + 1}; source_updatecfg; echo Loaded: ${
        track.name
      }"\n`
    );
  });

  sourceCfg.write(
    'voice_enable 1; voice_modenable 1; voice_forcemicrecord 0; con_enable 1'
  );
  sourceCfg.end();
};

export const writeTracklistCfg = (gameId: number) => {
  const tracks = store.get('tracks').filter((track) => track.gameId === gameId);
  const game = getAllGames().find((val) => val.id === gameId);
  const settings = store.get('settings');

  const sourceTracklistCfg = fs.createWriteStream(
    `${settings.csgo_path}\\${game?.toCfg}\\source_tracklist.cfg`
  );
  sourceTracklistCfg.write(
    'echo "Select your track using the designated number"\n'
  );
  sourceTracklistCfg.write(
    'echo "----------------------------------------------"\n'
  );

  tracks.forEach((track, i) => {
    sourceTracklistCfg.write(
      `echo "${i + 1}. ${track.name} [${track.tags}]"\n`
    );
  });
  sourceTracklistCfg.end();
};
