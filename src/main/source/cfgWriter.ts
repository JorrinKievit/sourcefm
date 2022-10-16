import fs from 'fs';
import { store } from '../store';
import { getAllGames } from './games';

const cfgs = [
  ['echo', 'sourcefm_curtrack'],
  ['say', 'sourcefm_saycurtrack'],
  ['say_team', 'sourcefm_sayteamcurtrack'],
];

export const writeSourceFMCfg = (gameId: number) => {
  const tracks = store.get('tracks')[gameId];
  const game = getAllGames().find((val) => val.id === gameId);
  const settings = store.get('settings');

  const sourceFMCfg = fs.createWriteStream(
    `${settings.csgo_path}\\${game?.toCfg}\\sourcefm.cfg`
  );
  sourceFMCfg.write('alias tracklist "exec sourcefm_tracklist.cfg"\n');
  sourceFMCfg.write('alias sourcefm_play sourcefm_play_on\n');
  sourceFMCfg.write(
    'alias sourcefm_play_on "alias sourcefm_play sourcefm_play_off; voice_inputfromfile 1; voice_loopback 1; +voicerecord"\n'
  );
  sourceFMCfg.write(
    'alias sourcefm_play_off "-voicerecord; voice_inputfromfile 0; voice_loopback 0; alias sourcefm_play sourcefm_play_on"\n'
  );
  sourceFMCfg.write(
    'alias sourcefm_updatecfg "host_writeconfig sourcefm_relay"\n'
  );
  sourceFMCfg.write(
    `bind ${settings.play_button.toUpperCase()} sourcefm_play\n`
  );
  sourceFMCfg.write('alias sourcefm_curtrack "exec sourcefm_curtrack.cfg"\n');
  sourceFMCfg.write(
    'alias sourcefm_saycurtrack "exec sourcefm_saycurtrack.cfg"\n'
  );
  sourceFMCfg.write(
    'alias sourcefm_sayteamcurtrack "exec sourcefm_sayteamcurtrack.cfg"\n'
  );
  sourceFMCfg.write(
    `bind ${settings.saycurtrack_button.toUpperCase()} sourcefm_saycurtrack\n`
  );
  sourceFMCfg.write(
    `bind ${settings.sayteamcurtrack_button.toUpperCase()} sourcefm_sayteamcurtrack\n`
  );

  tracks.forEach((track, i) => {
    sourceFMCfg.write(
      `alias ${i + 1} "bind = ${i + 1}; sourcefm_updatecfg; echo Loaded: ${
        track.name
      }"\n`
    );
  });

  sourceFMCfg.write(
    'voice_enable 1; voice_modenable 1; voice_forcemicrecord 0; con_enable 1\n'
  );
  sourceFMCfg.write(
    'echo "SourceFM loaded, see the tracklist by typing `tracklist` in the console"\n'
  );
  sourceFMCfg.end();
};

export const writeTracklistCfg = (gameId: number) => {
  const tracks = store.get('tracks')[gameId];
  const game = getAllGames().find((val) => val.id === gameId);
  const settings = store.get('settings');

  const sourceTracklistCfg = fs.createWriteStream(
    `${settings.csgo_path}\\${game?.toCfg}\\sourcefm_tracklist.cfg`
  );
  sourceTracklistCfg.write(
    'echo "Select your track using the designated number (Tags are still a Work in Progress)"\n'
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

export const writeCurrentTrackCfg = (gameId: number, trackName: string) => {
  const settings = store.get('settings');
  const game = getAllGames().find((val) => val.id === gameId);

  cfgs.forEach((cfg) => {
    const sourceCurTrackCfg = fs.createWriteStream(
      `${settings.csgo_path}\\${game?.toCfg}\\${cfg[1]}.cfg`
    );
    sourceCurTrackCfg.write(
      `${cfg[0]} "(SourceFM) Now Playing: ${trackName}"\n`
    );
    sourceCurTrackCfg.end();
  });
};
