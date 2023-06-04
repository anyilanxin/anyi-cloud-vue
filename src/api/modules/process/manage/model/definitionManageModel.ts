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
 *   7.进行商用时，不得基于AnYi Cloud Vue的基础，修改包装而成一个与AnYi Cloud EE、AnYi Zeebe EE、AnYi Standalone EE功能类似的程序，进行销售或发布，参与同类软件产品市场的竞争；
 *   8.本软件使用的第三方依赖皆为开源软件，如需要修改第三方源码请遵循第三方源码附带开源协议；
 *   9.本软件中使用了bpmn js,使用请遵循bpmn.io开源协议：
 *     https://github.com/bpmn-io/bpmn-js/blob/develop/LICENSE
 *   10.若您的项目无法满足以上几点，可申请商业授权。
 */
import { BasePageVo } from '/@/api/model/baseModel';

export interface DeploymentVo {
  deploymentName: string;
  modelId: string;
  activateProcessDate: string;
}

export interface DeploymentHistoryVo {
  deploymentName: string;
  historyModelId: string;
  activateProcessDate?: string;
  deploymentId: string;
}

export interface ProcessDefinitionPageVo extends BasePageVo {
  processId: string;
  resourceName: string;
}

export interface ProcessDefinitionPageDto {
  processId: string;
  version: string;
  deploymentId: string;
  resourceName: string;
  hasStartFormKey: boolean;
  processDefinitionId: string;
  isStartableInTasklist: boolean;
  deploymentTime: string;
  deploymentName: string;
  suspensionState: string;
  instanceNum: number;
  instanceCompleteNum: number;
}

export interface FormData {
  formKey: string;
  formFields: any[];
}

export interface DeploymentDetailDto {
  deploymentId: string;
  modelId: string;
  diagramNames: string;
  processId: string;
  processDefinitionId: string;
  suspensionState: number;
  deploymentName: string;
  isNew: boolean;
  version: number;
  versionTag: string;
  resourceName: string;
  diagramData: string;
  tenantId: string;
  previousProcessDefinitionId: string;
  hasStartFormKey: boolean;
  haveInitiator: boolean;
  initiatorValue: string;
  startFormData: string;
  diagramResourceName: string;
  category: string;
  revision: number;
}

export interface UpdateProcessDefinitionStateVo {
  processDefinitionId: string;
  processInstances: boolean;
  state: boolean;
}

export interface ProcessInfoVo {
  processDefinitionId?: string;
  processDefinitionKey?: string;
}

export interface ProcessTaskInfoDto {
  taskDefinitionKey: string;
  name: string;
  description: string;
  assignee: string;
  propertyModel: Object;
  formModel: Object;
  formKey: string;
  formRef: string;
  dueDateStr: string;
  dueFormatDate: string;
  followUpDateStr: string;
  followUpFormatDate: string;
  priority: number;
  multiInstance: boolean;
  sequential: boolean;
}

export interface ProcessInfoDto {
  processDefinitionKey: string;
  versionTag: string;
  version: number;
  category: string;
  categoryName: string;
  deploymentId: string;
  resourceNames: string;
  diagramData: string;
  name: string;
  hasStartFormKey: Boolean;
  processDefinitionId: string;
  isStartableInTasklist: boolean;
  deploymentTime: string;
  deploymentName: string;
  userTasks: ProcessTaskInfoDto[];
}
