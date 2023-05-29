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
import { PageDto } from '/@/api/model/baseModel';
import {
  TaskQueryPageVo,
  TaskWaitPageDto,
  TaskHistoryPageDto,
  TaskHistoryQueryPageVo,
  CompleteTaskModel,
  EnableDismissVo,
  EnableDismissDto,
  DismissTaskModel,
  WaitUserTaskDetailModel,
} from './model/taskBusinessModel';

/**
 * @description: 分页查询一般待处理任务
 */
export const selectGeneralTaskPage = (data: TaskQueryPageVo) =>
  defHttp.post<PageDto<TaskWaitPageDto>>({
    url: SysUrlPrefix.PROCESS + '/business-task/select/general-task/page',
    data,
  });

/**
 * @description: 分页查询委托任务
 */
export const selectDelegateTaskPage = (data: TaskQueryPageVo) =>
  defHttp.post<PageDto<TaskWaitPageDto>>({
    url: SysUrlPrefix.PROCESS + '/business-task/select/delegate-task/page',
    data,
  });

/**
 * @description: 分页查询催办任务
 */
export const selectUrgentTaskPage = (data: TaskQueryPageVo) =>
  defHttp.post<PageDto<TaskWaitPageDto>>({
    url: SysUrlPrefix.PROCESS + '/business-task/select/urgent-task/page',
    data,
  });

/**
 * @description: 分页查询转办任务
 */
export const selectTurnOverTaskPage = (data: TaskQueryPageVo) =>
  defHttp.post<PageDto<TaskWaitPageDto>>({
    url: SysUrlPrefix.PROCESS + '/business-task/select/turn-over-task/page',
    data,
  });

/**
 * @description: 分页查询审批已处理任务
 */
export const selectHistoryTaskPage = (data: TaskHistoryQueryPageVo) =>
  defHttp.post<PageDto<TaskHistoryPageDto>>({
    url: SysUrlPrefix.PROCESS + '/business-task/select/history-task/page',
    data,
  });

/**
 * @description: 分页查询抄送任务
 */
export const selectCopyTaskPage = (data: TaskHistoryQueryPageVo) =>
  defHttp.post<PageDto<TaskHistoryPageDto>>({
    url: SysUrlPrefix.PROCESS + '/business-task/select/copy-task/page',
    data,
  });

/**
 * @description: 审批
 */
export const completeTask = (data: CompleteTaskModel) =>
  defHttp.post<String>(
    {
      url: SysUrlPrefix.PROCESS + '/business-task/task/complete',
      data,
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 签收
 */
export const taskClaim = (taskId: string) =>
  defHttp.get<String>(
    {
      url: SysUrlPrefix.PROCESS + '/business-task/task/claim/{taskId}',
      params: { taskId },
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 获取可驳回节点
 */
export const selectEnableDismiss = (data: EnableDismissVo) =>
  defHttp.post<EnableDismissDto[]>({
    url: SysUrlPrefix.PROCESS + '/business-task/select/list/enable-dismiss',
    data,
  });

/**
 * @description: 驳回
 */
export const dismissTask = (data: DismissTaskModel) =>
  defHttp.post<String>(
    {
      url: SysUrlPrefix.PROCESS + '/business-task/task/dismiss',
      data,
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 查询待审批任务详情
 */
export const waitTaskDetail = (taskId: string) =>
  defHttp.get<WaitUserTaskDetailModel>({
    url: SysUrlPrefix.PROCESS + '/business-task/task/wait-detail/{taskId}',
    params: { taskId },
  });
