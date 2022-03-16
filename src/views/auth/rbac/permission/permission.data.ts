import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { getValidServiceInfo } from '/@/api/modules/system/manage/manageService';
import { upload } from '/@/api/modules/storage/local/localFile';
import { isBoolean } from 'lodash';
export const columns: BasicColumn[] = [
  {
    title: '名称',
    dataIndex: 'metaTitle',
    fixed: 'left',
    width: 150,
    align: 'left',
  },
  {
    title: '图标',
    dataIndex: 'icon',
    fixed: 'left',
    align: 'center',
    width: 65,
    slots: { customRender: 'icon' },
  },
  {
    title: '类型',
    dataIndex: 'permissionType',
    width: 100,
    fixed: 'left',
    align: 'center',
    slots: { customRender: 'permissionType' },
  },
  {
    title: '排序',
    align: 'center',
    sorter: true,
    dataIndex: 'orderNo',
    width: 70,
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
    title: '按钮权限指令',
    dataIndex: 'actions',
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
    dataIndex: 'permissionStatus',
    width: 90,
    slots: { customRender: 'permissionStatus' },
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
    field: 'permissionTypes',
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
    field: 'permissionStatus',
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
const handleUploadData = (data) => {
  return data.data.previewPath;
};
export function createFormSchemas(api, disable) {
  const accountFormSchema: FormSchema[] = [
    {
      field: 'permissionType',
      label: '菜单类型',
      component: 'RadioButtonGroup',
      defaultValue: 0,
      componentProps: ({ formModel }) => {
        return {
          onChange: (_e: ChangeEvent) => {
            formModel.parentId = null;
            if (formModel.permissionType === 0) {
              formModel.component = 'LAYOUT';
            } else if (formModel.permissionType === 1 && formModel.iframe) {
              formModel.component = 'IFrame';
            } else if (formModel.permissionType === 1 && !formModel.iframe) {
              formModel.component = null;
            }
          },
          options: [
            { label: '目录', value: 0 },
            { label: '菜单', value: 1 },
            { label: '按钮', value: 2 },
          ],
        };
      },
      dynamicDisabled: () => {
        return disable.value;
      },
      colProps: { lg: 24, md: 24 },
    },
    {
      field: 'metaTitle',
      label: '菜单名称',
      component: 'Input',
      required: true,
    },
    {
      field: 'parentId',
      label: '上级菜单',
      component: 'ApiTreeSelect',
      componentProps: ({ formModel }) => {
        return {
          getPopupContainer: () => document.body,
          dropdownStyle: {
            maxHeight: '250px',
            overflowY: 'scroll',
          },
          replaceFields: {
            title: 'metaTitle',
            key: 'permissionId',
            value: 'permissionId',
          },
          api,
          params: { permissionType: formModel.permissionType <= 1 ? 0 : 1 },
        };
      },
      dynamicRules: ({ values }) => {
        return values.permissionType !== 0 ? [{ required: true, message: '上级菜单必填' }] : [];
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
      ifShow: ({ values }) => !isButton(values.permissionType),
    },
    {
      field: 'icon',
      label: '系统图标',
      component: 'IconPicker',
      ifShow: ({ values }) => values.iconType === 0 && !isButton(values.permissionType),
    },
    {
      field: 'icon',
      label: '自定义图标',
      component: 'CropperAvatar',
      componentProps: {
        circled: false,
        showBtn: false,
        width: '32px',
        uploadApi: upload,
        handleUploadData: handleUploadData,
      },
      ifShow: ({ values }) => values.iconType === 1 && !isButton(values.permissionType),
    },
    {
      field: 'component',
      label: '组件路径',
      defaultValue: 'LAYOUT',
      dynamicDisabled: ({ values }) => {
        return values.permissionType === 0 || (values.permissionType === 1 && values.iframe);
      },
      component: 'Input',
      required: true,
      ifShow: ({ values }) => !isButton(values.permissionType),
    },
    {
      field: 'path',
      label: '路由地址',
      component: 'Input',
      helpMessage: "顶路由必须'/'开头,子路由不需要'/'开头(除非自定义全路由)",
      required: true,
      ifShow: ({ values }) => !isButton(values.permissionType) && !values.iframe,
    },
    {
      field: 'pathName',
      label: '路由名称',
      component: 'Input',
      required: true,
      ifShow: ({ values }) => !isButton(values.permissionType),
    },
    {
      field: 'redirect',
      label: '重定向地址',
      component: 'Input',
      ifShow: ({ values }) => isDir(values.permissionType),
    },
    {
      field: 'orderNo',
      label: '排序',
      component: 'InputNumber',
    },
    {
      field: 'permissionStatus',
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
      ifShow: ({ values }) => isDir(values.permissionType),
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
      ifShow: ({ values }) => isDir(values.permissionType),
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
            } else if (formModel.permissionType === 0) {
              formModel.component = 'LAYOUT';
            } else {
              formModel.component = '';
            }
          },
        };
      },
      ifShow: ({ values }) => isMenu(values.permissionType),
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
        !isButton(values.permissionType) && values.iframeType === 1 && values.iframe,
    },
    {
      field: 'frameSrc',
      label: 'iframe地址',
      required: true,
      component: 'Input',
      ifShow: ({ values }) =>
        isMenu(values.permissionType) && values.iframeType === 0 && values.iframe,
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
      ifShow: ({ values }) => isMenu(values.permissionType),
    },
    {
      field: 'currentActiveMenu',
      label: '当前激活菜单',
      component: 'Input',
      ifShow: ({ values }) => isMenu(values.permissionType),
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
      ifShow: ({ values }) => !isBoolean(values.permissionType),
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
      ifShow: ({ values }) => !isBoolean(values.permissionType) && values.showTag,
    },
    {
      field: 'content',
      label: 'tag内容',
      component: 'Input',
      ifShow: ({ values }) => !isBoolean(values.permissionType) && values.showTag,
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
      ifShow: ({ values }) => !isBoolean(values.permissionType) && values.showTag,
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
      ifShow: ({ values }) => isMenu(values.permissionType),
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
      ifShow: ({ values }) => isMenu(values.permissionType),
    },
    {
      field: 'actions',
      label: '权限标识',
      required: true,
      component: 'Input',
      ifShow: ({ values }) => isButton(values.permissionType),
    },
    {
      field: 'actionType',
      label: '权限类型',
      required: true,
      component: 'RadioButtonGroup',
      defaultValue: 1,
      componentProps: {
        options: [
          { label: '前端', value: 1 },
          { label: '后端', value: 2 },
          { label: '通用', value: 3 },
        ],
      },
      ifShow: ({ values }) => isButton(values.permissionType),
    },
    {
      field: 'serviceId',
      label: '所属服务',
      required: true,
      component: 'ApiSelect',
      ifShow: ({ values }) =>
        isButton(values.permissionType) && (values.actionType == 2 || values.actionType == 3),
      componentProps: {
        api: getValidServiceInfo,
      },
    },
    {
      field: 'actionUri',
      label: '后端uri',
      required: true,
      component: 'Input',
      ifShow: ({ values }) =>
        isButton(values.permissionType) && (values.actionType == 2 || values.actionType == 3),
    },
    {
      field: 'actionLimitMethod',
      label: '限制请求方法',
      required: true,
      component: 'RadioButtonGroup',
      defaultValue: false,
      componentProps: {
        options: [
          { label: '不限制', value: false },
          { label: '限制', value: true },
        ],
      },
      ifShow: ({ values }) =>
        isButton(values.permissionType) && (values.actionType == 2 || values.actionType == 3),
    },
    {
      field: 'actionMethods',
      label: '请求方法',
      component: 'Select',
      componentProps: {
        mode: 'multiple',
        getPopupContainer: () => document.body,
        options: [
          { label: 'GET', value: 'GET' },
          { label: 'PUT', value: 'PUT' },
          { label: 'DELETE', value: 'DELETE' },
          { label: 'POST', value: 'POST' },
        ],
      },
      ifShow: ({ values }) =>
        isButton(values.permissionType) &&
        values.actionLimitMethod &&
        (values.actionType == 2 || values.actionType == 3),
      dynamicRules: ({ values }) => {
        return values.actionLimitMethod ? [{ required: true, message: '请求方法必填' }] : [];
      },
    },
  ];
  return accountFormSchema;
}
