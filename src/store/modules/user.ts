import type { UserInfo } from '/#/store';
import type { ErrorMessageMode } from '/#/axios';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { RoleEnum } from '/@/enums/roleEnum';
import { PageEnum } from '/@/enums/pageEnum';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { loginPicture } from '/@/api/modules/sys/webLogin';
import { LoginPicture, TokenInfo } from '/@/api/modules/sys/model/webLoginModel';
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
  roleList: RoleEnum[];
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
        return this.tokenInfo.token;
      } else {
        const tokenInfo = getAuthCache<TokenInfo>(TOKEN_KEY);
        if (tokenInfo && Object.keys(tokenInfo).length > 0) {
          return tokenInfo.token;
        }
        return '';
      }
    },
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
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
    setRoleList(roleList: RoleEnum[]) {
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
      }
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
    async getUserAndAuth(): Promise<UserInfo> {
      // 获取用户信息
      const userInfo = await getUserInfo();
      this.setUserInfo(userInfo);
      // 获取权限信息
      return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      try {
        await loginOut();
      } catch {
        console.log('注销Token失败');
      }
      this.setTokenInfo(null);
      this.setSessionTimeout(false);
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
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
