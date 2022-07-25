import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import { ApiInfoParseParamsModel } from './model/apiDocModel';

/**
 * @description: 解析swagger json并导出为word
 */
export const swaggerToWord = (data: ApiInfoParseParamsModel) =>
  defHttp.post(
    {
      url: SysUrlPrefix.TOOLS + '/api-doc/parse-swagger/json-to-word',
      data,
      responseType: 'blob',
    },
    { isReturnNativeResponse: true }
  );
