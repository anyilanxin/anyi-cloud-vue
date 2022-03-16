import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const storage: AppRouteModule = {
  path: '/storage',
  name: 'storage',
  component: LAYOUT,
  redirect: '/storage/local',
  meta: {
    orderNo: 4,
    icon: 'ant-design:database-outlined',
    title: '存储管理',
  },
  children: [
    {
      path: 'local',
      name: 'LocalManage',
      meta: {
        title: '本地存储管理',
        ignoreKeepAlive: false,
      },
      component: () => import('/@/views/storage/local/manage/index.vue'),
    },
    {
      path: 'local-config',
      name: 'LocalConfigManagement',
      meta: {
        title: '本地存储配置',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/storage/local/config/index.vue'),
    },
    {
      path: 'oss',
      name: 'OssManagement',
      meta: {
        title: 'Oss管理',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/storage/oss/manage/index.vue'),
    },
    {
      path: 'oss-config',
      name: 'OssConfigManagement',
      meta: {
        title: 'oss配置',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/storage/oss/config/index.vue'),
    },
  ],
};

export default storage;
