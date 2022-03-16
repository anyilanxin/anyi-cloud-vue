import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import {
  ManageSpecialUrlVo,
  ManageSpecialUrlDto,
  ManageSpecialUrlQueryVo,
  ManageSpecialUrlPageVo,
  ManageSpecialUrlPageDto,
} from './model/manageSpecialUrlModel';
import { PageDto } from '/@/api/model/baseModel';

/**
 * @description: 新增
 */
export const insert = (data: ManageSpecialUrlVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.SYSTEM + '/manage-special-url/insert',
    data,
  });

/**
 * @description: 修改
 */
export const update = (data: ManageSpecialUrlVo, routeSpecialId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.SYSTEM + '/manage-special-url/update/{routeSpecialId}',
    data: { ...data, routeSpecialId },
  });

/**
 * @description: 详情
 */
export const getById = (routeSpecialId: string) =>
  defHttp.get<ManageSpecialUrlDto>({
    url: SysUrlPrefix.SYSTEM + '/manage-special-url/select/one/{routeSpecialId}',
    params: { routeSpecialId },
  });

/**
 * @description: 通过条件查询特殊地址多条数据
 */
export const getList = (data: ManageSpecialUrlQueryVo) =>
  defHttp.post<ManageSpecialUrlDto[]>({
    url: SysUrlPrefix.SYSTEM + '/manage-special-url/select/list',
    data,
  });

/**
 * @description: 逻辑删除
 */
export const deleteById = (routeSpecialId: string) =>
  defHttp.delete<string>({
    url: SysUrlPrefix.SYSTEM + '/manage-special-url/delete/{routeSpecialId}',
    params: { routeSpecialId },
  });

/**
 * @description: 分页查询
 */
export const selectPage = (data: ManageSpecialUrlPageVo) =>
  defHttp.post<PageDto<ManageSpecialUrlPageDto>>({
    url: SysUrlPrefix.SYSTEM + '/manage-special-url/select/page',
    data,
  });
