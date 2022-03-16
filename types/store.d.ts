import { ErrorTypeEnum } from '/@/enums/exceptionEnum';
import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum';

// Lock screen information
export interface LockInfo {
  // Password required
  pwd?: string | undefined;
  // Is it locked?
  isLock?: boolean;
}

// Error-log information
export interface ErrorLogInfo {
  // Type of error
  type: ErrorTypeEnum;
  // Error file
  file: string;
  // Error name
  name?: string;
  // Error message
  message: string;
  // Error stack
  stack?: string;
  // Error detail
  detail: string;
  // Error url
  url: string;
  // Error time
  time?: string;
}

export interface UserInfo {
  userId: string;
  userName: string;
  phone: string;
  nickName?: string;
  shortProfile?: string;
  realName?: string;
  avatar?: string;
  birthday?: string;
  sex: number;
  email: string;
  currentDepartId: string;
  currentDepartName: string;
  homePath?: string;
  roleCodes: string[];
}

export interface TokenInfo {
  token: string;
  validityInSeconds: number;
  expiresAt: string;
  tokenHeaderKey: string;
  tokenHeaderStartWith: string;
  tokenType: string;
  tokenQueryKey: string;
  refreshTokenKey: string;
}

export interface WebSecurityModel {
  validityInSeconds: number;
  expiresAt: string;
  publicKey: string;
  serialNumber: string;
  serialNumberKey: string;
  refreshHeaderKey: string;
  ciphertextKey: string;
  secretKey: string;
}

export interface BeforeMiniState {
  menuCollapsed?: boolean;
  menuSplit?: boolean;
  menuMode?: MenuModeEnum;
  menuType?: MenuTypeEnum;
}
