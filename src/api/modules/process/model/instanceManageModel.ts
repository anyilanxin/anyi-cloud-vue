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
import { BasePageVo } from '/@/api/model/baseModel';
export const InstanceState = {
  1: '活动',
  2: '挂起',
  3: '完成',
  4: '外部终止',
  5: '内部终止',
};
export interface ProcessInstanceHistoryPageVo extends BasePageVo {
  processDefinitionId: string;
  state: number;
  finished: boolean;
  realName: string;
  processDefinitionName: string;
}
export interface RbacUserDto {
  userId: string;
  userName: string;
  nickName: string;
  realName: string;
  avatar: string;
  birthday: string;
  sex: number;
  email: string;
  phone: string;
  orgIds: string;
  userStatus: number;
  workNo: string;
  telephone: string;
  currentLoginTime: string;
  remark: string;
  createTime: string;
}
export interface InstanceHistoryPageDto {
  deleteReason: string;
  instanceState: number;
  version: number;
  startUserInfo: RbacUserDto;
  processInstanceId: string;
  processDefinitionId: number;
  businessKey: number;
  startActivityId: string;
  endActivityId: string;
  currentTaskId: string;
  currentTaskName: string;
  currentAssigneeUserId: string;
  currentAssigneeName: string;
  currentOwnerUserId: number;
  currentOwnerUserName: number;
  processDefinitionName: string;
  instanceStartTime: string;
  instanceRemovalTime: string;
  isFinish: boolean;
  durationInMillis: number;
  durationInMillisFormat: string;
  instanceEndTime: string;
}
export interface RbacRoleDto {
  roleId: string;
  roleName: string;
  roleCode: string;
  roleStatus: number;
  enableDelete: number;
  autoBind: number;
  roleSysCode: string;
  remark: string;
  createUserName: string;
  parentRoleId: string;
  createTime: string;
}
export interface TasksHistoryDetailDto {
  activityId: string;
  activityName: number;
  activityType: number;
  approvalOpinions: RbacUserDto;
  activityInstanceId: string;
  activityInstanceState: number;
  taskId: string;
  taskStartTime: string;
  taskEndTime: string;
  durationInMillis: number;
  durationInMillisFormat: string;
  durationStr: string;
  userInfos: RbacUserDto[];
  groupInfos: RbacRoleDto[];
  taskAssigneeInfo: RbacUserDto;
  sequenceCounter: number;
  taskRemovalTime: string;
}

export interface HistoricVariableDto {
  variableState: number;
  createTime: string;
  removalTime: string;
  name: string;
  value: string;
  id: string;
}
export interface InstanceDetailDto {
  versionTag: string;
  processInstanceId: string;
  diagramData: string;
  isFinish: Boolean;
  instanceState: number;
  deploymentName: string;
  processDefinitionId: string;
  businessKey: string;
  startUserInfo: RbacUserDto;
  deleteReason: string;
  startActivityId: string;
  endActivityId: string;
  durationInMillis: number;
  durationInMillisFormat: string;
  durationStr: string;
  instanceStartTime: string;
  instanceRemovalTime: string;
  instanceEndTime: string;
  instanceStatus: boolean;
  historyTaskInfos: TasksHistoryDetailDto[];
  historyTaskCommentInfos: TasksHistoryDetailDto[];
  historyVariableInfos: HistoricVariableDto[];
}
export interface DesignModelVo {
  diagramNames: string;
  processId: string;
  remark: string;
}

export interface DesignModelDto {
  modelId: string;
  processId: string;
  diagramData: string;
  diagramNames: string;
  modelState: string;
  remark: number;
  createUserId: number;
  createUserName: string;
  createTime: string;
}

export interface DesignModelBpmnDataVo {
  modelId: string;
  diagramData: string;
}

export interface InstanceStatiDto {
  total: number;
  finish: number;
  unFinish: number;
}
