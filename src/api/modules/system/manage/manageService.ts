import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import {
  ValidServiceInfoDto,
  ManageServicePageVo,
  ManageServicePageDto,
  ManageServiceVo,
  ManageServiceDto,
  SystemStatDto,
  ManageServiceFilterUrlDto,
} from './model/manageServiceModel';
import { PageDto } from '/@/api/model/baseModel';

/**
 * @description: 获取有效的服务列表
 */
export const getValidServiceInfo = () =>
  defHttp.get<ValidServiceInfoDto[]>({
    url: SysUrlPrefix.SYSTEM + '/manage-service/select/list-valid-info',
  });

/**
 * @description: 分页查询
 */
export const selectPage = (data: ManageServicePageVo) =>
  defHttp.post<PageDto<ManageServicePageDto>>({
    url: SysUrlPrefix.SYSTEM + '/manage-service/select/page',
    data,
  });

/**
 * @description: 新增
 */
export const insert = (data: ManageServiceVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.SYSTEM + '/manage-service/insert',
    data,
  });

/**
 * @description: 获取服务器过滤器信息以及特殊url信息
 */
export const selectServiceFilterInfo = (serviceId: string) =>
  defHttp.get<ManageServiceFilterUrlDto>({
    url: SysUrlPrefix.SYSTEM + '/manage-service/select/filter-url/{serviceId}',
    params: { serviceId },
  });

/**
 * @description: 修改
 */
export const update = (data: ManageServiceVo, serviceId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.SYSTEM + '/manage-service/update/{serviceId}',
    data: { ...data, serviceId },
  });

/**
 * @description: 详情
 */
export const getById = (serviceId: string) =>
  defHttp.get<ManageServiceDto>({
    url: SysUrlPrefix.SYSTEM + '/manage-service/select/one/{serviceId}',
    params: { serviceId },
  });

/**
 * @description: 逻辑删除
 */
export const deleteById = (serviceId: string) =>
  defHttp.delete<string>({
    url: SysUrlPrefix.SYSTEM + '/manage-service/delete/{serviceId}',
    params: { serviceId },
  });

/**
 * @description: 获取系统统计
 */
export const systemStat = () =>
  defHttp.get<SystemStatDto>({
    url: SysUrlPrefix.SYSTEM + '/manage-service/stat',
  });
