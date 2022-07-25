import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: '日志编号',
    dataIndex: 'logCode',
    fixed: 'left',
    width: 180,
  },
  {
    title: '授权用户',
    dataIndex: 'authUserName',
    fixed: 'left',
    sorter: true,
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
    title: '请求ip',
    dataIndex: 'requestIp',
    width: 180,
  },
  {
    title: '授权类型',
    dataIndex: 'authTypeDescribe',
    sorter: true,
    width: 120,
  },
  {
    title: '授权耗时',
    dataIndex: 'costTime',
    sorter: true,
    width: 150,
  },
  {
    title: '授权时间',
    dataIndex: 'requestStartTime',
    sorter: true,
    defaultSortOrder: 'descend',
    width: 180,
  },
  {
    title: '授权状态',
    dataIndex: 'authStatus',
    sorter: true,
    fixed: 'right',
    width: 130,
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
    label: '授权用户名称',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'authClientName',
    label: '授权客户端名称',
    component: 'Input',
    colProps: { span: 6 },
  },
];

export const detailFormSchema: FormSchema[] = [];
