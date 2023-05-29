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
import { ActInstanceInfoModel } from './processBusinessModel';
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

export interface QueryTimeVo {
  startTime: string;
  endTime: string;
}
export interface TaskQueryPageVo extends BasePageVo {
  processTitle: string;
  applyUserName: string;
  taskName: string;
  description: string;
  businessKey: string;
  applyUserOrgId: string;
  category: string;
  processFormEquals: Object;
  processFormLike: Object;
  processFormTime: Map<string, QueryTimeVo>;
  taskFormEquals: Object;
  taskFormLike: Object;
  taskFormTime: Map<string, QueryTimeVo>;
}

export interface TaskWaitPageDto {
  dueTime: string;
  followUpTime: string;
  processTitle: string;
  parentTaskId: string;
  processName: string;
  processCategory: string;
  processCategoryName: string;
  applyUserName: string;
  applyUserInfo: ProcessHandleUserModel;
  applyTime: string;
  createTime: string;
  taskName: string;
  priority: number;
  description: string;
  taskId: string;
  businessKey: string;
  processInstanceId: string;
  processDefinitionId: string;
  taskDefinitionKey: string;
  claim: boolean;
  delegationStates: number;
  suspensionState: number;
  enableUnClaim: boolean;
  taskTitle: string;
}

export interface ProcessSubmitResultModel {
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

export interface TaskHistoryPageDto {
  dueDate: string;
  followUpDate: string;
  processTitle: string;
  parentTaskId: string;
  processName: string;
  applyUserName: string;
  applyTime: string;
  applyUserInfo: ProcessHandleUserModel;
  processCategory: string;
  processCategoryName: string;
  durationInMillis: number;
  durationInMillisFormat: string;
  startTime: string;
  endTime: string;
  category: string;
  categoryName: string;
  taskName: string;
  priority: number;
  description: string;
  taskId: string;
  businessKey: string;
  processInstanceId: string;
  processDefinitionId: string;
  taskDefinitionKey: string;
  taskTitle: string;
  approvalStatus: number;
  allCommentStr: string;
  optionInfos: ApprovalInfoModel;
}

export interface SubmitFormModel {
  value: Object;
  time: string;
  timeFormat: string;
}
export interface SubmitParentTaskModel {
  taskId: string;
  taskFormData?: Object;
  taskVariables?: Object;
  processFormData?: Map<String, SubmitFormModel>;
  processVariables?: Object;
}
export interface TaskHistoryQueryPageVo extends BasePageVo {
  processTitle: string;
  applyUserName: string;
  taskName: string;
  description: string;
  businessKey: string;
  applyUserOrgId: string;
  category: string;
  processFormEquals: Object;
  processFormLike: Object;
  processFormTime: Map<string, QueryTimeVo>;
  taskFormEquals: Object;
}

export interface SubmitApprovalModel {
  approvalStatus: number;
  approvalOpinion: string;
  attachmentInfos: any[];
}

export interface CompleteTaskModel {
  approvalModel: SubmitApprovalModel;
  taskId: string;
}

export interface EnableDismissVo {
  processInstanceId: string;
  taskId: string;
}

export interface EnableDismissDto {
  activityName: string;
  description: string;
  activityId: string;
  disabled: boolean;
  sequenceCounter: number;
  activityType: string;
}

export interface DismissTaskModel extends SubmitParentTaskModel {
  taskDefinitionKey: string;
  approvalOpinion: string;
  originalApprover: boolean;
}

export interface UserTaskPropertyInfoModel {
  assignee: string;
  skillFullAssignee: string;
  skillFullAssigneeExtendId: string;
  skillFullApplicant: boolean;
  skillfullApplicantAutoSkip: boolean;
  skillFullAssigneeType: number;
  candidateGroups: string;
  skillFullCandidateGroups: string;
  skillFullCandidateGroupsExtendId: string;
  skillFullCandidateGroupsType: number;
  skillFullCandidateOrg: string;
  skillFullCandidateOrgName: string;
  skillFullCandidateOrgType: number;
  skillFullCandidateArea: string;
  skillFullCandidateAreaName: string;
  skillFullCandidateAreaType: number;
  skillFullCandidateButtonsExtendId: string;
  skillFullCandidateButtonsName: string;
  candidateUsers: string;
  skillFullCandidateUsers: string;
  skillFullCandidateUsersExtendId: string;
  skillFullCandidateUsersType: number;
  skillfullUserTaskButtons: string[];
}

export interface WaitUserTaskDetailModel {
  eventName: string;
  formKey: string;
  mustClaim: boolean;
  formJsonInfo: string;
  dueTime: string;
  followUpTime: string;
  taskId: string;
  name: string;
  taskTitle: string;
  description: string;
  createTime: string;
  propertyInfo: UserTaskPropertyInfoModel;
  instanceInfoModel: ActInstanceInfoModel;
}
