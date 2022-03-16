import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import { RbacOrgTreeDto, RbacOrgPageVo, RbacOrgTreePageDto, RbacOrgVo } from './model/rbacOrgModel';
import { PageDto } from '/@/api/model/baseModel';
/**
 * @description: 获取组织机构树
 */
export const selectOrgTreeList = (type?: number) =>
  defHttp.get<RbacOrgTreeDto[]>({
    url: SysUrlPrefix.AUTH + '/rbac-org/select/org-tree-list',
    params: { type: type },
  });

/**
 * @description: 分页查询
 */
export const selectPage = (data: RbacOrgPageVo) =>
  defHttp.post<PageDto<RbacOrgTreePageDto>>({
    url: SysUrlPrefix.AUTH + '/rbac-org/select/page',
    data,
  });

/**
 * @description: 新增
 */
export const insert = (data: RbacOrgVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.AUTH + '/rbac-org/insert',
    data,
  });

/**
 * @description: 修改
 */
export const update = (data: RbacOrgVo, orgId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.AUTH + '/rbac-org/update/{orgId}',
    data: { ...data, orgId },
  });
