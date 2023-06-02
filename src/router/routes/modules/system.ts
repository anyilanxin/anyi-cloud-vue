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
 *   1.请不要删除和修改根目录下的LICENSE.txt文件；
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
import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const system: AppRouteModule = {
  path: '/system',
  name: 'system',
  component: LAYOUT,
  redirect: '/system/rbac/user',
  meta: {
    orderNo: 2,
    icon: 'ant-design:setting-outlined',
    title: '系统管理',
  },
  children: [
    {
      path: 'rbac',
      name: 'SystemRbac',
      component: LAYOUT,
      meta: {
        orderNo: 1,
        title: '用户权限',
        ignoreKeepAlive: true,
      },
      children: [
        {
          path: 'user',
          name: 'UserManagement',
          meta: {
            title: '用户管理',
            ignoreKeepAlive: false,
          },
          component: () => import('/@/views/system/rbac/user/index.vue'),
        },
        {
          path: 'role',
          name: 'RoleManagement',
          meta: {
            title: '角色管理',
            ignoreKeepAlive: false,
          },
          component: () => import('/@/views/system/rbac/role/index.vue'),
        },
        {
          path: 'org',
          name: 'OrgManagement',
          meta: {
            title: '机构管理',
            ignoreKeepAlive: false,
          },
          component: () => import('/@/views/system/rbac/org/index.vue'),
        },
        {
          path: 'position',
          name: 'PositionManagement',
          meta: {
            title: '职位管理',
            ignoreKeepAlive: false,
          },
          component: () => import('/@/views/system/rbac/position/index.vue'),
        },
        {
          path: 'menu',
          name: 'MenuManagement',
          meta: {
            title: '菜单管理',
            ignoreKeepAlive: false,
          },
          component: () => import('/@/views/system/rbac/menu/index.vue'),
        },
        {
          path: 'system',
          name: 'SystemManagement',
          meta: {
            title: '系统管理',
            ignoreKeepAlive: false,
          },
          component: () => import('/@/views/system/rbac/system/index.vue'),
        },
        {
          path: 'client',
          name: 'ClientManagement',
          meta: {
            title: '客户端管理',
            ignoreKeepAlive: false,
          },
          component: () => import('/@/views/system/rbac/client/index.vue'),
        },
      ],
    },
    {
      path: 'common',
      name: 'SystemCommon',
      component: LAYOUT,
      meta: {
        orderNo: 1,
        title: '基础公共',
        ignoreKeepAlive: true,
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
          path: 'constant-dict',
          name: 'ConstantDictManagement',
          meta: {
            title: '常量字典',
            ignoreKeepAlive: false,
          },
          component: () => import('/@/views/system/common/constant-dict/index.vue'),
        },
        {
          path: 'category',
          name: 'CategoryManagement',
          meta: {
            title: '分类字典',
            ignoreKeepAlive: false,
          },
          component: () => import('/@/views/system/common/category/index.vue'),
        },
        {
          path: 'area',
          name: 'AreaManagement',
          meta: {
            title: '区域管理',
            ignoreKeepAlive: false,
          },
          component: () => import('/@/views/system/common/area/index.vue'),
        },
      ],
    },

    {
      path: 'service',
      name: 'ServiceManagement',
      meta: {
        orderNo: 1,
        title: '网关管理',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/system/manage/service/index.vue'),
    },
  ],
};

export default system;
