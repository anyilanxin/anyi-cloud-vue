import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import {
  RbacUserPageDto,
  RbacUserPageVo,
  RbacUserVo,
  RbacUserDto,
  RbacCorrelateRoleVo,
} from './model/rbacUserModel';
import { PageDto } from '/@/api/model/baseModel';

/**
 * @description: 分页查询
 */
export const selectPage = (data: RbacUserPageVo) =>
  defHttp.post<PageDto<RbacUserPageDto>>({
    url: SysUrlPrefix.AUTH + '/rbac-user/select/page',
    data,
  });

/**
 * @description: 新增
 */
export const insert = (data: RbacUserVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.AUTH + '/rbac-user/insert',
    data,
  });

/**
 * @description: 删除
 */
export const deleteById = (userId: string) =>
  defHttp.delete<String>({
    url: SysUrlPrefix.AUTH + '/rbac-user/delete/{userId}',
    params: { userId },
  });

/**
 * @description: 修改
 */
export const update = (data: RbacUserVo, userId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.AUTH + '/rbac-user/update/{userId}',
    data: { ...data, userId },
  });

/**
 * @description: 详情
 */
export const getById = (userId: string) =>
  defHttp.get<RbacUserDto>({
    url: SysUrlPrefix.AUTH + '/rbac-user/select/one/{userId}',
    params: { userId },
  });

/**
 * @description: 用户授权
 */
export const userAuth = (data: RbacCorrelateRoleVo) =>
  defHttp.post<string>({
    url: SysUrlPrefix.AUTH + '/rbac-user/auth',
    data,
  });
