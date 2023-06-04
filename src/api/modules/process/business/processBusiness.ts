/*
 * Copyright (c) 2023-present ZHOUXUANHONG(安一老厨)<anyilanxin@aliyun.com>
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
 *   7.进行商用时，不得基于AnYi Cloud Vue的基础，修改包装而成一个与AnYi Cloud EE、AnYi Zeebe EE、AnYi Standalone EE功能类似的程序，进行销售或发布，参与同类软件产品市场的竞争；
 *   8.本软件使用的第三方依赖皆为开源软件，如需要修改第三方源码请遵循第三方源码附带开源协议；
 *   9.本软件中使用了bpmn js,使用请遵循bpmn.io开源协议：
 *     https://github.com/bpmn-io/bpmn-js/blob/develop/LICENSE
 *   10.若您的项目无法满足以上几点，可申请商业授权。
 */
import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import { PageDto } from '/@/api/model/baseModel';
import {
  FormSubmitProcessModel,
  MsgSubmitProcessModel,
  ProcessCallbackResultModel,
  ProcessQueryPageVo,
  ProcessInstanceDetailDto,
  ProcessPageDto,
  CancelProcessVo,
  InstanceApplyInfoDto,
  ProcessUrgentVo,
  ActInstanceInfoModel,
  InstanceUserTaskDto,
} from './model/processBusinessModel';
/**
 * @description: 发起流程
 */
export const submitProcess = (data: FormSubmitProcessModel) =>
  defHttp.post<ProcessCallbackResultModel>({
    url: SysUrlPrefix.PROCESS + '/business-process/process/submit',
    data,
  });

/**
 * @description: 发起流程(消息启动)
 */
export const msgSubmitProcess = (data: MsgSubmitProcessModel) =>
  defHttp.post<ProcessCallbackResultModel>({
    url: SysUrlPrefix.PROCESS + '/business-process/process/msg-submit',
    data,
  });

/**
 * @description: 流程作废
 */
export const cancelProcess = (data: CancelProcessVo) =>
  defHttp.post<String>(
    {
      url: SysUrlPrefix.PROCESS + '/business-process/process/cancel',
      data,
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 催办
 */
export const urgentTask = (data: ProcessUrgentVo) =>
  defHttp.post<String>(
    {
      url: SysUrlPrefix.PROCESS + '/business-process/process/urgent',
      data,
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 分页查询我的申请
 */
export const selectProcessPage = (data: ProcessQueryPageVo) =>
  defHttp.post<PageDto<ProcessPageDto>>({
    url: SysUrlPrefix.PROCESS + '/business-process/select/process/page',
    data,
  });

/**
 * @description: 查询流程详情
 */
export const getSubmitDetail = (processInstanceId: string) =>
  defHttp.get<ProcessInstanceDetailDto>({
    url: SysUrlPrefix.PROCESS + '/business-process/process/select-detail/{processInstanceId}',
    params: { processInstanceId },
  });

/**
 * @description: 获取申请基本信息(包含申请表单)
 */
export const selectInstanceApplyInfo = (processInstanceId: string) =>
  defHttp.get<InstanceApplyInfoDto>({
    url: SysUrlPrefix.PROCESS + '/business-process/select/instance/apply-info/{processInstanceId}',
    params: { processInstanceId },
  });

/**
 * @description: 获取用户任务(审批意见)
 */
export const selectInstanceOptions = (processInstanceId: string) =>
  defHttp.get<InstanceUserTaskDto[]>({
    url: SysUrlPrefix.PROCESS + '/business-process/select/instance/user-task/{processInstanceId}',
    params: { processInstanceId },
  });

/**
 * @description: 获取活动实例信息(包含审批意见,用于流程图渲染)
 */
export const selectActInstanceInfos = (processInstanceId: string) =>
  defHttp.get<ActInstanceInfoModel>({
    url: SysUrlPrefix.PROCESS + '/business-process/select/instance/act-infos/{processInstanceId}',
    params: { processInstanceId },
  });
