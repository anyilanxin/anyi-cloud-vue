import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const system: AppRouteModule = {
  path: '/system',
  name: 'system',
  component: LAYOUT,
  redirect: '/system/dict',
  meta: {
    orderNo: 3,
    icon: 'ant-design:setting-outlined',
    title: '系统管理',
  },
  children: [
    {
      path: 'dict',
      name: 'DictManage',
      meta: {
        title: '字典管理',
        ignoreKeepAlive: false,
      },
      component: () => import('/@/views/system/common/dict/index.vue'),
    },
    {
      path: 'category',
      name: 'CategoryManagement',
      meta: {
        title: '分类字典',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/system/common/category/index.vue'),
    },
    {
      path: 'area',
      name: 'AreaManagement',
      meta: {
        title: '区域管理',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/system/common/area/index.vue'),
    },
    {
      path: 'service',
      name: 'ServiceManagement',
      meta: {
        ignoreKeepAlive: true,
        title: '服务管理',
      },
      component: () => import('/@/views/system/manage/service/index.vue'),
    },
    {
      path: 'service_filter/:id',
      name: 'ServiceFilter',
      meta: {
        hideMenu: true,
        showMenu: false,
        currentActiveMenu: '/system/service',
        title: '服务过滤器',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/system/manage/service/ServiceFilter.vue'),
    },
    {
      path: 'router_info',
      name: 'RouterInfo',
      meta: {
        hideMenu: true,
        ignoreKeepAlive: true,
        showMenu: false,
        currentActiveMenu: '/system/service',
        title: '路由管理',
      },
      component: () => import('/@/views/system/manage/service/RouterInfo.vue'),
    },
    {
      path: 'source',
      name: 'SourceManagement',
      meta: {
        title: '数据源管理',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/system/manage/source/index.vue'),
    },
  ],
};

export default system;
