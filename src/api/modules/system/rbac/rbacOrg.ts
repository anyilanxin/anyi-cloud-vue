/*
 * Copyright (c) 2021-present ZHOUXUANHONG(安一老厨)<anyilanxin@aliyun.com>
 *
 * AnYi Cloud Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * AnYi Cloud Vue 采用APACHE LICENSE 2.0开源协议，您在使用过程中，需要注意以下几点：
 *   1.请不要删除和修改根目录下的LICENSE.txt文件；
 *   2.请不要删除和修改 AnYi Cloud Vue 源码头部的版权声明；
 *   3.请保留源码和相关描述文件的项目出处，作者声明等；
 *   4.分发源码时候，请注明软件出处 https://github.com/anyilanxin/anyi-cloud-vue；
 *   5.在修改包名，模块名称，项目代码等时，请注明软件出处 https://github.com/anyilanxin/anyi-cloud-vue；
 *   6.本软件不允许在国家法律规定范围外使用，如出现违法行为原作者本人不承担任何法律风险；
 *   7.进行商用时，不得基于AnYi Cloud Vue的基础，修改包装而成一个与AnYi Zeebe EE、AnYi Cloud EE、AnYi Cloud EE Vue功能类似的程序，进行销售或发布，参与同类软件产品市场的竞争；
 *   8.本软件使用的第三方依赖皆为开源软件，如需要修改第三方源码请遵循第三方源码附带开源协议；
 *   9.本软件中使用了bpmn js,使用请遵循bpmn.io开源协议：
 *     https://github.com/bpmn-io/bpmn-js/blob/develop/LICENSE
 *   10.若您的项目无法满足以上几点，可申请商业授权。
 */
import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import {
  RbacOrgTreeDto,
  RbacOrgPageVo,
  RbacOrgTreePageDto,
  RbacOrgVo,
  RbacOrgDto,
} from './model/rbacOrgModel';

import { RbacResourceDto } from './model/rbacResourceModel';
import { RbacResourceApiPageVo, RbacResourceApiPageDto } from './model/rbacResourceApiModel';
import { RbacMenuTreeDto } from './model/rbacMenuModel';
import { PageDto } from '/@/api/model/baseModel';
/**
 * @description: 获取组织机构树
 */
export const selectOrgTreeList = (type?: number) =>
  defHttp.get<RbacOrgTreeDto[]>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org/select/org-tree-list',
    params: { type: type },
  });

/**
 * @description: 分页查询
 */
export const selectPage = (data: RbacOrgPageVo) =>
  defHttp.post<PageDto<RbacOrgTreePageDto>>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org/select/page',
    data,
  });

/**
 * @description: 新增
 */
export const insert = (data: RbacOrgVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org/insert',
    data,
  });

/**
 * @description: 修改
 */
export const update = (data: RbacOrgVo, orgId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org/update/{orgId}',
    data: { ...data, orgId },
  });

/**
 * @description: 逻辑删除
 */
export const deleteById = (orgId: string) =>
  defHttp.delete<string>(
    {
      url: SysUrlPrefix.SYSTEM + '/rbac-org/delete-one/{orgId}',
      params: { orgId },
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 查询
 */
export const getById = (orgId: String) =>
  defHttp.get<RbacOrgDto>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org/select/one/{orgId}',
    params: { orgId },
  });

/**
 * @description: 获取机构菜单权限树
 */
export const getMenuTree = (orgId: string, systemId?: string, status?: number) =>
  defHttp.get<RbacMenuTreeDto[]>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org/select/tree',
    params: { orgId, status, systemId },
  });

/**
 * @description: 获取有效的资源列表
 */
export const selectResourceList = (type?: number) =>
  defHttp.get<RbacResourceDto[]>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org/select-resource/list',
    params: { type },
  });

/**
 * @description: 资源api表分页查询
 */
export const selectResourcePage = (data: RbacResourceApiPageVo) =>
  defHttp.post<PageDto<RbacResourceApiPageDto>>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org/select-resource-api/page',
    data,
  });
