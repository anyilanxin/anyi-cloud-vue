import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const job: AppRouteModule = {
  path: '/job',
  name: 'job',
  component: LAYOUT,
  redirect: '/job/job-report',
  meta: {
    orderNo: 2,
    icon: 'ant-design:schedule-outlined',
    title: '调度中心',
  },
  children: [
    {
      path: 'job-report',
      name: 'JobReport',
      component: () => import('/@/views/job/report/index.vue'),
      meta: {
        orderNo: 1,
        title: '运行报表',
        ignoreKeepAlive: true,
      },
    },
    {
      path: 'job-info',
      name: 'JobInfo',
      component: () => import('/@/views/job/info/index.vue'),
      meta: {
        orderNo: 1,
        title: '任务管理',
        ignoreKeepAlive: true,
      },
    },
    {
      path: 'job-log',
      name: 'JobLog',
      meta: {
        orderNo: 1,
        title: '调度日志',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/job/log/index.vue'),
    },
    {
      path: 'job-group',
      name: 'JobGroup',
      meta: {
        orderNo: 1,
        title: '执行器管理',
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/job/group/index.vue'),
    },
  ],
};

export default job;
