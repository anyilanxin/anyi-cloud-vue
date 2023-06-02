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
 *   7.进行商用时，不得基于AnYi Cloud Vue的基础，修改包装而成一个与AnYi Zeebe EE、AnYi Cloud EE、AnYi Cloud EE Vue功能类似的程序，进行销售或发布，参与同类软件产品市场的竞争；
 *   8.本软件使用的第三方依赖皆为开源软件，如需要修改第三方源码请遵循第三方源码附带开源协议；
 *   9.本软件中使用了bpmn js,使用请遵循bpmn.io开源协议：
 *     https://github.com/bpmn-io/bpmn-js/blob/develop/LICENSE
 *   10.若您的项目无法满足以上几点，可申请商业授权。
 */
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { selectOrgTreeList } from '/@/api/modules/system/rbac/rbacOrg';

export const columns: BasicColumn[] = [
  {
    title: '组织名称',
    dataIndex: 'orgName',
    fixed: 'left',
    align: 'left',
    width: 180,
  },
  {
    title: '组织编码',
    fixed: 'left',
    dataIndex: 'orgCode',
    align: 'left',
    width: 150,
  },
  {
    title: '类型',
    dataIndex: 'orgType',
    fixed: 'left',
    width: 70,
    customRender: ({ record }) => {
      const orgType = record.orgType;
      const enable = orgType === 1;
      const color = enable ? 'blue' : 'green';
      const text = enable ? '公司' : '部门';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '英文名',
    dataIndex: 'orgNameEn',
    width: 180,
  },
  {
    title: '缩写',
    dataIndex: 'orgNameAbbr',
    width: 100,
  },
  {
    title: '排序',
    dataIndex: 'orgOrder',
    width: 80,
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    width: 140,
  },
  {
    title: '传真',
    dataIndex: 'fax',
    width: 140,
  },
  {
    title: '地址',
    dataIndex: 'address',
    width: 200,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true,
    defaultSortOrder: 'descend',
    width: 160,
  },
  {
    title: '备注',
    width: 180,
    dataIndex: 'remark',
  },
  {
    title: '状态',
    fixed: 'right',
    sorter: true,
    dataIndex: 'orgStatus',
    width: 90,
    slots: { customRender: 'orgStatus' },
  },
];

const getOrgTree = () => {
  return selectOrgTreeList(0);
};
export const searchFormSchema: FormSchema[] = [
  {
    field: 'orgName',
    label: '组织名称',
    colProps: { span: 6 },
    component: 'Input',
  },
  {
    field: 'orgCode',
    label: '组织编码',
    colProps: { span: 6 },
    component: 'Input',
  },
  {
    field: 'orgStatus',
    label: '状态',
    colProps: { span: 6 },
    component: 'Select',
    componentProps: {
      options: [
        { label: '停用', value: 0 },
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

export const formSchema: FormSchema[] = [
  {
    field: 'orgType',
    label: '组织类型',
    component: 'RadioButtonGroup',
    defaultValue: 1,
    required: true,
    componentProps: {
      options: [
        { label: '公司', value: 1 },
        { label: '部门', value: 2 },
      ],
    },
  },
  {
    field: 'parentId',
    label: '上级组织',
    component: 'ApiTreeSelect',
    componentProps: {
      fieldNames: {
        label: 'orgName',
        value: 'orgId',
      },
      api: getOrgTree,
    },
    dynamicRules: ({ values }) => {
      return values.orgType === 2 ? [{ required: true, message: '上级组织必填' }] : [];
    },
  },
  {
    field: 'orgName',
    label: '组织名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'orgStatus',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    componentProps: {
      options: [
        { label: '停用', value: 0 },
        { label: '启用', value: 1 },
      ],
    },
    required: true,
  },
  {
    field: 'orgSimpleName',
    label: '机构简称',
    component: 'Input',
  },
  {
    field: 'orgNameEn',
    label: '英文名',
    component: 'Input',
  },
  {
    field: 'orgNameAbbr',
    label: '缩写',
    component: 'Input',
  },
  {
    field: 'orgCode',
    label: '组织编码',
    component: 'Input',
    required: true,
  },
  {
    field: 'phone',
    label: '手机号',
    component: 'Input',
  },
  {
    field: 'fax',
    label: '传真',
    component: 'Input',
  },
  {
    field: 'orderNo',
    label: '排序',
    defaultValue: 0,
    component: 'InputNumber',
  },
  {
    field: 'address',
    label: '地址',
    component: 'InputTextArea',
    dynamicRules: ({ values }) => {
      return values.orgType === 1 ? [{ required: true, message: '组织地址必填' }] : [];
    },
  },
  {
    field: 'socialCode',
    label: '社会信用代码',
    component: 'Input',
    required: true,
    ifShow: ({ values }) => values.orgType == 1,
  },
  {
    field: 'areaCode',
    component: 'TreeSelect',
    label: '所属区域',
    required: true,
    slot: 'areaCode',
    ifShow: ({ values }) => values.orgType == 1,
  },
  {
    field: 'scopeBusiness',
    label: '经验范围',
    component: 'InputTextArea',
    ifShow: ({ values }) => values.orgType == 1,
  },
  {
    field: 'legalPerson',
    label: '法人',
    required: true,
    component: 'Input',
    ifShow: ({ values }) => values.orgType == 1,
  },
  {
    field: 'accountsName',
    label: '开户姓名',
    component: 'Input',
    ifShow: ({ values }) => values.orgType == 1,
  },
  {
    field: 'accountsBank',
    label: '开户银行',
    component: 'Input',
    ifShow: ({ values }) => values.orgType == 1,
  },
  {
    field: 'backCard',
    label: '银行账号',
    component: 'Input',
    ifShow: ({ values }) => values.orgType == 1,
  },
  {
    field: 'businessLicensePicture',
    label: '营业执照',
    component: 'Input',
    required: true,
    ifShow: ({ values }) => values.orgType == 1,
  },
  {
    field: 'sealPicture',
    label: '印章',
    component: 'Input',
    ifShow: ({ values }) => values.orgType == 1,
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];
