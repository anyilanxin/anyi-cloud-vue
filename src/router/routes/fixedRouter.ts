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
 *   4.分发源码时候，请注明软件出处 https://github.com/anyilanxin/anyi-cloud-vue；
 *   5.在修改包名，模块名称，项目代码等时，请注明软件出处 https://github.com/anyilanxin/anyi-cloud-vue；
 *   6.本软件不允许在国家法律规定范围外使用，如出现违法行为原作者本人不承担任何法律风险；
 *   7.进行商用时，不得基于AnYi Cloud Vue的基础，修改包装而成一个与AnYi Cloud EE、AnYi Zeebe EE、AnYi Standalone EE功能类似的程序，进行销售或发布，参与同类软件产品市场的竞争；
 *   8.本软件使用的第三方依赖皆为开源软件，如需要修改第三方源码请遵循第三方源码附带开源协议；
 *   9.本软件中使用了bpmn js,使用请遵循bpmn.io开源协议：
 *     https://github.com/bpmn-io/bpmn-js/blob/develop/LICENSE
 *   10.若您的项目无法满足以上几点，可申请商业授权。
 */
/**
 * 此处为页面中跳转固定地址(此处如果由权限去管理变更后需要更改前端代码比较麻烦)：例如：详细页面等等，
 * 因此统一固定管理，不使用动态配置页面权限
 */

import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
const fixedRouter: AppRouteModule = {
  path: '/fixed-router',
  name: 'FixedRoute',
  component: LAYOUT,
  meta: {
    orderNo: 2,
    hideChildrenInMenu: true,
    icon: 'ion:key-outline',
    title: '固定路由',
  },
  children: [
    {
      path: 'fixed-page-service-router',
      name: 'FixedPageServiceRouter',
      meta: {
        orderNo: 1,
        title: '服务路由',
        currentActiveMenu: '/system/service',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/system/manage/service/FixedPageServiceRouter.vue'),
    },
    {
      path: 'fixed-page-custom-filter',
      name: 'FixedPageCustomFilter',
      meta: {
        orderNo: 2,
        title: '服务过滤器',
        currentActiveMenu: '/system/service',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/system/manage/service/FixedPageCustomFilter.vue'),
    },
    {
      path: 'fixed-page-history-deployment',
      name: 'FixedPageHistoryDeployment',
      meta: {
        orderNo: 3,
        title: '部署历史',
        currentActiveMenu: '/process/base/design-diagram',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/process/base/diagram/FixedPageHistoryDeployment.vue'),
    },
    {
      path: 'fixed-page-model-design',
      name: 'FixedPageModelDesign',
      meta: {
        orderNo: 4,
        title: '模型设计',
        currentActiveMenu: '/process/base/design-diagram',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/process/base/diagram/FixedPageDiagramDesign.vue'),
    },
    {
      path: 'fixed-page-org-info',
      name: 'FixedPageOrgInfo',
      meta: {
        orderNo: 4,
        title: '机构管理',
        currentActiveMenu: '/system/rbac/org',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/system/rbac/org/FixedPageOrgInfo.vue'),
    },
    {
      path: 'fixed-page-role-info',
      name: 'FixedPageRoleInfo',
      meta: {
        orderNo: 4,
        title: '角色授权',
        currentActiveMenu: '/system/rbac/role',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/system/rbac/role/FixedPageRoleInfo.vue'),
    },
    {
      path: 'fixed-page-client-info',
      name: 'FixedPageClientInfo',
      meta: {
        orderNo: 4,
        title: '客户端授权',
        currentActiveMenu: '/system/rbac/client',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/system/rbac/client/FixedPageClientInfo.vue'),
    },
    {
      path: 'fixed-page-org-role-info',
      name: 'FixedPageOrgRoleInfo',
      meta: {
        orderNo: 4,
        title: '机构角色授权',
        currentActiveMenu: '/system/rbac/user',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/system/rbac/user/FixedPageOrgRoleInfo.vue'),
    },
    {
      path: 'fixed-page-user-info',
      name: 'FixedPageUserInfo',
      meta: {
        orderNo: 4,
        title: '用户信息',
        currentActiveMenu: '/system/rbac/user',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/system/rbac/user/FixedPageUserInfo.vue'),
    },
  ],
};
export default fixedRouter;
