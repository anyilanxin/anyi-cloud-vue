import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import {
  CommonSystemDto,
  CommonSystemVo,
  CommonSystemPageVo,
  CommonSystemPageDto,
} from './model/commonSystemModel';
import { PageDto } from '/@/api/model/baseModel';

/**
 * @description: 获取有效的系统类表
 */
export const getList = () =>
  defHttp.get<CommonSystemDto[]>({ url: SysUrlPrefix.AUTH + '/common-system/select/list' });

/**
 * @description: 权限表分页查询
 */
export const selectPage = (data: CommonSystemPageVo) =>
  defHttp.post<PageDto<CommonSystemPageDto>>({
    url: SysUrlPrefix.AUTH + '/common-system/select/page',
    data,
  });

/**
 * @description: 新增
 */
export const insert = (data: CommonSystemVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.AUTH + '/common-system/insert',
    data,
  });

/**
 * @description: 修改
 */
export const update = (data: CommonSystemVo, systemId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.AUTH + '/common-system/update/{systemId}',
    data: { ...data, systemId },
  });

/**
 * @description: 详情
 */
export const getById = (systemId: string) =>
  defHttp.get<CommonSystemDto>({
    url: SysUrlPrefix.AUTH + '/common-system/select/one/{systemId}',
    params: { systemId },
  });
