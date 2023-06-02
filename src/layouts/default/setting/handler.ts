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
import { HandlerEnum } from './enum';
import { updateHeaderBgColor, updateSidebarBgColor } from '/@/logics/theme/updateBackground';
import { updateColorWeak } from '/@/logics/theme/updateColorWeak';
import { updateGrayMode } from '/@/logics/theme/updateGrayMode';

import { useAppStore } from '/@/store/modules/app';
import { ProjectConfig } from '/#/config';
import { changeTheme } from '/@/logics/theme';
import { updateDarkTheme } from '/@/logics/theme/dark';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';

export function baseHandler(event: HandlerEnum, value: any) {
  const appStore = useAppStore();
  const config = handler(event, value);
  appStore.setProjectConfig(config);
  if (event === HandlerEnum.CHANGE_THEME) {
    updateHeaderBgColor();
    updateSidebarBgColor();
  }
}

export function handler(event: HandlerEnum, value: any): DeepPartial<ProjectConfig> {
  const appStore = useAppStore();

  const { getThemeColor, getDarkMode } = useRootSetting();
  switch (event) {
    case HandlerEnum.CHANGE_LAYOUT:
      const { mode, type, split } = value;
      const splitOpt = split === undefined ? { split } : {};

      return {
        menuSetting: {
          mode,
          type,
          collapsed: false,
          show: true,
          hidden: false,
          ...splitOpt,
        },
      };

    case HandlerEnum.CHANGE_THEME_COLOR:
      if (getThemeColor.value === value) {
        return {};
      }
      changeTheme(value);

      return { themeColor: value };

    case HandlerEnum.CHANGE_THEME:
      if (getDarkMode.value === value) {
        return {};
      }
      updateDarkTheme(value);

      return {};

    case HandlerEnum.MENU_HAS_DRAG:
      return { menuSetting: { canDrag: value } };

    case HandlerEnum.MENU_ACCORDION:
      return { menuSetting: { accordion: value } };

    case HandlerEnum.MENU_TRIGGER:
      return { menuSetting: { trigger: value } };

    case HandlerEnum.MENU_TOP_ALIGN:
      return { menuSetting: { topMenuAlign: value } };

    case HandlerEnum.MENU_COLLAPSED:
      return { menuSetting: { collapsed: value } };

    case HandlerEnum.MENU_WIDTH:
      return { menuSetting: { menuWidth: value } };

    case HandlerEnum.MENU_SHOW_SIDEBAR:
      return { menuSetting: { show: value } };

    case HandlerEnum.MENU_COLLAPSED_SHOW_TITLE:
      return { menuSetting: { collapsedShowTitle: value } };

    case HandlerEnum.MENU_THEME:
      updateSidebarBgColor(value);
      return { menuSetting: { bgColor: value } };

    case HandlerEnum.MENU_SPLIT:
      return { menuSetting: { split: value } };

    case HandlerEnum.MENU_CLOSE_MIX_SIDEBAR_ON_CHANGE:
      return { menuSetting: { closeMixSidebarOnChange: value } };

    case HandlerEnum.MENU_FIXED:
      return { menuSetting: { fixed: value } };

    case HandlerEnum.MENU_TRIGGER_MIX_SIDEBAR:
      return { menuSetting: { mixSideTrigger: value } };

    case HandlerEnum.MENU_FIXED_MIX_SIDEBAR:
      return { menuSetting: { mixSideFixed: value } };

    // ============transition==================
    case HandlerEnum.OPEN_PAGE_LOADING:
      appStore.setPageLoading(false);
      return { transitionSetting: { openPageLoading: value } };

    case HandlerEnum.ROUTER_TRANSITION:
      return { transitionSetting: { basicTransition: value } };

    case HandlerEnum.OPEN_ROUTE_TRANSITION:
      return { transitionSetting: { enable: value } };

    case HandlerEnum.OPEN_PROGRESS:
      return { transitionSetting: { openNProgress: value } };
    // ============root==================

    case HandlerEnum.LOCK_TIME:
      return { lockTime: value };

    case HandlerEnum.FULL_CONTENT:
      return { fullContent: value };

    case HandlerEnum.CONTENT_MODE:
      return { contentMode: value };

    case HandlerEnum.SHOW_BREADCRUMB:
      return { showBreadCrumb: value };

    case HandlerEnum.SHOW_BREADCRUMB_ICON:
      return { showBreadCrumbIcon: value };

    case HandlerEnum.GRAY_MODE:
      updateGrayMode(value);
      return { grayMode: value };

    case HandlerEnum.SHOW_FOOTER:
      return { showFooter: value };

    case HandlerEnum.COLOR_WEAK:
      updateColorWeak(value);
      return { colorWeak: value };

    case HandlerEnum.SHOW_LOGO:
      return { showLogo: value };

    // ============tabs==================
    case HandlerEnum.TABS_SHOW_QUICK:
      return { multiTabsSetting: { showQuick: value } };

    case HandlerEnum.TABS_SHOW:
      return { multiTabsSetting: { show: value } };

    case HandlerEnum.TABS_SHOW_REDO:
      return { multiTabsSetting: { showRedo: value } };

    case HandlerEnum.TABS_SHOW_FOLD:
      return { multiTabsSetting: { showFold: value } };

    // ============header==================
    case HandlerEnum.HEADER_THEME:
      updateHeaderBgColor(value);
      return { headerSetting: { bgColor: value } };

    case HandlerEnum.HEADER_SEARCH:
      return { headerSetting: { showSearch: value } };

    case HandlerEnum.HEADER_FIXED:
      return { headerSetting: { fixed: value } };

    case HandlerEnum.HEADER_SHOW:
      return { headerSetting: { show: value } };
    default:
      return {};
  }
}
