import { Display } from './display';

export interface Point {
  x: number;
  y: number;
  lineID: number;
}

export interface DisplayOptions extends ParserOptions {
  colors?: boolean;
  backgroundColors?: boolean;
  container?: string | JQuery | HTMLElement;
}

export interface WindowState {
  x: number;
  y: number;
  width: number;
  height: number;
  maximized: boolean;
}

export enum NewLineType {
  None = 0,
  Ctrl = 1,
  Shift = 2,
  CtrlOrShift = 4,
  CtrlAndShift = 8
}

export enum ScriptEngineType {
  Full = 1,
  Fast = 2,
  Simple = 4
}

export enum FormatType {
  Normal = 0,
  Link = 1,
  LinkEnd = 2,
  MXPLink = 3,
  MXPLinkEnd = 4,
  Image = 5,
  WordBreak = 6,
  MXPSend = 7,
  MXPSendEnd = 8,
  MXPExpired = 9,
  MXPSkip = 10
}

export enum OnDisconnect {
  Nothing = 0, Reconnect = 1, ReconnectDialog = 2, LoadManager = 4, Close = 8
}

export enum OnProfileChange {
  Nothing = 0, Reload = 1, Ask = 2, Warn = 4
}

export enum OnProfileDeleted {
  Nothing = 0, Remove = 1, Ask = 2, Warn = 4
}

export enum ProfileSortOrder {
  None = 0, Alpha = 2, Priority = 4, Index = 8
}

export enum Echo {
  None = 0, Triggers = 8, Scripts = 2, Commands = 4
}

export enum TabCompletion { PrependBuffer = 1, AppendBuffer = 2, BufferOnly = 4, List = 8 }

/**
   * Enum flag for Font styles.
   * @readonly
   * @enum {number}
   * @typedef {number} FontStyle
   */
export enum FontStyle {
  None = 0,
  Bold = 1,
  Faint = 2,
  Italic = 4,
  Underline = 8,
  Slow = 16, /** @desc Slow blink text combined with slow for final blink  */
  Rapid = 32, /** @desc Rapid blink text combined with slow for final blink */
  Inverse = 64, /** @desc reverse back and fore color */
  Hidden = 128, /** @desc hide text */
  Strikeout = 256,
  DoubleUnderline = 512,
  Overline = 1024
}

export enum SettingType {
  String = 0,
  Boolean = 1,
  Number = 2,
  Raw = 3,
  Custom = 4,
  ComboBox = 5
}

export interface LineFormat {
  formatType: FormatType;
  offset: number;
  color: string | number;
  background: string | number;
  size: string;
  font: string;
  style: FontStyle;
  hr?: boolean;
}

export interface ImageFormat {
  formatType: FormatType;
  name: string;
  url: string;
  type: string;
  height: string;
  width: string;
  vspace: string;
  align: string;
  ismap: boolean;
}

export interface LinkFormat {
  formatType: FormatType;
  href?: string;
  hint?: string;
  expire?: string;
  prompt?: boolean;
  tt?: string | number;
}

export interface ParserLine {
  raw: string;
  line: string;
  fragment: boolean;
  gagged: boolean;
  formats: LineFormat[];
  remote: boolean;
  timestamp?: number;
}

export interface ParserOptions {
  DefaultImageURL?: string;
  enableMXP?: boolean;
  enableDebug?: boolean;
  enableMSP?: boolean;
  enableURLDetection?: boolean;
  window?: Size;
  enableFlashing?: boolean;
  emulateTerminal?: boolean;
  bell?: string;
  enableBell?: boolean;
  display?: Display;
  enableLinks?: boolean;
  showInvalidMXPTags?: boolean;
}

export class Size {
  public width: number;
  public height: number;

  constructor(width: number, height: number) {
    this.width = width || 0;
    this.height = height || 0;
  }
}

export enum IEDError {
  RESET = 1,
  USERRESET = 2,
  DL_USERABORT = 3,
  DL_NOTSTART = 4,
  DL_TOOMANY = 5,
  DL_INPROGRESS = 6,
  DL_UNKNOWN = 7,
  UL_USERABORT = 8,
  UL_BADENCODE = 9,
  UL_TOOLARGE = 10,
  UL_FAILWRITE = 11,
  UL_UNKNOWN = 12,
  UL_INVALIDFILE = 13,
  UL_INVALIDPATH = 14,
  DL_INVALIDFILE = 15,
  DL_INVALIDPATH = 16,
  CMD_INVALIDFMT = 17,
  CMD_INVALID = 18,
  DIR_INVALIDFMT = 19,
  DIR_INVALIDPATH = 20,
  UL_INVALIDFMT = 21,
  DL_INVALIDFMT = 22,
  DIR_TOOMANY = 23,
  DIR_CANTREAD = 24,
  DIR_NOTSTART = 25,
  CMD_DENIED = 26,
  CMD_INVALIDFILE = 27,
  CMD_INVALIDARG = 28,
  CMD_INVALIDPATH = 29,
  INVALIDPATH = 30,
  INVALIDFILE = 31,
  CMD_NOEXIST = 32,
  CMD_DIRECTORY = 33,
  CMD_EXIST = 34,
  CMD_UNKNOWN = 35,
  UL_TOOMANY = 36,
  UL_INPROGRESS = 37,
  CMD_FILE = 38,
  UL_DENIED = 39,
  UL_FILE = 40,
  USER_DENIED = 41
}

export enum IEDCmdStatus {
  denied = 0,
  success = 1,
  failed = 2
}

export enum ProfileSaveType {
  Any = 0,
  Trigger = 1,
  Button = 2,
  Macro = 4,
  Alias = 8,
  Context = 16,
  Variable = 32
}

export interface MenuItem {
  id?: string;
  name: string;
  action?: Function | string;
  icon?: string;
  position?: number | string;
  active?: boolean,
  exists?,
  hidden?: boolean
}

export interface FunctionEvent {
  name: string;
  args: string[];
  raw: string;
  handled: boolean;
  return: any;
}
