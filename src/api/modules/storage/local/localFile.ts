import { defHttp } from '/@/utils/http/axios';
import { UploadFileParams } from '/#/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import { LocalFileDto } from './model/localFileModel';

/**
 * @description: Upload interface
 */
export function upload(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void
) {
  return defHttp.uploadFile<LocalFileDto>(
    {
      url: SysUrlPrefix.STORAGE + '/local/file/upload',
      onUploadProgress,
    },
    params
  );
}
