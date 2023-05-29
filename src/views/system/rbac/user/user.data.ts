/*
 * Copyright (c) 2021-2023 ZHOUXUANHONG(安一老厨)<anyilanxin@aliyun.com>
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
 *   7.进行商用时，不得基于AnYi Cloud Vue 的基础，修改包装而成一个与AnYi Zeebe EE、AnYi Cloud EE功能类似的程序，进行销售或发布，参与同类软件产品市场的竞争；
 *   8.本软件使用的第三方依赖皆为开源软件，如需要修改第三方源码请遵循第三方源码附带开源协议；
 *   9.本软件流程部分请遵循camunda开源协议：
 *     https://docs.camunda.org/manual/latest/introduction/third-party-libraries
 *     https://github.com/camunda/camunda-bpm-platform/blob/master/LICENSE
 *   10.若您的项目无法满足以上几点，可申请商业授权。
 */
import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { upload } from '/@/api/modules/storage/storageInfoFile';
// import { selectOrgTreeList } from '/@/api/modules/system/rbac/rbacOrg';
import { DescItem } from '/@/components/Description/index';
import { unref, h } from 'vue';
import { Avatar } from 'ant-design-vue';
import { getAttachmentUrl } from '/@/utils';
import dayjs, { Dayjs } from 'dayjs';
const sex = ['未知', '女', '男'];
export const columns: BasicColumn[] = [
  {
    title: '用户名',
    dataIndex: 'userName',
    fixed: 'left',
    width: 120,
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    fixed: 'left',
    width: 70,
    slots: { customRender: 'avatar' },
  },
  {
    title: '用户昵称',
    dataIndex: 'nickName',
    width: 150,
  },
  {
    title: '真实姓名',
    dataIndex: 'realName',
    width: 150,
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 80,
    customRender: ({ record }) => {
      return sex[record.sex] || '';
    },
  },
  {
    title: '电话号码',
    dataIndex: 'phone',
    width: 150,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 120,
  },
  {
    title: '最近登录时间',
    sorter: true,
    dataIndex: 'currentLoginTime',
    width: 150,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true,
    defaultSortOrder: 'descend',
    width: 170,
  },
  {
    title: '状态',
    dataIndex: 'userStatus',
    sorter: true,
    fixed: 'right',
    slots: { customRender: 'userStatus' },
    width: 90,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'keyword',
    label: '关键信息',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'userStatus',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '正常', value: 1 },
        { label: '冻结', value: 2 },
        { label: '未激活', value: 0 },
      ],
    },
    colProps: { span: 8 },
  },
  {
    field: 'startTime',
    label: '开始时间',
    colProps: { span: 8 },
    component: 'DatePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD HH:mm',
      format: 'YYYY-MM-DD HH:mm',
    },
  },
  {
    field: 'endTime',
    label: '结束时间',
    colProps: { span: 8 },
    component: 'DatePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD HH:mm',
      format: 'YYYY-MM-DD HH:mm',
    },
  },
];
export const associateColumns: BasicColumn[] = [
  {
    title: '用户名',
    dataIndex: 'userName',
    fixed: 'left',
    width: 120,
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    fixed: 'left',
    width: 70,
    slots: { customRender: 'avatar' },
  },
  {
    title: '真实姓名',
    dataIndex: 'realName',
    width: 150,
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 80,
    customRender: ({ record }) => {
      return sex[record.sex] || '';
    },
  },
  {
    title: '电话号码',
    dataIndex: 'phone',
    width: 150,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true,
    defaultSortOrder: 'descend',
    width: 170,
  },
  {
    title: '状态',
    dataIndex: 'userStatus',
    sorter: true,
    fixed: 'right',
    slots: { customRender: 'userStatus' },
    width: 80,
  },
];
export const associateSearchFormSchema: FormSchema[] = [
  {
    field: 'keyword',
    label: '关键信息',
    component: 'Input',
    colProps: { span: 6 },
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
const disabledDate = (current: Dayjs) => {
  return current && current >= dayjs().endOf('day');
};
export const accountFormSchema: FormSchema[] = [
  {
    field: 'userName',
    label: '用户名',
    component: 'Input',
    required: true,
  },
  {
    field: 'nickName',
    label: '昵称',
    component: 'Input',
    required: true,
  },
  {
    label: '真实姓名',
    field: 'realName',
    component: 'Input',
    required: true,
  },
  {
    label: '工号',
    field: 'workNo',
    component: 'Input',
  },
  // {
  //   field: 'orgId',
  //   label: '所属组织',
  //   component: 'ApiTreeSelect',
  //   componentProps: {
  //     fieldNames: {
  //       title: 'orgName',
  //       key: 'orgId',
  //       value: 'orgId',
  //     },
  //     api: selectOrgTreeList,
  //   },
  // },
  {
    field: 'userStatus',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    required: true,
    componentProps: {
      options: [
        { label: '未激活', value: 0 },
        { label: '正常', value: 1 },
        { label: '冻结', value: 2 },
      ],
    },
  },
  {
    field: 'avatar',
    label: '头像',
    component: 'SkillfullCropperAvatar',
    componentProps: {
      circled: true,
      showBtn: false,
      width: '33px',
      uploadApi: upload,
    },
  },
  {
    field: 'password',
    label: '密码',
    component: 'InputPassword',
    componentProps: {
      autocomplete: 'new-password',
    },
    required: true,
  },
  {
    label: '生日',
    field: 'birthday',
    component: 'DatePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      disabledDate: disabledDate,
      showToday: false,
    },
  },
  {
    label: '性别',
    field: 'sex',
    component: 'SkillfullDictSelect',
    componentProps: {
      dictCode: 'sex',
    },
  },
  {
    label: '邮箱',
    field: 'email',
    component: 'Input',
  },
  {
    label: '电话号码',
    field: 'phone',
    component: 'Input',
  },

  {
    label: '座机号',
    field: 'telephone',
    component: 'Input',
  },
  // {
  //   label: '职位',
  //   field: 'positionIds',
  //   component: 'ApiSelect',
  //   componentProps: {
  //     mode: 'multiple',
  //     resultField: 'positionId',
  //     labelField: 'positionName',
  //     valueField: 'positionId',
  //     api: getAllList,
  //   },
  // },
  // {
  //   label: '角色',
  //   field: 'roleIds',
  //   component: 'ApiSelect',
  //   componentProps: {
  //     mode: 'multiple',
  //     resultField: 'roleId',
  //     labelField: 'roleName',
  //     valueField: 'roleId',
  //     api: getEffectiveRoles,
  //   },
  // },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];

const status = {
  0: '未激活',
  1: '正常',
  2: '冻结',
};
function getPictureUrl(url: string) {
  return getAttachmentUrl(url);
}
const commonAvatarRender = (curVal, _data) => {
  return h(Avatar, {
    size: 33,
    src: getPictureUrl(curVal),
  });
};
const commonPositionRender = (curVal, _data) => {
  const posigions: string[] = [];
  if (curVal) {
    unref(curVal).forEach((item) => {
      posigions.push(item.positionName);
    });
  }
  return posigions.toString();
};
export const schemaDetail: DescItem[] = [
  {
    field: 'userName',
    label: '用户名',
  },
  {
    field: 'realName',
    label: '真实姓名',
  },
  {
    field: 'phone',
    label: '电话号码',
  },
  {
    field: 'workNo',
    label: '工号',
  },
  {
    field: 'avatar',
    label: '头像',
    render: commonAvatarRender,
  },
  {
    field: 'userStatus',
    label: '状态',
    render: (curVal, _data) => {
      return status[curVal];
    },
  },
  {
    field: 'positionInfos',
    label: '职位',
    render: commonPositionRender,
  },
  {
    label: '备注',
    field: 'remark',
  },
];
