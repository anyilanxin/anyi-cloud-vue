import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import {
  RbacRolePageDto,
  RbacRolePageVo,
  RbacRoleEffectiveDto,
  RbacRoleDto,
  RbacRoleVo,
  RbacRolePermissionVo,
} from './model/rbacRoleModel';
import { PageDto } from '/@/api/model/baseModel';
/**
 * @description: 分页查询
 */
export const selectPage = (data: RbacRolePageVo) =>
  defHttp.post<PageDto<RbacRolePageDto>>({
    url: SysUrlPrefix.AUTH + '/rbac-role/select/page',
    data,
  });

/**
 * @description: 详情
 */
export const getById = (roleId: string) =>
  defHttp.get<RbacRoleDto>({
    url: SysUrlPrefix.AUTH + '/rbac-role/select/one/{roleId}',
    params: { roleId },
  });

/**
 * @description: 修改角色状态
 */
export const updateStatus = (roleId: string, status: number) =>
  defHttp.get<string>({
    url: SysUrlPrefix.AUTH + '/rbac-role/update/status',
    params: { roleId, status },
  });

/**
 * @description: 逻辑删除
 */
export const deleteById = (roleId: string) =>
  defHttp.delete<string>({
    url: SysUrlPrefix.AUTH + '/rbac-role/delete/{roleId}',
    params: { roleId },
  });

/**
 * @description: 获取有效的角色
 */
export const getEffectiveRoles = () =>
  defHttp.get<RbacRoleEffectiveDto[]>({
    url: SysUrlPrefix.AUTH + '/rbac-role/select/role-info',
  });

/**
 * @description: 新增
 */
export const insert = (data: RbacRoleVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.AUTH + '/rbac-role/insert',
    data,
  });

/**
 * @description: 修改
 */
export const update = (data: RbacRoleVo, roleId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.AUTH + '/rbac-role/update/{roleId}',
    data: { ...data, roleId },
  });

/**
 * @description: 关联角色权限信息
 */
export const editPermission = (data: RbacRolePermissionVo) =>
  defHttp.put<String>({
    url: SysUrlPrefix.AUTH + '/rbac-role/insert-permission',
    data,
  });
