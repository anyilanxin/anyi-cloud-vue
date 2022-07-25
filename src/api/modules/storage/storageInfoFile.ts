import { defHttp } from '/@/utils/http/axios';
import { UploadFileParams } from '/#/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import { StorageInfoModel } from './model/storageInfoFileModel';
import { useGlobSetting } from '/@/hooks/setting';
import { getTokenInfo } from '/@/utils/auth';
const globSetting = useGlobSetting();

/**
 * @description: Upload interface
 */
export function upload(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile<StorageInfoModel>(
    {
      url: SysUrlPrefix.STORAGE + '/storage-file/upload',
      onUploadProgress,
    },
    params,
  );
}

/**
 * @description: 上传文件
 */
export function uploadFile(params: any) {
  return defHttp.uploadFile<StorageInfoModel>(
    {
      url: SysUrlPrefix.STORAGE + '/storage-file/upload',
    },
    params,
  );
}

/**
 * @description: 获取上传action
 */
export function getUploadAction() {
  return globSetting.urlPrefix + globSetting.apiUrl + SysUrlPrefix.STORAGE + '/storage-file/upload';
}

/**
 * @description: 获取上传请求头
 */
export function getUploadHeaders() {
  const token = getTokenInfo();
  const headers = {};
  if (token && Object.keys(token).length > 0) {
    headers['Authorization'] = 'Bearer ' + token.access_token;
  }
  return headers;
}
