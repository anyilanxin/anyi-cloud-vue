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
import { getValidServiceInfo } from '/@/api/modules/system/manage/manageService';

export const columns: BasicColumn[] = [
  {
    title: '客户端id',
    dataIndex: 'clientId',
    fixed: 'left',
    width: 150,
  },
  {
    title: '客户端名称',
    dataIndex: 'clientName',
    fixed: 'left',
    width: 150,
  },
  {
    title: '客户端图标',
    dataIndex: 'clientIco',
    width: 120,
    slots: { customRender: 'clientIco' },
  },
  {
    title: '是否验签',
    dataIndex: 'signatureRequired',
    width: 100,
    customRender: ({ record }) => {
      return record.signatureRequired == 0 ? '不验签' : '验签';
    },
  },
  {
    title: '单设备登录',
    dataIndex: 'singleLogin',
    width: 120,
    customRender: ({ record }) => {
      return record.singleLogin == 0 ? '不是' : '是';
    },
  },
  {
    title: '内部系统',
    dataIndex: 'innerSystem',
    width: 120,
    customRender: ({ record }) => {
      return record.innerSystem == 0 ? '不是' : '是';
    },
  },
  {
    title: '限制授权错误次数',
    dataIndex: 'limitError',
    width: 150,
    customRender: ({ record }) => {
      return record.limitError == 0 ? '不限制' : '限制';
    },
  },
  {
    title: 'token的有效时长(s)',
    dataIndex: 'accessTokenValiditySeconds',
    width: 160,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 200,
  },
  {
    title: '上次授权时间',
    dataIndex: 'lastAuthTime',
    width: 180,
  },
  {
    title: '创建用户姓名',
    dataIndex: 'createUserName',
    width: 150,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
  },
  {
    title: '状态',
    dataIndex: 'clientStatus',
    slots: { customRender: 'clientStatus' },
    fixed: 'right',
    width: 90,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'clientId',
    label: '客户端id',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'clientName',
    label: '客户端名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'clientStatus',
    label: '状态',
    component: 'Select',
    colProps: { span: 6 },
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

export function createClientFormSchema(update) {
  const clientFormSchema: FormSchema[] = [
    {
      field: 'clientId',
      label: '客户端id',
      component: 'Input',
      required: true,
    },
    {
      field: 'clientName',
      label: '客户端名称',
      component: 'Input',
      required: true,
    },
    {
      label: '资源图标',
      field: 'clientIco',
      componentProps: {
        circled: false,
        showBtn: false,
        width: '40px',
        uploadApi: upload,
      },
      component: 'SkillfullCropperAvatar',
    },
    {
      field: 'clientSecurity',
      label: '客户端密码',
      component: 'InputPassword',
      required: true,
      ifShow: () => !update.value,
    },
    {
      field: 'limitResource',
      label: '限制授权资源',
      defaultValue: 1,
      component: 'RadioButtonGroup',
      required: true,
      componentProps: {
        options: [
          { label: '不限制', value: 0 },
          { label: '限制', value: 1 },
        ],
      },
    },
    {
      label: '授权服务',
      required: true,
      field: 'resourceIds',
      component: 'ApiSelect',
      componentProps: {
        mode: 'multiple',
        resultField: 'serviceCode',
        labelField: 'label',
        valueField: 'serviceCode',
        api: getValidServiceInfo,
      },
      ifShow: ({ values }) => values.limitResource == 1,
    },
    {
      label: '允许授权类型',
      field: 'authorizedGrantTypes',
      component: 'SkillfullConstantDictSelect',
      componentProps: {
        mode: 'multiple',
        dictCode: 'system-service:AuthorizedGrantTypes',
      },
    },
    {
      field: 'innerSystem',
      label: '是否内部系统',
      component: 'RadioButtonGroup',
      required: true,
      defaultValue: 0,
      componentProps: {
        options: [
          { label: '不是', value: 0 },
          { label: '是', value: 1 },
        ],
      },
    },
    {
      field: 'signatureRequired',
      label: '是否验签',
      defaultValue: 0,
      component: 'RadioButtonGroup',
      required: true,
      componentProps: {
        options: [
          { label: '不验签', value: 0 },
          { label: '验签', value: 1 },
        ],
      },
    },
    {
      field: 'signatureKey',
      label: '数据签名key',
      component: 'Input',
      required: true,
      ifShow: ({ values }) => values.signatureRequired == 1,
    },
    {
      field: 'singleLogin',
      label: '是否单设备登录',
      component: 'RadioButtonGroup',
      required: true,
      defaultValue: 0,
      componentProps: {
        options: [
          { label: '不是', value: 0 },
          { label: '是', value: 1 },
        ],
      },
    },
    {
      field: 'singleLoginType',
      label: '单设备登录方式',
      component: 'RadioButtonGroup',
      required: true,
      defaultValue: 1,
      componentProps: {
        options: [
          { label: '一个端', value: 1 },
          { label: '不同端', value: 2 },
        ],
      },
      ifShow: ({ values }) => values.singleLogin == 1,
    },
    // {
    //   label: '允许登录端点',
    //   field: 'endpoints',
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
      field: 'limitError',
      label: '限制授权错误次数',
      component: 'RadioButtonGroup',
      required: true,
      defaultValue: 0,
      componentProps: {
        options: [
          { label: '不限制', value: 0 },
          { label: '限制', value: 1 },
        ],
      },
    },
    {
      field: 'maxErrorNum',
      label: '最大授权错误次数',
      component: 'InputNumber',
      required: true,
      ifShow: ({ values }) => values.limitError == 1,
    },
    {
      field: 'clientStatus',
      label: '状态',
      component: 'RadioButtonGroup',
      required: true,
      defaultValue: 0,
      componentProps: {
        options: [
          { label: '未启用', value: 0 },
          { label: '启用', value: 1 },
          { label: '锁定', value: 2 },
        ],
      },
    },

    {
      field: 'accessTokenValiditySeconds',
      label: 'token有效时长(s)',
      defaultValue: 1800,
      component: 'InputNumber',
      required: true,
    },
    {
      field: 'refreshTokenValiditySeconds',
      label: '刷新token有效时长(s)',
      defaultValue: 604800,
      component: 'InputNumber',
      required: true,
      ifShow: ({ values }) =>
        values.authorizedGrantTypes && values.authorizedGrantTypes.includes('refresh_token'),
    },
    {
      field: 'havaScoped',
      label: '是否领域',
      component: 'RadioButtonGroup',
      required: true,
      defaultValue: 0,
      componentProps: {
        options: [
          { label: '不是', value: 0 },
          { label: '是', value: 1 },
        ],
      },
    },
    {
      field: 'scopes',
      label: '领域',
      component: 'Input',
      required: true,
      ifShow: ({ values }) => values.havaScoped == 1,
    },
    // {
    //   label: '授权权限编码',
    //   field: 'authorityInfos',
    //   component: 'InputTextArea',
    // },
    {
      field: 'havaAutoApprove',
      label: '是否自动批准',
      component: 'RadioButtonGroup',
      required: true,
      defaultValue: 1,
      componentProps: {
        options: [
          { label: '不自动', value: 0 },
          { label: '自动', value: 1 },
        ],
      },
    },
    {
      field: 'codeValiditySeconds',
      label: '授权码有效时常(s)',
      defaultValue: 300,
      component: 'InputNumber',
      required: true,
      ifShow: ({ values }) =>
        values.authorizedGrantTypes && values.authorizedGrantTypes.includes('authorization_code'),
    },
    {
      label: '授权后跳转的URI',
      field: 'webRegisteredRedirectUri',
      component: 'InputTextArea',
      colProps: { lg: 24, md: 24 },
      required: true,
      ifShow: ({ values }) =>
        values.authorizedGrantTypes && values.authorizedGrantTypes.includes('authorization_code'),
    },
    {
      field: 'additionalInformation',
      label: '扩展信息',
      component: 'InputTextArea',
      colProps: { lg: 24, md: 24 },
    },
    {
      label: '备注',
      field: 'remark',
      colProps: { lg: 24, md: 24 },
      component: 'InputTextArea',
    },
  ];
  return clientFormSchema;
}
