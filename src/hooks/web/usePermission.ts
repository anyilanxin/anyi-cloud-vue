/* eslint-disable @typescript-eslint/no-unused-vars */
import type { RouteRecordRaw } from 'vue-router';

import { useAppStore } from '/@/store/modules/app';
import { usePermissionStore } from '/@/store/modules/permission';
import { useUserStore } from '/@/store/modules/user';

import { useTabs } from './useTabs';

import { router, resetRouter } from '/@/router';
// import { RootRoute } from '/@/router/routes';

import projectSetting from '/@/settings/projectSetting';
import { PermissionModeEnum } from '/@/enums/appEnum';
import { RoleEnum } from '/@/enums/roleEnum';

import { intersection } from 'lodash-es';
import { isArray } from '/@/utils/is';
import { useMultipleTabStore } from '/@/store/modules/multipleTab';

// User permissions related operations
export function usePermission() {
  const userStore = useUserStore();
  const appStore = useAppStore();
  const permissionStore = usePermissionStore();
  const { closeAll } = useTabs(router);

  /**
   * Change permission mode
   */
  async function togglePermissionMode() {
    appStore.setProjectConfig({
      permissionMode:
        projectSetting.permissionMode === PermissionModeEnum.BACK
          ? PermissionModeEnum.ROUTE_MAPPING
          : PermissionModeEnum.BACK,
    });
    location.reload();
  }

  /**
   * Reset and regain authority resource information
   * @param id
   */
  async function resume() {
    const tabStore = useMultipleTabStore();
    tabStore.clearCacheTabs();
    resetRouter();
    const routes = await permissionStore.buildRoutesAction();
    routes.forEach((route) => {
      router.addRoute(route as unknown as RouteRecordRaw);
    });
    permissionStore.setLastBuildMenuTime();
    closeAll();
  }

  /**
   * Determine whether there is permission
   */
  function hasPermission(value?: string, def = true): boolean {
    if (!value) {
      return def;
    }
    // 如果是超级管理员则拥有所有权限直接放行
    const superRoleCode = projectSetting.superRoleCode;
    const roleCodes = userStore.getRoleList as string[];
    if (roleCodes && roleCodes.length > 0) {
      if (roleCodes.includes(superRoleCode)) {
        return def;
      }
    }
    const routerInfo = router.currentRoute.value?.name;
    if (!routerInfo) {
      return true;
    }
    const actionInfo = appStore.getActionInfo || {};
    if (!actionInfo || Object.keys(actionInfo).length <= 0) {
      return true;
    }
    const permissionExpression = actionInfo[routerInfo]?.[value];
    if (!permissionExpression) {
      return true;
    }
    const checkResult = eval(permissionExpression);
    return checkResult;
  }
  /**
   * 含有某个角色
   */
  // eslint-disable-next-line no-unused-vars
  function hasRole(value?: string) {
    console.log('---hasRole--value--------', value);
    if (!value) {
      return true;
    }
    const roleCodes = userStore.getRoleList as string[];
    if (roleCodes.length <= 0) {
      return false;
    }
    return roleCodes.includes(value);
  }
  /**
   * 拥有任意一个角色
   */
  // eslint-disable-next-line no-unused-vars
  function hasAnyRole(value?: string) {
    console.log('-----value----1111---', value);
    if (!value) {
      return true;
    }
    const roles = value.split(',');
    const roleCodes = userStore.getRoleList as string[];
    if (roleCodes.length <= 0) {
      return false;
    }
    return (intersection(roles, roleCodes) as string[]).length > 0;
  }
  /**
   * 含有某个权限
   */
  // eslint-disable-next-line no-unused-vars
  function hasAuthority(value?: string) {
    if (!value) {
      return true;
    }
    const allCodeList = (router.currentRoute.value?.meta?.actionSet || []) as string[];
    if (allCodeList.length <= 0) {
      return false;
    }
    return allCodeList.includes(value);
  }
  /**
   * 拥有任意一个权限
   */
  // eslint-disable-next-line no-unused-vars
  function hasAnyAuthority(value?: string) {
    if (!value) {
      return true;
    }
    const authoritys = value.split(',');
    const allCodeList = (router.currentRoute.value?.meta?.actionSet || []) as string[];
    if (allCodeList.length <= 0) {
      return false;
    }
    return (intersection(authoritys, allCodeList) as string[]).length > 0;
  }
  /**
   * 所有可访问
   */
  // eslint-disable-next-line no-unused-vars
  function permitAll() {
    return true;
  }
  /**
   * 拒绝访问
   */
  // eslint-disable-next-line no-unused-vars
  function denyAll() {
    return false;
  }
  /**
   * 匿名可访问
   */
  // eslint-disable-next-line no-unused-vars
  function isAnonymous() {
    return true;
  }
  /**
   * 授权后可访问
   */
  // eslint-disable-next-line no-unused-vars
  function isAuthenticated() {
    return true;
  }
  /**
   * Change roles
   * @param roles
   */
  async function changeRole(roles: RoleEnum | RoleEnum[]): Promise<void> {
    if (projectSetting.permissionMode !== PermissionModeEnum.ROUTE_MAPPING) {
      throw new Error(
        'Please switch PermissionModeEnum to ROUTE_MAPPING mode in the configuration to operate!'
      );
    }

    if (!isArray(roles)) {
      roles = [roles];
    }
    userStore.setRoleList(roles);
    await resume();
  }

  /**
   * refresh menu data
   */
  async function refreshMenu() {
    resume();
  }

  return { changeRole, hasPermission, togglePermissionMode, refreshMenu };
}
