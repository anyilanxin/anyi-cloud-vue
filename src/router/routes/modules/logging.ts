import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const logging: AppRouteModule = {
  path: '/logging',
  name: 'logging',
  component: LAYOUT,
  redirect: '/logging/operate',
  meta: {
    orderNo: 7,
    icon: 'ant-design:right-square-outlined',
    title: '日志管理',
  },
  children: [
    {
      path: 'operate',
      name: 'OperateManage',
      meta: {
        title: '操作日志',
        ignoreKeepAlive: false,
      },
      component: () => import('/@/views/logging/operate/index.vue'),
    },
    {
      path: 'data',
      name: 'DataManagement',
      meta: {
        title: '数据日志',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/logging/data/index.vue'),
    },
  ],
};

export default logging;
