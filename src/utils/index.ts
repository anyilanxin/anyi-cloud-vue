/*
 * Copyright (c) 2023-present ZHOUXUANHONG(安一老厨)<anyilanxin@aliyun.com>
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
    const params = urlParamsToJson(url);
    url = globSetting.urlPrefix + globSetting.apiUrl + SysUrlPrefix.STORAGE + url;
    if (token && Object.keys(token).length > 0) {
      params[token['token_query_name']] = token['access_token'];
      url = setObjToUrlParams(url.split('?')[0], params);
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
    const params = urlParamsToJson(url);
    url = globSetting.urlPrefix + globSetting.apiUrl + SysUrlPrefix.STORAGE + url;
    if (token && Object.keys(token).length > 0) {
      params[token['token_query_name']] = token['access_token'];
      url = setObjToUrlParams(window.location.origin + url.split('?')[0], params);
    }
  }
  return url;
}

export function getAuthHeader() {
  const token = getTokenInfo();
  const headers = {};
  if (token && Object.keys(token).length > 0) {
    headers[token['bearer_token_header_name']] = 'Bearer ' + token['access_token'];
  }
  return headers;
}

function urlParamsToJson(urlInfo: string) {
  const obj = {};
  const p = urlInfo.split('?');
  if (p.length > 1) {
    const params = p[1];
    const keyValue = params.split('&');
    for (let i = 0; i < keyValue.length; i++) {
      const item = keyValue[i].split('=');
      const key = item[0];
      const value = item[1];
      obj[key] = value;
    }
  }
  return obj;
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
