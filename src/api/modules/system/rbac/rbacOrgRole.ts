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
 *   4.分发源码时候，请注明软件出处 https://github.com/anyilanxin/anyi-cloud；
 *   5.在修改包名，模块名称，项目代码等时，请注明软件出处 https://github.com/anyilanxin/anyi-cloud；
 *   6.本软件不允许在国家法律规定范围外使用，如出现违法行为原作者本人不承担任何法律风险；
 *   7.进行商用时，不得基于AnYi Cloud Vue的基础，修改包装而成一个与AnYi Zeebe EE、AnYi Cloud EE功能类似的程序，进行销售或发布，参与同类软件产品市场的竞争；
 *   8.本软件使用的第三方依赖皆为开源软件，如需要修改第三方源码请遵循第三方源码附带开源协议；
 *   9.本软件流程部分请遵循camunda开源协议：
 *     https://docs.camunda.org/manual/latest/introduction/third-party-libraries
 *     https://github.com/camunda/camunda-bpm-platform/blob/master/LICENSE
 *   10.若您的项目无法满足以上几点，可申请商业授权。
 */
import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import { SuccessMessageMode } from '/#/axios';
import {
  RbacOrgRolePageDto,
  RbacOrgRolePageVo,
  RbacRoleEffectiveDto,
  RbacOrgRoleDto,
  RbacOrgRoleMenuButtonDto,
  RbacOrgRoleVo,
  RbacOrgRoleAuthVo,
} from './model/rbacOrgRoleModel';
import { PageDto } from '/@/api/model/baseModel';
/**
 * @description: 分页查询
 */
export const selectPage = (data: RbacOrgRolePageVo) =>
  defHttp.post<PageDto<RbacOrgRolePageDto>>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org-role/select/page',
    data,
  });

/**
 * @description: 详情
 */
export const getById = (roleId: string) =>
  defHttp.get<RbacOrgRoleDto>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org-role/select/one/{roleId}',
    params: { roleId },
  });

/**
 * @description: 修改角色状态
 */
export const updateStatus = (roleId: string, status: number) =>
  defHttp.get<string>(
    {
      url: SysUrlPrefix.SYSTEM + '/rbac-org-role/update/status',
      params: { roleId, status },
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 逻辑删除
 */
export const deleteById = (roleId: string) =>
  defHttp.delete<string>(
    {
      url: SysUrlPrefix.SYSTEM + '/rbac-org-role/delete-one/{roleId}',
      params: { roleId },
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 获取有效的角色
 */
export const getEffectiveRoles = () =>
  defHttp.get<RbacRoleEffectiveDto[]>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org-role/select/role-info',
  });

/**
 * @description: 新增
 */
export const insert = (data: RbacOrgRoleVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org-role/insert',
    data,
  });

/**
 * @description: 获取某个角色菜单按钮权限信息
 */
export const getMenuActionById = (roleId: string) =>
  defHttp.get<RbacOrgRoleMenuButtonDto[]>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org-role/select/menu-action/{roleId}',
    params: { roleId },
  });

/**
 * @description: 修改
 */
export const update = (data: RbacOrgRoleVo, roleId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org-role/update/{roleId}',
    data: { ...data, roleId },
  });

/**
 * @description: 关联角色权限信息
 */
export const updateAuth = (data: RbacOrgRoleAuthVo, roleId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org-role/update-auth/{roleId}',
    data: { ...data, roleId },
  });

/**
 * @description: 同步流程引擎
 */
export const syncProcess = (mode: SuccessMessageMode = 'notification') =>
  defHttp.get<String>(
    { url: SysUrlPrefix.SYSTEM + '/rbac-org-role/sync/process' },
    { successMessageMode: mode },
  );
