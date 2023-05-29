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
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { upload } from '/@/api/modules/storage/storageInfoFile';
export const columns: BasicColumn[] = [
  {
    title: '类别名称',
    dataIndex: 'categoryName',
    width: 180,
  },
  {
    title: '类别编码',
    dataIndex: 'categoryCode',
    width: 180,
  },
  {
    title: '类别图片',
    dataIndex: 'pictures',
    slots: { customRender: 'pictures' },
    width: 100,
  },
  {
    title: '类别状态',
    dataIndex: 'categoryState',
    slots: { customRender: 'categoryState' },
    width: 100,
  },
  {
    title: '描述',
    dataIndex: 'categoryDescribe',
    width: 200,
  },
  {
    title: '创建人',
    dataIndex: 'createUserName',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true,
    defaultSortOrder: 'descend',
    width: 150,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'categoryName',
    label: '类别名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'categoryState',
    label: '类别状态',
    colProps: { span: 6 },
    component: 'Select',
    componentProps: {
      options: [
        { label: '禁用', value: 0 },
        { label: '启用', value: 1 },
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
export const categoryFormSchema: FormSchema[] = [
  {
    field: 'categoryName',
    label: '类别名称',
    required: true,
    component: 'Input',
  },
  {
    field: 'categoryCode',
    label: '类别编码',
    component: 'Input',
    helpMessage: '唯一编码',
    required: true,
  },
  {
    field: 'categoryState',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    required: true,
    componentProps: {
      options: [
        { label: '停用', value: 0 },
        { label: '启用', value: 1 },
      ],
    },
  },
  {
    field: 'pictures',
    label: '类别图标',
    component: 'SkillfullCropperAvatar',
    componentProps: {
      circled: false,
      showBtn: false,
      width: '32px',
      uploadApi: upload,
    },
  },
  {
    label: '类别描述',
    field: 'categoryDescribe',
    component: 'InputTextArea',
    colProps: { lg: 24, md: 24 },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { lg: 24, md: 24 },
  },
];
