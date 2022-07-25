import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const system: AppRouteModule = {
  path: '/process',
  name: 'process',
  component: LAYOUT,
  redirect: '/process/business',
  meta: {
    orderNo: 3,
    icon: 'ant-design:cluster-outline',
    title: '流程中心',
  },
  children: [
    {
      path: 'business',
      name: 'ProcessBusiness',
      redirect: '/process/business/process-market',
      component: LAYOUT,
      meta: {
        orderNo: 1,
        title: '审批办公',
        icon: 'ant-design:cluster-outline',
      },
      children: [
        {
          path: 'process-market',
          name: 'ProcessMarket',
          meta: {
            orderNo: 1,
            title: '流程市场',
          },
          component: () => import('/@/views/process/business/market/index.vue'),
        },
        {
          path: 'task-wait',
          name: 'TaskWait',
          meta: {
            orderNo: 2,
            title: '待办事项',
          },
          component: () => import('/@/views/process/business/task-wait/index.vue'),
        },
        {
          path: 'submit-process',
          name: 'SubmitProcess',
          meta: {
            orderNo: 3,
            title: '我的申请',
          },
          component: () => import('/@/views/process/business/submit/index.vue'),
        },
        {
          path: 'task-copy',
          name: 'TaskCopy',
          meta: {
            orderNo: 4,
            title: '抄送事项',
          },
          component: () => import('/@/views/process/business/task-copy/index.vue'),
        },
        {
          path: 'task-history',
          name: 'TaskHistory',
          meta: {
            orderNo: 5,
            title: '已办事项',
          },
          component: () => import('/@/views/process/business/task-history/index.vue'),
        },
        {
          path: 'task-delegate',
          name: 'TaskDelegate',
          meta: {
            orderNo: 6,
            title: '委托事项',
          },
          component: () => import('/@/views/process/business/task-delegate/index.vue'),
        },
        {
          path: 'task-turn',
          name: 'TaskTurn',
          meta: {
            orderNo: 7,
            title: '转办事项',
          },
          component: () => import('/@/views/process/business/task-turn/index.vue'),
        },
        {
          path: 'task-urgent',
          name: 'TaskUrgent',
          meta: {
            orderNo: 8,
            title: '催办事项',
          },
          component: () => import('/@/views/process/business/task-urgent/index.vue'),
        },
      ],
    },
    {
      path: 'base',
      name: 'ProcessBase',
      component: LAYOUT,
      redirect: '/process/base/diagram',
      meta: {
        orderNo: 2,
        title: '流程基础',
        icon: 'ant-design:highlight-outlined',
      },
      children: [
        {
          path: 'design-diagram',
          name: 'DesignDiagram',
          meta: {
            orderNo: 1,
            title: '模型设计',
          },
          component: () => import('/@/views/process/base/diagram/index.vue'),
        },
        {
          path: 'category',
          name: 'DesignCategory',
          meta: {
            orderNo: 2,
            title: '流程类别',
          },
          component: () => import('/@/views/process/base/category/index.vue'),
        },
        {
          path: 'design-expression',
          name: 'DesignExpression',
          meta: {
            orderNo: 2,
            title: '表达式管理',
          },
          component: () => import('/@/views/process/base/expression/index.vue'),
        },
        {
          path: 'design-form',
          name: 'DesignForm',
          meta: {
            orderNo: 2,
            title: '表单设计',
          },
          component: () => import('/@/views/process/base/form/index.vue'),
        },
        {
          path: 'design-listen',
          name: 'DesignListen',
          meta: {
            orderNo: 2,
            title: '监听器设计',
          },
          component: () => import('/@/views/process/base/listen/index.vue'),
        },
      ],
    },
    {
      path: 'manage',
      name: 'ProcessManage',
      component: LAYOUT,
      redirect: '/process/manage/definition',
      meta: {
        orderNo: 2,
        title: '流程管理',
        icon: 'ant-design:build-outlined',
      },
      children: [
        {
          path: 'manage-definition',
          name: 'ManageDefinition',
          meta: {
            orderNo: 1,
            title: '流程定义',
          },
          component: () => import('/@/views/process/manage/definition/index.vue'),
        },
        {
          path: 'manage-instance',
          name: 'ManageInstance',
          meta: {
            orderNo: 2,
            title: '流程实例',
          },
          component: () => import('/@/views/process/manage/instance/index.vue'),
        },
      ],
    },
    {
      path: 'process-monitor',
      name: 'ProcessMonitor',
      redirect: '/process/process-monitor/deployment',
      component: LAYOUT,
      meta: {
        orderNo: 3,
        title: '流程监控',
        icon: 'ant-design:monitor-outlined',
      },
      children: [],
    },
  ],
};

export default system;
