import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router';
import type { App, Plugin } from 'vue';
import { useGlobSetting } from '/@/hooks/setting';
const globSetting = useGlobSetting();
import { unref } from 'vue';
import { isObject } from '/@/utils/is';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import { Base64 } from 'js-base64';
import { getTokenInfo } from '/@/utils/auth';
export const noop = () => {};

/**
 * @description:  Set ui mount node
 */
export function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (node?.parentNode as HTMLElement) ?? document.body;
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = '';
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}

export function openWindow(
  url: string,
  opt?: { target?: TargetContext | string; noopener?: boolean; noreferrer?: boolean },
) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {};
  const feature: string[] = [];

  noopener && feature.push('noopener=yes');
  noreferrer && feature.push('noreferrer=yes');

  window.open(url, target, feature.join(','));
}

// dynamic use hook props
export function getDynamicProps<T, U>(props: T): Partial<U> {
  const ret: Recordable = {};

  Object.keys(props).map((key) => {
    ret[key] = unref((props as Recordable)[key]);
  });

  return ret as Partial<U>;
}

export function getRawRoute(route: RouteLocationNormalized): RouteLocationNormalized {
  if (!route) return route;
  const { matched, ...opt } = route;
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : undefined) as RouteRecordNormalized[],
  };
}

export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any;
  comp.install = (app: App) => {
    app.component(comp.name || comp.displayName, component);
    if (alias) {
      app.config.globalProperties[alias] = component;
    }
  };
  return component as T & Plugin;
};

export function getUrlPrefix() {
  return globSetting.urlPrefix;
}

export function getAttachmentUrl(url: string) {
  // 不是https、http以及base64图片
  if (
    url &&
    url.indexOf('https') < 0 &&
    url.indexOf('http') < 0 &&
    url.indexOf('data:image/') < 0
  ) {
    const token = getTokenInfo();
    url = globSetting.urlPrefix + globSetting.apiUrl + SysUrlPrefix.STORAGE + url;
    if (token && Object.keys(token).length > 0) {
      url = url + '?' + token['token_query_name'] + '=' + token['access_token'];
    }
  }
  return url;
}

export function getAttachmentDomainUrl(url: string) {
  // 不是https、http以及base64图片
  if (
    url &&
    url.indexOf('https') < 0 &&
    url.indexOf('http') < 0 &&
    url.indexOf('data:image/') < 0
  ) {
    const token = getTokenInfo();
    url = globSetting.urlPrefix + globSetting.apiUrl + SysUrlPrefix.STORAGE + url;
    if (token && Object.keys(token).length > 0) {
      url =
        window.location.origin +
        url +
        '?' +
        token['token_query_name'] +
        '=' +
        token['access_token'];
    }
  }
  return url;
}

/**
 * 字符串转base64
 * @param {*} str
 */
export function strToBase64(str: string) {
  return Base64.encode(str);
}

/**
 * base64转str
 * @param {*} base64
 */
export function base64ToStr(base64: string) {
  return Base64.decode(base64);
}
