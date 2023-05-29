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
    title: '名称',
    dataIndex: 'metaTitle',
    fixed: 'left',
    width: 200,
    align: 'left',
  },
  {
    title: '图标',
    dataIndex: 'icon',
    fixed: 'left',
    align: 'center',
    width: 60,
    slots: { customRender: 'icon' },
  },
  {
    title: '类型',
    dataIndex: 'menuType',
    width: 60,
    fixed: 'left',
    align: 'center',
    slots: { customRender: 'menuType' },
  },
  {
    title: '排序',
    align: 'center',
    sorter: true,
    dataIndex: 'orderNo',
    width: 65,
  },
  {
    title: '路径',
    dataIndex: 'path',
    align: 'left',
    width: 200,
  },
  {
    title: '前端组件',
    align: 'left',
    dataIndex: 'component',
    width: 200,
  },
  {
    title: '按钮标识',
    dataIndex: 'buttonAction',
    width: 120,
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    sorter: true,
    defaultSortOrder: 'descend',
    width: 180,
  },
  {
    title: '创建用户',
    dataIndex: 'createUserName',
    width: 120,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 100,
  },
  {
    title: '状态',
    fixed: 'right',
    sorter: true,
    dataIndex: 'menuStatus',
    width: 75,
    slots: { customRender: 'menuStatus' },
  },
];
export const searchFormSchema: FormSchema[] = [
  {
    field: 'metaTitle',
    label: '名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'menuTypes',
    label: '类型',
    component: 'Select',
    componentProps: {
      options: [
        { label: '目录', value: 0 },
        { label: '菜单', value: 1 },
        { label: '按钮', value: 2 },
      ],
      mode: 'multiple',
    },
    colProps: { span: 6 },
  },
  {
    field: 'menuStatus',
    label: '状态',
    component: 'Select',
    componentProps: {
      options: [
        { label: '停用', value: 0 },
        { label: '启用', value: 1 },
      ],
    },
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
const isDir = (type: number) => type === 0;
const isMenu = (type: number) => type === 1;
const isButton = (type: number) => type === 2;
export function createFormSchemas(api, disable, systemId, parentType, parentId) {
  const accountFormSchema: FormSchema[] = [
    {
      field: 'menuType',
      label: '菜单类型',
      component: 'RadioButtonGroup',
      defaultValue: 0,
      componentProps: ({ formModel }) => {
        let options = [
          { label: '目录', value: 0, disabled: false },
          { label: '菜单', value: 1, disabled: false },
          { label: '按钮', value: 2, disabled: false },
        ];
        if (parentType.value == 0) {
          options = [
            { label: '目录', value: 0, disabled: false },
            { label: '菜单', value: 1, disabled: false },
            { label: '按钮', value: 2, disabled: true },
          ];
        } else if (parentType.value == 1) {
          options = [
            { label: '目录', value: 0, disabled: true },
            { label: '菜单', value: 1, disabled: true },
            { label: '按钮', value: 2, disabled: false },
          ];
        }
        return {
          onChange: (_e: ChangeEvent) => {
            formModel.parentId = parentId.value ? parentId.value : null;
            if (formModel.menuType === 0) {
              formModel.component = 'LAYOUT';
            } else if (formModel.menuType === 1 && formModel.iframe) {
              formModel.component = 'IFrame';
            } else if (formModel.menuType === 1 && !formModel.iframe) {
              formModel.component = null;
            }
          },
          options: options,
        };
      },
      dynamicDisabled: () => {
        return disable.value;
      },
      colProps: { lg: 24, md: 24 },
    },
    {
      field: 'metaTitle',
      label: '目录名称',
      component: 'Input',
      required: true,
      ifShow: ({ values }) => isDir(values.menuType),
    },
    {
      field: 'metaTitle',
      label: '菜单名称',
      component: 'Input',
      required: true,
      ifShow: ({ values }) => isMenu(values.menuType),
    },
    {
      field: 'metaTitle',
      label: '按钮名称',
      component: 'Input',
      required: true,
      ifShow: ({ values }) => isButton(values.menuType),
    },
    {
      field: 'parentId',
      label: '上级目录',
      component: 'ApiTreeSelect',
      componentProps: () => {
        return {
          getPopupContainer: () => document.body,
          dropdownStyle: {
            maxHeight: '250px',
            overflowY: 'scroll',
          },
          fieldNames: {
            label: 'metaTitle',
            value: 'menuId',
          },
          api,
          params: { menuType: '0', systemId: systemId.value },
        };
      },
      dynamicRules: ({ values }) => {
        return values.menuType !== 0 ? [{ required: true, message: '上级菜单必填' }] : [];
      },
      ifShow: ({ values }) => !isButton(values.menuType),
      dynamicDisabled: () => {
        return disable.value;
      },
    },
    {
      field: 'parentId',
      label: '上级菜单',
      component: 'ApiTreeSelect',
      componentProps: () => {
        return {
          getPopupContainer: () => document.body,
          dropdownStyle: {
            maxHeight: '250px',
            overflowY: 'scroll',
          },
          fieldNames: {
            label: 'metaTitle',
            value: 'menuId',
          },
          api,
          params: { menuType: '1', systemId: systemId.value },
        };
      },
      dynamicRules: ({ values }) => {
        return values.menuType !== 0 ? [{ required: true, message: '上级菜单必填' }] : [];
      },
      ifShow: ({ values }) => isButton(values.menuType),
      dynamicDisabled: () => {
        return disable.value;
      },
    },
    {
      field: 'iconType',
      label: '图标类型',
      component: 'RadioButtonGroup',
      defaultValue: 0,
      componentProps: ({ formModel }) => {
        return {
          onChange: (_e: ChangeEvent) => {
            formModel.icon = '';
          },
          options: [
            { label: '系统', value: 0 },
            { label: '自定义', value: 1 },
          ],
        };
      },
      ifShow: ({ values }) => !isButton(values.menuType),
    },
    {
      field: 'icon',
      label: '系统图标',
      component: 'IconPicker',
      ifShow: ({ values }) => values.iconType === 0 && !isButton(values.menuType),
    },
    {
      field: 'icon',
      label: '自定义图标',
      component: 'SkillfullCropperAvatar',
      componentProps: {
        circled: false,
        showBtn: false,
        width: '32px',
        uploadApi: upload,
      },
      ifShow: ({ values }) => values.iconType === 1 && !isButton(values.menuType),
    },
    {
      field: 'component',
      label: '组件路径',
      defaultValue: 'LAYOUT',
      dynamicDisabled: ({ values }) => {
        return values.menuType === 0 || (values.menuType === 1 && values.iframe);
      },
      component: 'Input',
      required: true,
      ifShow: ({ values }) => !isButton(values.menuType),
    },
    {
      field: 'path',
      label: '路由地址',
      component: 'Input',
      helpMessage: "顶路由必须'/'开头,子路由不需要'/'开头(除非自定义全路由)",
      required: true,
      ifShow: ({ values }) => !isButton(values.menuType) && !values.iframe,
    },
    {
      field: 'pathName',
      label: '路由名称',
      component: 'Input',
      required: true,
      ifShow: ({ values }) => !isButton(values.menuType),
    },
    {
      field: 'redirect',
      label: '重定向地址',
      component: 'Input',
      ifShow: ({ values }) => isDir(values.menuType),
    },
    {
      field: 'orderNo',
      label: '排序',
      component: 'InputNumber',
    },
    {
      field: 'menuStatus',
      label: '状态',
      component: 'RadioButtonGroup',
      defaultValue: 1,
      componentProps: {
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
      },
    },
    {
      field: 'hideChildrenInMenu',
      label: '隐藏子菜单',
      component: 'RadioButtonGroup',
      defaultValue: false,
      componentProps: {
        options: [
          { label: '不隐藏', value: false },
          { label: '隐藏', value: true },
        ],
      },
      ifShow: ({ values }) => isDir(values.menuType),
    },
    {
      field: 'hidePathForChildren',
      label: '忽略本级路由',
      component: 'RadioButtonGroup',
      defaultValue: false,
      componentProps: {
        options: [
          { label: '忽略', value: true },
          { label: '不忽略', value: false },
        ],
      },
      ifShow: ({ values }) => isDir(values.menuType),
    },

    {
      field: 'iframe',
      label: '是否外链',
      component: 'RadioButtonGroup',
      defaultValue: false,
      componentProps: ({ formModel }) => {
        return {
          options: [
            { label: '否', value: false },
            { label: '是', value: true },
          ],
          onChange: (_e: ChangeEvent) => {
            if (formModel.iframe) {
              formModel.component = 'IFrame';
            } else if (formModel.menuType === 0) {
              formModel.component = 'LAYOUT';
            } else {
              formModel.component = '';
            }
          },
        };
      },
      ifShow: ({ values }) => isMenu(values.menuType),
    },
    {
      field: 'iframeType',
      label: '外链接类型',
      component: 'RadioButtonGroup',
      defaultValue: 0,
      componentProps: ({ formModel }) => {
        return {
          options: [
            { label: '内嵌', value: 0 },
            { label: '外链接', value: 1 },
          ],
          onChange: (_e: ChangeEvent) => {
            if (formModel.iframeType === 1) {
              formModel.component = 'IFrame';
            }
          },
        };
      },
      ifShow: ({ values }) => values.iframe,
    },
    {
      field: 'path',
      label: 'iframe地址',
      component: 'Input',
      required: true,
      ifShow: ({ values }) =>
        !isButton(values.menuType) && values.iframeType === 1 && values.iframe,
    },
    {
      field: 'frameSrc',
      label: 'iframe地址',
      required: true,
      component: 'Input',
      ifShow: ({ values }) => isMenu(values.menuType) && values.iframeType === 0 && values.iframe,
    },
    {
      field: 'ignoreKeepAlive',
      label: '是否缓存',
      component: 'RadioButtonGroup',
      defaultValue: false,
      componentProps: {
        options: [
          { label: '是', value: false },
          { label: '否', value: true },
        ],
      },
      ifShow: ({ values }) => isMenu(values.menuType),
    },
    {
      field: 'currentActiveMenu',
      label: '当前激活菜单',
      component: 'Input',
      ifShow: ({ values }) => isMenu(values.menuType),
    },
    {
      field: 'showTag',
      label: '显示tag',
      component: 'RadioButtonGroup',
      defaultValue: false,
      componentProps: {
        options: [
          { label: '显示', value: true },
          { label: '不显示', value: false },
        ],
      },
      ifShow: ({ values }) => !isButton(values.menuType),
    },

    {
      field: 'type',
      label: 'tag类型',
      component: 'Select',
      componentProps: {
        getPopupContainer: () => document.body,
        options: [
          { label: '主要', value: 'primary' },
          { label: '错误', value: 'error' },
          { label: '警告', value: 'warn' },
          { label: '成功', value: 'success' },
        ],
      },
      ifShow: ({ values }) => !isButton(values.menuType) && values.showTag,
    },
    {
      field: 'content',
      label: 'tag内容',
      component: 'Input',
      ifShow: ({ values }) => !isButton(values.menuType) && values.showTag,
    },
    {
      field: 'dot',
      label: '是否圆点',
      component: 'RadioButtonGroup',
      defaultValue: false,
      componentProps: {
        options: [
          { label: '是', value: true },
          { label: '否', value: false },
        ],
      },
      ifShow: ({ values }) => !isButton(values.menuType) && values.showTag,
    },
    {
      field: 'hideMenu',
      label: '菜单中隐藏',
      component: 'RadioButtonGroup',
      defaultValue: false,
      componentProps: {
        options: [
          { label: '不隐藏', value: false },
          { label: '隐藏', value: true },
        ],
      },
      ifShow: ({ values }) => isMenu(values.menuType),
    },

    {
      field: 'hideBreadcrumb',
      label: '面包屑上隐藏',
      component: 'RadioButtonGroup',
      defaultValue: false,
      componentProps: {
        options: [
          { label: '不隐藏', value: false },
          { label: '隐藏', value: true },
        ],
      },
      ifShow: ({ values }) => isMenu(values.menuType),
    },
    {
      field: 'buttonAction',
      label: '按钮标识',
      required: true,
      component: 'Input',
      ifShow: ({ values }) => isButton(values.menuType),
    },
  ];
  return accountFormSchema;
}
