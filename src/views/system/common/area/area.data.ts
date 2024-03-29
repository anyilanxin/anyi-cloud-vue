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
import { selectOrgTreeList } from '/@/api/modules/system/rbac/rbacOrg';

export const columns: BasicColumn[] = [
  {
    title: '区域名称',
    dataIndex: 'areaName',
    fixed: 'left',
    align: 'left',
    width: 200,
  },
  {
    title: '简拼',
    dataIndex: 'simplePy',
    fixed: 'left',
    width: 100,
  },
  {
    title: '区域编码',
    fixed: 'left',
    dataIndex: 'areaId',
    width: 130,
  },
  {
    title: '级别',
    dataIndex: 'areaLevel',
    fixed: 'left',
    width: 60,
  },
  {
    title: '区号',
    dataIndex: 'areaCode',
    width: 120,
  },
  {
    title: '所属城市编码',
    dataIndex: 'cityId',
    width: 150,
  },
  {
    title: '邮编',
    dataIndex: 'zipCode',
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true,
    defaultSortOrder: 'descend',
    width: 170,
  },
  {
    title: '备注',
    width: 130,
    dataIndex: 'remark',
  },
];

const getOrgTree = () => {
  return selectOrgTreeList(0);
};
export const searchFormSchema: FormSchema[] = [
  {
    field: 'areaName',
    label: '区域名称',
    colProps: { span: 6 },
    component: 'Input',
  },
  {
    field: 'areaId',
    label: '区域编码',
    colProps: { span: 6 },
    component: 'Input',
  },
  {
    field: 'zipCode',
    label: '邮编',
    colProps: { span: 6 },
    component: 'Input',
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'orgName',
    label: '组织名称',
    component: 'Input',
    required: true,
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
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];
