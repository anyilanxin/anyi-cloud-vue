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
import { BasePageVo } from '/@/api/model/baseModel';

export interface ProcessQueryPageVo extends BasePageVo {
  finishState: number;
  processState: number;
  businessKey: string;
  title: string;
  category: string;
  processFormEquals: Object;
  processFormLike: Object;
  processFormTime: Object;
}

export interface FormSubmitProcessModel {
  businessKey?: string;
  processDefinitionId?: string;
  processDefinitionKey?: string;
  requireCallback: boolean;
  callbackType?: string;
  callbackInfo?: Object;
  processVariables?: Object;
  startFormData?: Object;
}

export interface ProcessCallbackResultModel {
  startFormFields: Object[];
  startFormKey: string;
  processInstanceId: string;
  processDefinitionId: string;
  businessKey: string;
  multiInstanceTask: boolean;
  executionId: string;
  taskInfoList: TaskInfo[];
}

export interface TaskInfo {
  taskFormFields: Object[];
  taskFormKey: string;
  taskId: string;
  executionId: string;
  owner: string;
  assignee: string;
  name: string;
  taskDefinitionKey: string;
}

export interface MsgSubmitProcessModel {
  businessKey: string;
  messageName: string;
  processVariables?: Object;
  startFormData?: Object;
}

export interface CancelProcessVo {
  businessKey: string;
  processInstanceId: string;
}

export interface ProcessPageDto {
  durationInMillis: number;
  durationInMillisFormat: string;
  processEndTime: string;
  processStartTime: string;
  startTitle: string;
  processName: string;
  processCategory: string;
  processCategoryName: string;
  businessKey: string;
  processInstanceId: string;
  tenantId: string;
  finishState: number;
  processState: number;
  startFormData: Object;
  applyUserInfo: Object;
  currentActivityName: string;
  currentActivityType: string;
  currentAssignee: string;
  currentTaskId: string;
  currentStartTime: string;
  currentEndTime: string;
  currentDurationInMillis: number;
  currentDurationInMillisFormat: string;
  currentId: string;
}

export interface ProcessInstanceDetailDto {
  durationInMillis: number;
  durationInMillisFormat: string;
  processEndTime: string;
  processStartTime: string;
  startTitle: string;
  processCategory: string;
  processCategoryName: string;
  businessKey: string;
  processInstanceId: string;
  tenantId: string;
  finishState: number;
  processState: number;
  startFormData: Object;
  applyUserInfo: Object;
  currentActivityName: string;
  currentActivityType: string;
  currentAssignee: string;
  currentTaskId: string;
  currentStartTime: string;
  currentEndTime: string;
  currentDurationInMillis: number;
  currentDurationInMillisFormat: string;
  currentId: string;
}
export interface ProcessHandleUserModel {
  userId: string;
  userName: string;
  nickName: string;
  realName: string;
  avatar: string;
  birthday: string;
  shortProfile: string;
  sex: number;
  email: string;
  phone: string;
  currentOrgId: string;
  currentOrgName: string;
  currentOrgCode: string;
  currentTenantId: string;
}
export interface ProcessUserModel {
  userId: string;
  userName: string;
  nickName: string;
  realName: string;
  avatar: string;
  birthday: string;
  shortProfile: string;
  sex: number;
  email: string;
  phone: string;
  orgIds: string;
  workNo: string;
  telephone: string;
}
export interface TaskOptionInfoModel {
  comment: string;
  submitTime: string;
}
export interface AttachmentInfoModel {
  fileOriginalName: string;
  fileName: string;
  fileType: string;
  contentType: string;
  fileSize: string;
  fileSizeDetail: string;
  fileMd5: string;
  fileDiskRelativePath: string;
}
export interface ApprovalInfoModel {
  approvalStatus: number;
  approvalOpinions: TaskOptionInfoModel[];
  attachmentInfos: AttachmentInfoModel[];
}
export interface ProcessRoleModel {
  roleId: string;
  roleName: string;
  roleCode: string;
  roleSysCode: string;
  remark: string;
  parentRoleId: string;
}
export interface Button {
  name: string;
  code: string;
}
export interface UserTaskPropertyModel {
  taskSort: number;
  skipUserTask?: boolean;
  automaticCompleteUserTask?: boolean;
  automaticApprovalOpinions?: string;
  candidateGroups: string;
  candidateGroupNames: string;
  candidateGroupsType: number;
  candidateUsers: string;
  candidateUserNames: string;
  candidateUsersType: number;
  assignee: string;
  assigneeName: string;
  assigneeType: number;
  dueDate: string;
  dueFormatDate: string;
  dueDateType: number;
  followUpDate: string;
  followUpFormatDate: string;
  followUpDateType: number;
  notificationType: number[];
  buttons: Button[];
}
export interface ActInstanceDetailDto {
  id: string;
  activityId: string;
  activityName: string;
  activityType: string;
  activityInstanceId: string;
  activityInstanceState: number;
  parentActivityInstanceId: string;
  taskId: string;
  taskAssignee: string;
  taskAssigneeInfo: ProcessHandleUserModel;
  candidateUsers: ProcessUserModel[];
  candidateGroups: ProcessRoleModel[];
  durationInMillis: number;
  durationInMillisFormat: string;
  startTime: string;
  endTime: string;
  dueDate: string;
  followUpDate: string;
  dueDateStr: string;
  dueFormatDate: string;
  followUpDateStr: string;
  followUpFormatDate: string;
  sequenceCounter: number;
  taskTitle: string;
  handleType: string;
  handleTypeDescribe: string;
  propertyModel: UserTaskPropertyModel;
  formModel: Object;
  approvalStatus: number;
  optionInfos: ApprovalInfoModel;
  owner: string;
  ownerUserInfo: ProcessHandleUserModel;
}

export interface ActMultiInstanceDto {
  id: string;
  activityId: string;
  activityName: string;
  activityType: string;
  activityInstanceId: string;
  activityInstanceState: number;
  parentActivityInstanceId: string;
  durationInMillis: number;
  durationInMillisFormat: string;
  nrOfInstances: number;
  nrOfCompletedInstances: number;
  nrOfActiveInstances: number;
  loopCounter: number;
  nrOfApprovalInstances: number;
  nrOfNotApprovalInstances: number;
  startTime: string;
  endTime: string;
  sequenceCounter: number;
  instanceDetailList: ActInstanceDetailDto[];
}

export interface ActInstanceDto {
  activityName: string;
  activityId: string;
  activityType: string;
  currentActivityInstanceState: number;
  durationInMillis: number;
  durationInMillisFormat: string;
  startTime: string;
  endTime: string;
  multiInstance: boolean;
  multiInstanceList: ActMultiInstanceDto[];
  currentSequenceCounter: number;
  instanceDetailNum: number;
  currentDetail: ActInstanceDetailDto;
  instanceDetailList: ActInstanceDetailDto[];
}

export interface ActInstanceAndModelDto {
  diagramData: string;
  actInstanceMap: Map<string, ActInstanceDto>;
}

export interface InstanceApplyInfoDto {
  durationInMillis: number;
  durationInMillisFormat: string;
  processStartTime: string;
  processEndTime: string;
  startTitle: number;
  processCategory: string;
  processCategoryName: string;
  businessKey: string;
  processInstanceId: string;
  tenantId: string;
  finishState: number;
  processState: number;
  startFormData: Object;
  userInfo: Object;
  currentActivityName: string;
  currentActivityType: string;
  currentAssignee: string;
  currentTaskId: string;
  currentStartTime: string;
  currentEndTime: string;
  currentDurationInMillis: number;
  currentDurationInMillisFormat: string;
  currentId: string;
}

export interface ProcessUrgentVo {
  processInstanceId: string;
}

export interface ActInstanceInfoDto {
  diagramData: string;
  diagramName: string;
  processDefinitionKey: string;
  processDefinitionId: string;
  deploymentName: string;
  version: number;
  category: string;
  categoryName: string;
  actInstanceDetails: any[];
}

export interface ActInstanceModel {
  id: string;
  activityId: string;
  executionId: string;
  activityName: string;
  activityType: string;
  userTask: boolean;
  activityInstanceId: string;
  activityInstanceState: number;
  parentActivityInstanceId: string;
  taskId: string;
  taskAssignee: string;
  taskAssigneeInfo: ProcessUserModel;
  candidateUsers: ProcessUserModel[];
  candidateGroups: ProcessRoleModel[];
  durationInMillis: Number;
  durationInMillisFormat: string;
  startTime: string;
  endTime: number;
  dueDate: string;
  followUpDate: string;
  dueDateStr: string;
  dueFormatDate: string;
  followUpDateStr: string;
  followUpFormatDate: string;
  sequenceCounter: number;
  taskTitle: string;
  handleType: string;
  handleTypeDescribe: string;
  propertyInfo: Object;
  formModel: Object;
  approvalStatus: number;
  optionInfos: ApprovalInfoModel;
  owner: string;
  ownerUserInfo: ProcessUserModel;
}

export interface ActInstanceInfoModel {
  diagramData: string;
  diagramName: string;
  processDefinitionKey: string;
  processDefinitionId: string;
  processInstanceId: string;
  deploymentName: string;
  version: number;
  processState: number;
  finishState: number;
  suspended: boolean;
  startTitle: string;
  category: string;
  categoryName: string;
  actInstanceList: ActInstanceModel[];
  attachmentInfo: Object;
  startFormData: Object;
}

export interface InstanceUserTaskDto {
  id: string;
  taskId: string;
  assignee: string;
  assigneeUserInfo: ProcessUserModel;
  owner: string;
  ownerUserInfo: ProcessUserModel;
  handleType: string;
  handleTypeDescribe: string;
  taskTitle: string;
  propertyModel: UserTaskPropertyModel;
  candidateUsers: ProcessUserModel[];
  candidateGroups: ProcessRoleModel[];
  name: string;
  description: string;
  formModel: Object;
  dueDate: string;
  followUpDate: string;
  priority: number;
  parentTaskId: string;
  taskDefinitionKey: string;
  tenantId: string;
  durationInMillis: Number;
  durationInMillisFormat: string;
  startTime: string;
  endTime: string;
  dueDateStr: string;
  dueFormatDate: string;
  followUpDateStr: string;
  followUpFormatDate: string;
  activityInstanceId: string;
  activityId: string;
  activityInstanceState: number;
  parentActivityInstanceId: string;
  approvalStatus: string;
  optionInfos: ApprovalInfoModel;
  allCommentStr: string;
  sequenceCounter: number;
  multiInstance: boolean;
  multiInstanceTasks: InstanceUserTaskDto[];
}
