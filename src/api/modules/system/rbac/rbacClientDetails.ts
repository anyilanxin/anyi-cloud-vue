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
 *   1.请不要删除和修改根目录下的LICENSE文件；
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
import {
  RbacClientDetailsPageVo,
  RbacClientDetailsPageDto,
  RbacClientDetailsVo,
  RbacClientDetailsDto,
  RbacClientResetDto,
  RbacClientResourceApiPageVo,
  RbacClientAuthVo,
} from './model/rbacClientDetailsModel';

import { RbacResourceDto } from './model/rbacResourceModel';
import { RbacResourceApiPageDto } from './model/rbacResourceApiModel';
import { PageDto } from '/@/api/model/baseModel';

/**
 * @description: 分页查询
 */
export const selectPage = (data: RbacClientDetailsPageVo) =>
  defHttp.post<PageDto<RbacClientDetailsPageDto>>({
    url: SysUrlPrefix.SYSTEM + '/rbac-client/select/page',
    data,
  });

/**
 * @description: 新增
 */
export const insert = (data: RbacClientDetailsVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-client/insert',
    data,
  });

/**
 * @description: 修改
 */
export const update = (data: RbacClientDetailsVo, resourceId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-client/update/{resourceId}',
    data: { ...data, resourceId },
  });

/**
 * @description: 查看详情
 */
export const getById = (apiId: string) =>
  defHttp.get<RbacClientDetailsDto>({
    url: SysUrlPrefix.SYSTEM + '/rbac-client/select/one/{apiId}',
    params: { apiId },
  });

/**
 * @description: 逻辑删除
 */
export const deleteById = (resourceId: string) =>
  defHttp.delete<string>(
    {
      url: SysUrlPrefix.SYSTEM + '/rbac-client/delete-one/{resourceId}',
      params: { resourceId },
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 逻辑批量删除
 */
export const deleteBatchByIds = (data: string[]) =>
  defHttp.post<string>(
    {
      url: SysUrlPrefix.SYSTEM + '/rbac-client/delete-batch',
      data,
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 修改状态
 */
export const updateState = (resourceId: String, type: Number) =>
  defHttp.get<String>(
    {
      url: SysUrlPrefix.SYSTEM + '/rbac-client/update/state',
      params: { resourceId, type },
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 重置密码
 */
export const resetPassword = (data: RbacClientResetDto) =>
  defHttp.get<String>(
    {
      url: SysUrlPrefix.SYSTEM + '/rbac-client/update/state',
      data,
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 获取有效的资源列表
 */
export const selectResourceList = (clientDetailId: string, type?: number) =>
  defHttp.get<RbacResourceDto[]>({
    url: SysUrlPrefix.SYSTEM + '/rbac-client/select-resource/list',
    params: { type, clientDetailId },
  });

/**
 * @description: 资源api表分页查询
 */
export const selectResourcePage = (data: RbacClientResourceApiPageVo) =>
  defHttp.post<PageDto<RbacResourceApiPageDto>>({
    url: SysUrlPrefix.SYSTEM + '/rbac-client/select-resource-api/page',
    data,
  });

/**
 * @description: 更新或添加权限
 */
export const updateAuth = (data: RbacClientAuthVo, clientDetailId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-client/update-auth/{clientDetailId}',
    data: { ...data, clientDetailId },
  });
