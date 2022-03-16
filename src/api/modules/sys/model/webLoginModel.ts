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

export interface LoginPicture {
  userName: string;
  password: string;
  codeId: string;
  code: string;
  rememberMe: boolean;
}

export interface LoginSms {
  phone: string;
  code: string;
  rememberMe: string;
}
