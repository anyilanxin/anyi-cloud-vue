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

export const columns: BasicColumn[] = [
  {
    title: '授权类型',
    dataIndex: 'authTypeDescribe',
    sorter: true,
    fixed: 'left',
    width: 130,
  },
  {
    title: '授权用户',
    dataIndex: 'authUserName',
    fixed: 'left',
    customRender: ({ record }) => {
      return record.authUserName || '';
    },
    width: 150,
  },
  {
    title: '客户端名称',
    dataIndex: 'authClientName',
    sorter: true,
    width: 180,
  },
  {
    title: '客户端编号',
    dataIndex: 'authClientCode',
    width: 180,
  },
  {
    title: '日志编号',
    dataIndex: 'logCode',
    width: 180,
  },
  {
    title: '请求ip',
    dataIndex: 'requestIp',
    width: 180,
  },
  {
    title: '授权开始时间',
    dataIndex: 'requestStartTime',
    sorter: true,
    defaultSortOrder: 'descend',
    width: 180,
  },
  {
    title: '授权结束时间',
    dataIndex: 'requestEndTime',
    sorter: true,
    defaultSortOrder: 'descend',
    width: 180,
  },
  {
    title: '授权耗时(ms)',
    dataIndex: 'costTime',
    sorter: true,
    width: 120,
  },
  {
    title: '授权状态',
    dataIndex: 'authStatus',
    sorter: true,
    fixed: 'right',
    width: 100,
    slots: { customRender: 'authStatus' },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'logCode',
    label: '日志编号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'requestIp',
    label: '请求ip',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'authStatus',
    label: '授权状态',
    colProps: { span: 6 },
    component: 'Select',
    componentProps: {
      options: [
        { label: '失败', value: 0 },
        { label: '成功', value: 1 },
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
  {
    field: 'authUserName',
    label: '授权用户',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'authClientName',
    label: '授权客户端',
    component: 'Input',
    colProps: { span: 6 },
  },
];

export const detailFormSchema: FormSchema[] = [];
