import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import {
  RbacPermissionPageVo,
  RbacPermissionPageDto,
  RbacPermissionTreeDto,
  RbacPermissionVo,
  RbacPermissionDto,
} from './model/rbacPermissionModel';
import { PageDto } from '/@/api/model/baseModel';

/**
 * @description: 分页查询
 */
export const selectPage = (data: RbacPermissionPageVo) =>
  defHttp.post<PageDto<RbacPermissionPageDto>>({
    url: SysUrlPrefix.AUTH + '/rbac-permission/select/page',
    data,
  });

/**
 * @description: 获取菜单权限树
 */
export const getPermissionTree = (type?: number, systemId?: string, status?: number) =>
  defHttp.get<RbacPermissionTreeDto[]>({
    url: SysUrlPrefix.AUTH + '/rbac-permission/select/tree',
    params: { type, status, systemId },
  });

/**
 * @description: 新增
 */
export const insert = (data: RbacPermissionVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.AUTH + '/rbac-permission/insert',
    data,
  });

/**
 * @description: 修改
 */
export const update = (data: RbacPermissionVo, permissionId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.AUTH + '/rbac-permission/update/{permissionId}',
    data: { ...data, permissionId },
  });

/**
 * @description: 详情
 */
export const getById = (permissionId: string) =>
  defHttp.get<RbacPermissionDto>({
    url: SysUrlPrefix.AUTH + '/rbac-permission/select/one/{permissionId}',
    params: { permissionId },
  });
