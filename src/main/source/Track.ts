export default class Track {
  public name: string;
  public tags: string[];
  public hotkey?: string;
  public volume? = 100;
  public startPos?: number;
  public endPos?: number;
  public path: string;

  constructor(
    name: string,
    tags: string[],
    hotkey: string,
    startPos: number,
    endPos: number,
    path: string
  ) {
    this.name = name;
    this.tags = tags;
    this.hotkey = hotkey;
    this.startPos = startPos;
    this.endPos = endPos;
    this.path = path;
  }
}
