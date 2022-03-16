import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import { ManageRouteFilterVo, ManageRouteFilterDto } from './model/manageRouteFilterModel';

/**
 * @description: 通过过滤器id修改过滤器状态
 */
export const updateStatus = (filterId: string, state: number) =>
  defHttp.get<string>({
    url: SysUrlPrefix.SYSTEM + '/manage-route-filter/update-status',
    params: { filterId, state },
  });

/**
 * @description: 新增
 */
export const insert = (data: ManageRouteFilterVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.SYSTEM + '/manage-route-filter/insert',
    data,
  });

/**
 * @description: 修改
 */
export const update = (data: ManageRouteFilterVo, filterId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.SYSTEM + '/manage-route-filter/update/{filterId}',
    data: { ...data, filterId },
  });

/**
 * @description: 详情
 */
export const getById = (filterId: string) =>
  defHttp.get<ManageRouteFilterDto>({
    url: SysUrlPrefix.SYSTEM + '/manage-route-filter/select/one/{filterId}',
    params: { filterId },
  });

/**
 * @description: 逻辑删除
 */
export const deleteById = (filterId: string) =>
  defHttp.delete<string>({
    url: SysUrlPrefix.SYSTEM + '/manage-route-filter/delete-one/{filterId}',
    params: { filterId },
  });
