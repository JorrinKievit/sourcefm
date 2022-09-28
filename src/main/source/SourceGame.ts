import Track from './Track';

export default class SourceGame {
  public blacklist: string[];
  public name: string;
  public id: number;
  public directory: string;
  public toCfg: string;
  public libraryName: string;
  public voiceFadeOut = true;
  public exeName = 'hl2';
  public fileExtension = '.wav';
  public sampleRate = 11025;
  public bits = 16;
  public channels = 1;
  public pollInterval = 100;
  public tracks: Track[];

  constructor(
    name: string,
    id: number,
    directory: string,
    toCfg: string,
    libraryName: string,
    voiceFadeOut: boolean,
    exeName: string,
    sampleRate: number,
    blacklist?: string[]
  ) {
    this.blacklist = [
      'slam',
      'slam_listtracks',
      'list',
      'tracks',
      'la',
      'slam_play',
      'slam_play_on',
      'slam_play_off',
      'slam_updatecfg',
      'slam_curtrack',
      'slam_saycurtrack',
      'slam_sayteamcurtrack',
    ];
    this.name = name;
    this.id = id;
    this.directory = directory;
    this.toCfg = toCfg;
    this.libraryName = libraryName;
    this.voiceFadeOut = voiceFadeOut;
    this.exeName = exeName;
    this.sampleRate = sampleRate;
    this.tracks = [];
    if (blacklist) {
      this.blacklist.push(...blacklist);
    }
  }
}
