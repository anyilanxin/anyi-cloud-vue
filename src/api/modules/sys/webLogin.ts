import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import { ErrorMessageMode } from '/#/axios';
import { TokenInfo, LoginPicture, LoginSms } from './model/webLoginModel';

/**
 * @description: 验证码登录
 */
export const loginPicture = (params: LoginPicture, mode: ErrorMessageMode = 'none') =>
  defHttp.post<TokenInfo>(
    { url: SysUrlPrefix.AUTH + '/web/login/picture', params },
    { errorMessageMode: mode }
  );

/**
 * @description: 短信登录
 */
export const loginSmsCode = (params: LoginSms) =>
  defHttp.post<TokenInfo>({ url: SysUrlPrefix.AUTH + '/web/login/sms', params });
