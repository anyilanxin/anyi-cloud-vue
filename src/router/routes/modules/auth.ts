import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const auth: AppRouteModule = {
  path: '/auth',
  name: 'auth',
  component: LAYOUT,
  redirect: '/auth/permmission',
  meta: {
    orderNo: 2,
    icon: 'ion:key-outline',
    title: '权限管理',
  },
  children: [
    {
      path: 'user',
      name: 'UserManagement',
      meta: {
        orderNo: 1,
        title: '用户管理',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/auth/rbac/user/index.vue'),
    },
    {
      path: 'role',
      name: 'RoleManagement',
      meta: {
        orderNo: 2,
        title: '角色管理',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/auth/rbac/role/index.vue'),
    },
    {
      path: 'org',
      name: 'OrgManagement',
      meta: {
        orderNo: 3,
        title: '机构管理',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/auth/rbac/org/index.vue'),
    },
    {
      path: 'position',
      name: 'PositionManagement',
      meta: {
        orderNo: 4,
        title: '职位管理',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/auth/rbac/org/index.vue'),
    },
    {
      path: 'permmission',
      name: 'PermmissionManage',
      meta: {
        orderNo: 5,
        title: '菜单管理',
        ignoreKeepAlive: false,
      },
      component: () => import('/@/views/auth/rbac/permission/index.vue'),
    },
    {
      path: 'system',
      name: 'SystemManagement',
      meta: {
        orderNo: 6,
        title: '系统信息',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/auth/common/system/index.vue'),
    },
  ],
};

export default auth;
