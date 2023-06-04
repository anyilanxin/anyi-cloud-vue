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
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';
export const columns: BasicColumn[] = [
  {
    title: '模型名称',
    dataIndex: 'diagramNames',
    customRender: ({ record }) => {
      return record.diagramNames || '---';
    },
    fixed: 'left',
    width: 200,
  },
  {
    title: '类别',
    dataIndex: 'categoryName',
    width: 150,
  },
  {
    title: '是否池',
    dataIndex: 'havePool',
    customRender: ({ record }) => {
      return record.havePool && record.havePool == 1 ? '是' : '否';
    },
    width: 90,
  },
  {
    title: '部署时间',
    dataIndex: 'deploymentTime',
    width: 200,
  },
  {
    title: '流程定义key',
    dataIndex: 'processDefinitionKeys',
    ellipsis: true,
    slots: { customRender: 'processDefinitionKeys' },
    width: 200,
  },
  {
    title: '版本',
    dataIndex: 'version',
    width: 100,
  },
  {
    title: '创建人',
    dataIndex: 'createUserName',
    width: 180,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true,
    defaultSortOrder: 'descend',
    width: 200,
  },
  {
    title: '更新人',
    dataIndex: 'updateUserName',
    width: 180,
  },
  {
    title: '更新时间',
    sorter: true,
    dataIndex: 'updateTime',
    width: 200,
  },
  {
    title: '模型状态',
    dataIndex: 'modelState',
    fixed: 'right',
    width: 150,
    slots: { customRender: 'modelState' },
  },
];

export const historyDeploymentColumns: BasicColumn[] = [
  {
    title: '模型名称',
    dataIndex: 'diagramNames',
    width: 200,
  },
  {
    title: '部署名称',
    dataIndex: 'deploymentName',
    fixed: 'left',
    width: 200,
  },
  {
    title: '状态',
    dataIndex: 'suspensionState',
    fixed: 'left',
    width: 120,
    slots: { customRender: 'suspensionState' },
  },
  {
    title: '流程定义key',
    ellipsis: true,
    slots: { customRender: 'processDefinitionKeys' },
    dataIndex: 'processDefinitionKeys',
    width: 200,
  },
  {
    title: '版本',
    dataIndex: 'version',
    width: 70,
  },
  {
    title: '流程定义id',
    ellipsis: true,
    dataIndex: 'processDefinitionIds',
    slots: { customRender: 'processDefinitionIds' },
    width: 300,
  },
  {
    title: '是否池',
    dataIndex: 'havePool',
    customRender: ({ record }) => {
      return record.havePool && record.havePool == 1 ? '是' : '否';
    },
    width: 90,
  },
  {
    title: '有任务',
    dataIndex: 'haveRunTask',
    width: 110,
    slots: { customRender: 'haveRunTask' },
  },
  {
    title: '任务(完成/总数)',
    dataIndex: 'instanceTaskInfo',
    width: 140,
    customRender: ({ record }) => {
      return (
        record.completed +
        '/' +
        (record.active +
          record.suspended +
          record.completed +
          record.externallyTerminated +
          record.internallyTerminated)
      );
    },
  },
  {
    title: '部署时间',
    dataIndex: 'deploymentTime',
    sorter: true,
    defaultSortOrder: 'descend',
    width: 160,
  },
];

export const searchHistoryDeploymentFormSchema: FormSchema[] = [
  {
    field: 'resourceName',
    label: '资源名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'suspensionState',
    label: '部署状态',
    colProps: { span: 6 },
    component: 'Select',
    componentProps: {
      options: [
        { label: '暂停', value: 0 },
        { label: '激活', value: 1 },
      ],
    },
  },
  {
    field: 'startTime',
    label: '开始时间',
    colProps: { span: 6 },
    component: 'DatePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD HH:mm',
      format: 'YYYY-MM-DD HH:mm',
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'diagramNames',
    label: '模型名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'category',
    label: '类型',
    slot: 'category',
    component: 'Select',
    colProps: { span: 6 },
  },
  {
    field: 'modelState',
    label: '模型状态',
    colProps: { span: 6 },
    component: 'Select',
    componentProps: {
      options: [
        { label: '未部署', value: 0 },
        { label: '已经部署', value: 1 },
        { label: '新版本待部署', value: 2 },
      ],
    },
  },
  {
    field: 'startTime',
    label: '开始时间',
    colProps: { span: 6 },
    component: 'DatePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD HH:mm',
      format: 'YYYY-MM-DD HH:mm',
    },
  },
  {
    field: 'endTime',
    label: '结束时间',
    colProps: { span: 6 },
    component: 'DatePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD HH:mm',
      format: 'YYYY-MM-DD HH:mm',
    },
  },
];
export const formDeployment: FormSchema[] = [
  {
    field: 'deploymentName',
    label: '部署名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'activateProcessDate',
    label: '激活时间',
    component: 'DatePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      format: 'YYYY-MM-DD HH:mm:ss',
      showTime: { defaultValue: dayjs('00:00:00', 'HH:mm:ss') },
    },
  },
];
export const deleteformSchema: FormSchema[] = [
  {
    field: 'skipIoMappings',
    label: '跳过io映射',
    required: true,
    component: 'RadioButtonGroup',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '跳过', value: true },
        { label: '不跳过', value: false },
      ],
    },
  },
  {
    field: 'cascade',
    label: '级联',
    required: true,
    component: 'RadioButtonGroup',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '级联', value: true },
        { label: '不级联', value: false },
      ],
    },
  },
  {
    field: 'skipCustomListeners',
    label: '跳过监听器',
    required: true,
    component: 'RadioButtonGroup',
    defaultValue: false,
    componentProps: {
      options: [
        { label: '跳过', value: true },
        { label: '不跳过', value: false },
      ],
    },
    colProps: { lg: 24, md: 24 },
  },
];
