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
  RbacSystemDto,
  RbacSystemVo,
  RbacSystemPageVo,
  RbacSystemPageDto,
} from './model/rbacSystemModel';
import { PageDto } from '/@/api/model/baseModel';

/**
 * @description: 获取有效的系统类表
 */
export const getList = () =>
  defHttp.get<RbacSystemDto[]>({ url: SysUrlPrefix.SYSTEM + '/rbac-system/select/list' });

/**
 * @description: 权限表分页查询
 */
export const selectPage = (data: RbacSystemPageVo) =>
  defHttp.post<PageDto<RbacSystemPageDto>>({
    url: SysUrlPrefix.SYSTEM + '/rbac-system/select/page',
    data,
  });

/**
 * @description: 新增
 */
export const insert = (data: RbacSystemVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-system/insert',
    data,
  });

/**
 * @description: 修改
 */
export const update = (data: RbacSystemVo, systemId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-system/update/{systemId}',
    data: { ...data, systemId },
  });

/**
 * @description: 详情
 */
export const getById = (systemId: string) =>
  defHttp.get<RbacSystemDto>({
    url: SysUrlPrefix.SYSTEM + '/rbac-system/select/one/{systemId}',
    params: { systemId },
  });

/**
 * @description: 逻辑删除
 */
export const deleteById = (systemId: string) =>
  defHttp.delete<string>(
    {
      url: SysUrlPrefix.SYSTEM + '/rbac-system/delete-one/{systemId}',
      params: { systemId },
    },
    { successMessageMode: 'notification' },
  );
