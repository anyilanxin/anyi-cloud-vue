/*
 * Copyright (c) 2021-2023 ZHOUXUANHONG(安一老厨)<anyilanxin@aliyun.com>
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
 *   1.请不要删除和修改根目录下的LICENSE文件；
 *   2.请不要删除和修改 AnYi Cloud Vue 源码头部的版权声明；
 *   3.请保留源码和相关描述文件的项目出处，作者声明等；
 *   4.分发源码时候，请注明软件出处 https://github.com/anyilanxin/anyi-cloud；
 *   5.在修改包名，模块名称，项目代码等时，请注明软件出处 https://github.com/anyilanxin/anyi-cloud；
 *   6.本软件不允许在国家法律规定范围外使用，如出现违法行为原作者本人不承担任何法律风险；
 *   7.进行商用时，不得基于AnYi Cloud Vue 的基础，修改包装而成一个与AnYi Zeebe EE、AnYi Cloud EE功能类似的程序，进行销售或发布，参与同类软件产品市场的竞争；
 *   8.本软件使用的第三方依赖皆为开源软件，如需要修改第三方源码请遵循第三方源码附带开源协议；
 *   9.本软件流程部分请遵循camunda开源协议：
 *     https://docs.camunda.org/manual/latest/introduction/third-party-libraries
 *     https://github.com/camunda/camunda-bpm-platform/blob/master/LICENSE
 *   10.若您的项目无法满足以上几点，可申请商业授权。
 */
import type { UserInfo } from '/#/store';
import type { ErrorMessageMode } from '/#/axios';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { PageEnum } from '/@/enums/pageEnum';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { loginPicture } from '/@/api/modules/sys/webLogin';
import { LoginPicture } from '/@/api/modules/sys/model/webLoginModel';
import { TokenInfo } from 'types/store';
import { getUserInfo } from '/@/api/modules/sys/webLoginCenter';
import { loginOut } from '/@/api/modules/sys/loginCommon';
import { useI18n } from '/@/hooks/web/useI18n';
import { usePermissionStore } from '/@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';

interface UserState {
  userInfo: Nullable<UserInfo>;
  tokenInfo: Nullable<TokenInfo>;
  roleList: string[];
  sessionTimeout?: boolean;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token info
    tokenInfo: null,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
  }),
  getters: {
    getUserInfo(): UserInfo {
      const userInfo = this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
      return userInfo;
    },
    getTokenInfo(): TokenInfo {
      return this.tokenInfo || getAuthCache<TokenInfo>(TOKEN_KEY) || {};
    },
    getToken(): string {
      if (this.tokenInfo && Object.keys(this.tokenInfo).length > 0) {
        return this.tokenInfo.access_token;
      } else {
        const tokenInfo = getAuthCache<TokenInfo>(TOKEN_KEY);
        if (tokenInfo && Object.keys(tokenInfo).length > 0) {
          return tokenInfo.access_token;
        }
        return '';
      }
    },
    getRoleList(): string[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<string[]>(ROLES_KEY);
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
  },
  actions: {
    setTokenInfo(info: TokenInfo | null) {
      this.tokenInfo = info;
      setAuthCache(TOKEN_KEY, info);
    },
    setRoleList(roleList: string[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo) {
      this.userInfo = info;
      // 不缓存storage,每次刷新都重新获取
      // setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.tokenInfo = null;
      this.roleList = [];
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginPicture & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<UserInfo | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const tokenInfo = await loginPicture(loginParams, mode);

        // save token
        this.setTokenInfo(tokenInfo);
        // get user info
        const userInfo = await this.getUserAndAuth();
        const sessionTimeout = this.sessionTimeout;
        if (sessionTimeout) {
          this.setSessionTimeout(false);
        } else if (goHome) {
          const permissionStore = usePermissionStore();
          if (!permissionStore.isDynamicAddedRoute) {
            console.log('-------sdfsdfsdfsdfsdfsdfd----99999---');
            const routes = await permissionStore.buildRoutesAction();
            routes.forEach((route) => {
              router.addRoute(route as unknown as RouteRecordRaw);
            });
            router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
            permissionStore.setDynamicAddedRoute(true);
          }
          const redirect = (router.currentRoute.value.query.redirect || '') as string;
          if (redirect) {
            await router.replace(redirect);
          } else {
            await router.replace(userInfo.homePath || PageEnum.BASE_HOME);
          }
        }
        return userInfo;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async getUserAndAuth(orgId?: string): Promise<UserInfo> {
      // 获取用户信息
      const userInfo = await getUserInfo(orgId);
      this.setUserInfo(userInfo);
      this.setRoleList(userInfo?.roleCodes || []);
      // 获取权限信息
      return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      try {
        loginOut();
      } catch {
        console.log('注销Token失败');
      }
      setTimeout(() => {
        this.setTokenInfo(null);
        this.setSessionTimeout(false);
      }, 0);
      const fullPath = router.currentRoute.value.fullPath;
      if (fullPath !== PageEnum.BASE_LOGIN) {
        goLogin &&
          router.push({
            path: PageEnum.BASE_LOGIN,
            query: {
              redirect: fullPath,
            },
          });
      }
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: t('sys.app.logoutTip'),
        content: t('sys.app.logoutMessage'),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
    /**
     * @description: 切换机构
     */
    async switchOrg(orgId: string) {
      const { createMessage } = useMessage();
      try {
        const permissionStore = usePermissionStore();
        const routes = await permissionStore.buildRoutesAction(orgId);
        routes.forEach((route) => {
          router.addRoute(route as unknown as RouteRecordRaw);
        });
        router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
      } catch (error) {
        // createMessage.error(error?.message || '切换机构失败');
        return Promise.reject(error);
      }
      createMessage.success('切换机构成功');
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
