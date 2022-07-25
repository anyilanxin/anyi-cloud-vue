1. src/layouts/default/tabs/index.less(全部替换)

```
@prefix-cls: ~'@{namespace}-multiple-tabs';

html[data-theme='dark'] {
  .@{prefix-cls} {
    .ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab{
      border: none ;
    }

    .ant-tabs.ant-tabs-card {
      .ant-tabs-card-bar {
        background-color: #000;
      }
    }

    .ant-tabs-extra-content {
      >span {
        background-color: #151515;
      }
    }
  }
}

html[data-theme='light'] {
  .@{prefix-cls} {
    // .ant-tabs-tab:not(.ant-tabs-tab-active) {
    //   border: 1px solid #d9d9d9 !important;
    // }
    .ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab{
        border: none ;
    }

    .ant-tabs.ant-tabs-card {
      .ant-tabs-card-bar {
        background-color: #f0f2f5;
      }
    }
  }
}

.@{prefix-cls} {
  z-index: 10;
  height: @multiple-height + 8;
  // border: 1px solid red;
  line-height: @multiple-height + 3;
  background-color: @component-background;
  // border-bottom: 1px solid @border-color-base;


  .ant-tabs-small {
    height: @multiple-height+8;
  }

  .ant-tabs.ant-tabs-card {
    .ant-tabs-card-bar {
      height: @multiple-height+8;
      margin: 0;
      border: 0;
      box-shadow: none;

      .ant-tabs-nav-container {
        height: @multiple-height+8;
        padding-top: 5px;
        padding-bottom: 5px;
      }

      .ant-tabs-tab-prev.ant-tabs-tab-arrow-show,
      .ant-tabs-tab-next.ant-tabs-tab-arrow-show {
        height: @multiple-height;
      }

      .ant-tabs-tab {
        height: calc(@multiple-height - 2px);
        padding-right: 12px;
        line-height: calc(@multiple-height - 2px);
        color: @text-color-base;
        background-color: @component-background;
        border-radius: @border-radius-base;
        transition: none;


        &:hover {
          .ant-tabs-close-x {
            opacity: 1;
          }
        }

        .ant-tabs-close-x {
          width: 8px;
          height: 12px;
          font-size: 12px;
          color: inherit;
          opacity: 0;
          transition: none;

          &:hover {
            svg {
              width: 0.8em;
            }
          }
        }

        >div {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        svg {
          fill: @text-color-base;
        }
      }

      .ant-tabs-tab:not(.ant-tabs-tab-active) {
        &:hover {
          color: @primary-color;
        }
      }

      .ant-tabs-tab-active {
        position: relative;
        padding-left: 18px;
        color: @white !important;
        background: @primary-color;
        border: 0;
        transition: none;

        .ant-tabs-close-x {
          opacity: 1;
        }

        svg {
          width: 0.7em;
          fill: @white;
        }
      }
    }

    .ant-tabs-nav>div:nth-child(1) {
      padding: 0 6px;
      // .ant-tabs-tab {
      //   margin-right: 3px !important;
      // }
    }
  }

  .ant-tabs-tab:not(.ant-tabs-tab-active) {
    .anticon-close {
      font-size: 12px;

      svg {
        width: 0.6em;
      }
    }
  }

  .ant-tabs-extra-content {
    line-height: calc(30px - 2px);

    >span {
      margin-left: 4px;
      background-color: #fff;
      border-radius: @border-radius-base;
    }
  }

  .ant-dropdown-trigger {
    display: inline-flex;
  }

  &--hide-close {
    .ant-tabs-close-x {
      opacity: 0 !important;
    }
  }

  &-content {

    &__extra-quick,
    &__extra-redo,
    &__extra-fold {
      display: inline-block;
      width: 36px;
      height: @multiple-height - 2px;
      line-height: @multiple-height;
      color: @text-color-secondary;
      text-align: center;
      cursor: pointer;


      &:hover {
        color: @text-color-base;
      }

      span[role='img'] {
        transform: rotate(90deg);
      }
    }

    &__extra-redo {
      span[role='img'] {
        transform: rotate(0deg);
      }
    }

    &__info {
      display: inline-block;
      width: 100%;
      height: @multiple-height - 2;
      padding-left: 0;
      margin-left: -10px;
      font-size: 12px;
      cursor: pointer;
      user-select: none;
    }
  }
}

```

2. src/locales/lang/zh_CN/layout.ts

```
multipleTab: {
    reload: '重新加载',
    close: '关闭标签页',
    closeLeft: '关闭左侧标签页',
    closeRight: '关闭右侧标签页',
    closeOther: '关闭其它标签页',
    closeAll: '关闭全部标签页',
  },
```

替换为

```
multipleTab: {
    reload: '重新加载',
    close: '关闭当前',
    closeLeft: '关闭左侧',
    closeRight: '关闭右侧',
    closeOther: '关闭其它',
    closeAll: '关闭全部',
  },
```

3. src/layouts/default/tabs/index.vue
   ```
   :tabBarGutter="3"
   ```
   替换为
   ```
   :tabBarGutter="6"
   ```
4. src/components/Application/src/search/AppSearchFooter.vue

   ```
   &-item 中禁用：
   // box-shadow: inset 0 -2px 0 0 #cdcde6, inset 0 0 1px 1px #fff,
   //   0 1px 2px 1px rgba(30, 35, 90, 0.4);
   ```

5. src/components/Application/src/search/AppSearchModal.vue

```
input改为：size="large"
禁用：&-input样式
&-content中border-radius: 16px;改为：border-radius: 6px;
```

6. src/layouts/default/sider/LayoutSider.vue

   ```
   &--fixed与&--mix中间加入：
   .ant-layout-sider-children {
      height: 101% !important;
    }
   ```

7. src/components/Form/src/hooks/useAdvanced.ts

   ```
   getAdvanced方法尾部增加actionSpan参数，同时计算使用nowItemColSum
   ```

8. src/components/Form/src/components/FormItem.vue

   ```
   if (!renderComponentContent) {
          return <Comp {...compAttr} />;
        }
   ```

   改为

   ```
   if (!renderComponentContent) {
          return <Comp {...compAttr} style="width: 100%" />;
        }
   ```

10. src/layouts/default/trigger/SiderTrigger.vue

```
图标换为:
<MenuUnfoldOutlined v-if="getCollapsed" />
 <MenuFoldOutlined v-else />
 同时div添加样式(暂时tailwind不生效):
 style="text-align: left; padding-left: 15px; font-size: 15px"
```

11. src/components/registerGlobComp.ts,增加全局注册组件
    ```
    InputNumber,
    Card,
    Image,
    Form,
    ```
12. 添加自定义图标支持 src/layouts/default/header/components/Breadcrumb.vue ``` <template>
  <div :class="[prefixCls, `${prefixCls}--${theme}`]">
    <a-breadcrumb :routes="routes">
      <template #itemRender="{ route, routes, paths }">
        <div style="display: inline-flex; align-items: center; flex-wrap: nowrap">
          <Icon
            :icon="getIcon(route)"
            v-if="getShowBreadCrumbIcon && getIcon(route) && getIconType(route) == 0"
          />
          <span
            v-else-if="getShowBreadCrumbIcon && getIcon(route) && getIconType(route) == 1"
            style="margin-right: 4px; display: inline-flex; align-items: center; flex-wrap: nowrap"
          >
            <a-image width="15px" height="15px" :src="getIcon(route)" />
          </span>
          <span v-if="!hasRedirect(routes, route)">
            {{ t(route.name || route.meta.title) }}
          </span>
          <router-link v-else to="" @click="handleClick(route, paths, $event)">
            {{ t(route.name || route.meta.title) }}
          </router-link>
        </div>
      </template>
    </a-breadcrumb>
  </div>
</template>
<script lang="ts">
  import type { RouteLocationMatched } from 'vue-router';
  import type { Menu } from '/@/router/types';

import { defineComponent, ref, watchEffect } from 'vue';

import { Breadcrumb } from 'ant-design-vue'; import Icon from '/@/components/Icon'; import { useDesign } from '/@/hooks/web/useDesign'; import { useRootSetting } from '/@/hooks/setting/useRootSetting'; import { useGo } from '/@/hooks/web/usePage'; import { useI18n } from '/@/hooks/web/useI18n'; import { useRouter } from 'vue-router';

import { propTypes } from '/@/utils/propTypes'; import { isString } from '/@/utils/is'; import { filter } from '/@/utils/helper/treeHelper'; import { getMenus } from '/@/router/menus';

import { REDIRECT_NAME } from '/@/router/constant'; import { getAllParentPath } from '/@/router/helper/menuHelper';

export default defineComponent({ name: 'LayoutBreadcrumb', components: { Icon, [Breadcrumb.name]: Breadcrumb }, props: { theme: propTypes.oneOf(['dark', 'light']), }, setup() { const routes = ref<RouteLocationMatched[]>([]); const { currentRoute } = useRouter(); const { prefixCls } = useDesign('layout-breadcrumb'); const { getShowBreadCrumbIcon } = useRootSetting(); const go = useGo();

      const { t } = useI18n();
      watchEffect(async () => {
        if (currentRoute.value.name === REDIRECT_NAME) return;
        const menus = await getMenus();

        const routeMatched = currentRoute.value.matched;
        const cur = routeMatched?.[routeMatched.length - 1];
        let path = currentRoute.value.path;

        if (cur && cur?.meta?.currentActiveMenu) {
          path = cur.meta.currentActiveMenu as string;
        }

        const parent = getAllParentPath(menus, path);
        const filterMenus = menus.filter((item) => item.path === parent[0]);
        const matched = getMatched(filterMenus, parent) as any;

        if (!matched || matched.length === 0) return;

        const breadcrumbList = filterItem(matched);

        if (currentRoute.value.meta?.currentActiveMenu) {
          breadcrumbList.push({
            ...currentRoute.value,
            name: currentRoute.value.meta?.title || currentRoute.value.name,
          } as unknown as RouteLocationMatched);
        }
        routes.value = breadcrumbList;
      });

      function getMatched(menus: Menu[], parent: string[]) {
        const metched: Menu[] = [];
        menus.forEach((item) => {
          if (parent.includes(item.path)) {
            metched.push({
              ...item,
              name: item.meta?.title || item.name,
            });
          }
          if (item.children?.length) {
            metched.push(...getMatched(item.children, parent));
          }
        });
        return metched;
      }

      function filterItem(list: RouteLocationMatched[]) {
        let resultList = filter(list, (item) => {
          const { meta, name } = item;
          if (!meta) {
            return !!name;
          }
          const { title, hideBreadcrumb, hideMenu } = meta;
          if (!title || hideBreadcrumb || hideMenu) {
            return false;
          }
          return true;
        }).filter((item) => !item.meta?.hideBreadcrumb || !item.meta?.hideMenu);

        return resultList;
      }

      function handleClick(route: RouteLocationMatched, paths: string[], e: Event) {
        e?.preventDefault();
        const { children, redirect, meta } = route;

        if (children?.length && !redirect) {
          e?.stopPropagation();
          return;
        }
        if (meta?.carryParam) {
          return;
        }

        if (redirect && isString(redirect)) {
          go(redirect);
        } else {
          let goPath = '';
          if (paths.length === 1) {
            goPath = paths[0];
          } else {
            const ps = paths.slice(1);
            const lastPath = ps.pop() || '';
            goPath = `${lastPath}`;
          }
          goPath = /^\//.test(goPath) ? goPath : `/${goPath}`;
          go(goPath);
        }
      }

      function hasRedirect(routes: RouteLocationMatched[], route: RouteLocationMatched) {
        if (routes.indexOf(route) === routes.length - 1) {
          return false;
        }
        return true;
      }

      function getIcon(route) {
        return route.icon || route.meta?.icon;
      }

      function getIconType(route) {
        return route.meta?.iconType || 0;
      }

      return {
        routes,
        t,
        prefixCls,
        getIcon,
        getIconType,
        getShowBreadCrumbIcon,
        handleClick,
        hasRedirect,
      };
    },

}); </script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-breadcrumb';

  .@{prefix-cls} {
    display: flex;
    padding: 0 8px;
    align-items: center;

    .ant-breadcrumb-link {
      .anticon {
        margin-right: 4px;
        margin-bottom: 2px;
      }
    }

    &--light {
      .ant-breadcrumb-link {
        color: @breadcrumb-item-normal-color;

        a {
          color: rgba(0, 0, 0, 0.65);

          &:hover {
            color: @primary-color;
          }
        }
      }

      .ant-breadcrumb-separator {
        color: @breadcrumb-item-normal-color;
      }
    }

    &--dark {
      .ant-breadcrumb-link {
        color: rgba(255, 255, 255, 0.6);

        a {
          color: rgba(255, 255, 255, 0.8);

          &:hover {
            color: @white;
          }
        }
      }

      .ant-breadcrumb-separator,
      .anticon {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
</style>

    ```

    src/components/Menu/src/components/MenuItemContent.vue

    ```
    <template>

  <span :class="`${prefixCls}- flex items-center `">
    <Icon
      v-if="getIcon && getIconType == 0"
      :icon="getIcon"
      :size="18"
      :class="`${prefixCls}-wrapper__icon mr-2`"
    />
    <div
      :class="`${prefixCls}-wrapper__icon mr-2`"
      v-else-if="getIcon && getIconType == 1"
      style="display: -webkit-flex; display: flex; align-items: center"
    >
      <a-image width="18px" height="18px" :src="getIcon" />
    </div>
    {{ getI18nName }}
  </span>
</template>
<script lang="ts">
  import { computed, defineComponent } from 'vue';

import Icon from '/@/components/Icon/index'; import { useI18n } from '/@/hooks/web/useI18n'; import { useDesign } from '/@/hooks/web/useDesign'; import { contentProps } from '../props'; const { t } = useI18n();

export default defineComponent({ name: 'MenuItemContent', components: { Icon, }, props: contentProps, setup(props) { const { prefixCls } = useDesign('basic-menu-item-content'); const getI18nName = computed(() => t(props.item?.name)); const getIconType = computed(() => props.item?.iconType || 0); const getIcon = computed(() => props.item?.icon);

      return {
        prefixCls,
        getI18nName,
        getIcon,
        getIconType,
      };
    },

}); </script>

    ```

    src/components/SimpleMenu/src/SimpleSubMenu.vue

    ```
    <template>

  <MenuItem
    :name="item.path"
    v-if="!menuHasChildren(item) && getShowMenu"
    v-bind="$props"
    :class="getLevelClass"
  >
    <Icon v-if="getIcon" :icon="getIcon" :size="16" />
    <div v-if="collapsedShowTitle && getIsCollapseParent" class="mt-1 collapse-title">
      {{ getI18nName }}
    </div>
    <template #title>
      <span :class="['ml-2', `${prefixCls}-sub-title`]"> {{ getI18nName }}</span>
      <SimpleMenuTag :item="item" :collapseParent="getIsCollapseParent" />
    </template>
  </MenuItem>
  <SubMenu
    :name="item.path"
    v-if="menuHasChildren(item) && getShowMenu"
    :class="[getLevelClass, theme]"
    :collapsedShowTitle="collapsedShowTitle"
  >
    <template #title>
      <div style="display: -webkit-flex; display: flex; align-items: center">
        <Icon v-if="getIcon && getIconType == 0" :icon="getIcon" :size="16" />
        <a-image
          v-else-if="getIcon && getIconType == 1"
          width="16px"
          height="16px"
          :src="getIcon"
        />
        <span
          v-else-if="!getIcon && !getShowSubTitle && !collapsedShowTitle"
          style="
            padding-left: 6px;
            margin-right: 5px;
            width: 45px;
            overflow: hidden;
            text-overflow: clip;
            white-space: nowrap;
          "
          >{{ getI18nName }}</span
        >
        <div v-if="collapsedShowTitle && getIsCollapseParent" class="mt-2 collapse-title">
          {{ getI18nName }}
        </div>
        <span v-show="getShowSubTitle" :class="['ml-2', `${prefixCls}-sub-title`]">
          {{ getI18nName }}
        </span>
        <SimpleMenuTag :item="item" :collapseParent="!!collapse && !!parent" />
      </div>
    </template>
    <template v-for="childrenItem in item.children || []" :key="childrenItem.path">
      <SimpleSubMenu v-bind="$props" :item="childrenItem" :parent="false" />
    </template>
  </SubMenu>
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import type { Menu } from '/@/router/types';
  import { defineComponent, computed } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import Icon from '/@/components/Icon/index';

import MenuItem from './components/MenuItem.vue'; import SubMenu from './components/SubMenuItem.vue'; import { propTypes } from '/@/utils/propTypes'; import { useI18n } from '/@/hooks/web/useI18n'; import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

export default defineComponent({ name: 'SimpleSubMenu', components: { SubMenu, MenuItem, SimpleMenuTag: createAsyncComponent(() => import('./SimpleMenuTag.vue')), Icon, }, props: { item: { type: Object as PropType<Menu>, default: () => ({}), }, parent: propTypes.bool, collapsedShowTitle: propTypes.bool, collapse: propTypes.bool, theme: propTypes.oneOf(['dark', 'light']), }, setup(props) { const { t } = useI18n(); const { prefixCls } = useDesign('simple-menu');

      const getShowMenu = computed(() => !props.item?.meta?.hideMenu);
      const getIcon = computed(() => props.item?.icon);
      const getIconType = computed(() => props.item?.iconType || 0);
      const getI18nName = computed(() => t(props.item?.name));
      const getShowSubTitle = computed(() => !props.collapse || !props.parent);
      const getIsCollapseParent = computed(() => !!props.collapse && !!props.parent);
      const getLevelClass = computed(() => {
        return [
          {
            [`${prefixCls}__parent`]: props.parent,
            [`${prefixCls}__children`]: !props.parent,
          },
        ];
      });

      function menuHasChildren(menuTreeItem: Menu): boolean {
        return (
          !menuTreeItem.meta?.hideChildrenInMenu &&
          Reflect.has(menuTreeItem, 'children') &&
          !!menuTreeItem.children &&
          menuTreeItem.children.length > 0
        );
      }

      return {
        prefixCls,
        menuHasChildren,
        getShowMenu,
        getIcon,
        getIconType,
        getI18nName,
        getShowSubTitle,
        getLevelClass,
        getIsCollapseParent,
      };
    },

}); </script>

    ```

    src/router/types.ts中Menu增加

    ```
    // 0-系统图标(基于icon),1-自定义图标(基于图片路径)

iconType?: number; ```

    src/layouts/default/sider/MixSider.vue

    ```
    <template>

  <div :class="`${prefixCls}-dom`" :style="getDomStyle"></div>
  <div
    v-click-outside="handleClickOutside"
    :style="getWrapStyle"
    :class="[
      prefixCls,
      getMenuTheme,
      {
        open: openMenu,
        mini: getCollapsed,
      },
    ]"
    v-bind="getMenuEvents"
  >
    <AppLogo :showTitle="false" :class="`${prefixCls}-logo`" />

    <Trigger :class="`${prefixCls}-trigger`" />

    <ScrollContainer>
      <ul :class="`${prefixCls}-module`">
        <li
          :class="[
            `${prefixCls}-module__item `,
            {
              [`${prefixCls}-module__item--active`]: item.path === activePath,
            },
          ]"
          v-bind="getItemEvents(item)"
          v-for="item in menuModules"
          :key="item.path"
        >
          <SimpleMenuTag :item="item" collapseParent dot />
          <Icon
            :class="`${prefixCls}-module__icon`"
            :size="getCollapsed ? 16 : 20"
            v-if="item.meta.icon && (!item.iconType || item.iconType == 0)"
            :icon="item.icon || (item.meta && item.meta.icon)"
          />
          <a-image
            v-else-if="item.meta.icon && item.iconType == 1"
            :width="getCollapsed ? '16px' : '20px'"
            :height="getCollapsed ? '16px' : '20px'"
            :src="item.meta.icon"
          />
          <span
            v-else-if="!item.meta.icon && getCollapsed"
            style="
              padding-left: 6px;
              margin-right: 5px;
              width: 45px;
              overflow: hidden;
              text-overflow: clip;
              white-space: nowrap;
            "
            >{{ t(item.name) }}</span
          >
          <p :class="`${prefixCls}-module__name`">
            {{ t(item.name) }}
          </p>
        </li>
      </ul>
    </ScrollContainer>

    <div :class="`${prefixCls}-menu-list`" ref="sideRef" :style="getMenuStyle">
      <div
        v-show="openMenu"
        :class="[
          `${prefixCls}-menu-list__title`,
          {
            show: openMenu,
          },
        ]"
      >
        <span class="text"> {{ title }}</span>
        <Icon
          :size="16"
          :icon="getMixSideFixed ? 'ri:pushpin-2-fill' : 'ri:pushpin-2-line'"
          class="pushpin"
          @click="handleFixedMenu"
        />
      </div>
      <ScrollContainer :class="`${prefixCls}-menu-list__content`">
        <SimpleMenu
          :items="chilrenMenus"
          :theme="getMenuTheme"
          mixSider
          @menuClick="handleMenuClick"
        />
      </ScrollContainer>
      <div
        v-show="getShowDragBar && openMenu"
        :class="`${prefixCls}-drag-bar`"
        ref="dragBarRef"
      ></div>
    </div>

  </div>
</template>
<script lang="ts">
  import type { Menu } from '/@/router/types';
  import type { CSSProperties } from 'vue';
  import type { RouteLocationNormalized } from 'vue-router';
  import { defineComponent, onMounted, ref, computed, unref } from 'vue';
  import { ScrollContainer } from '/@/components/Container';
  import { SimpleMenuTag } from '/@/components/SimpleMenu';
  import { Icon } from '/@/components/Icon';
  import { AppLogo } from '/@/components/Application';
  import Trigger from '../trigger/HeaderTrigger.vue';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useDragLine } from './useLayoutSider';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useGo } from '/@/hooks/web/usePage';
  import { SIDE_BAR_SHOW_TIT_MINI_WIDTH, SIDE_BAR_MINI_WIDTH } from '/@/enums/appEnum';
  import clickOutside from '/@/directives/clickOutside';
  import { getShallowMenus, getChildrenMenus, getCurrentParentPath } from '/@/router/menus';
  import { listenerRouteChange } from '/@/logics/mitt/routeChange';
  import { SimpleMenu } from '/@/components/SimpleMenu';

export default defineComponent({ name: 'LayoutMixSider', components: { ScrollContainer, AppLogo, SimpleMenu, Icon, Trigger, SimpleMenuTag, }, directives: { clickOutside, }, setup() { let menuModules = ref<Menu[]>([]); const activePath = ref(''); const chilrenMenus = ref<Menu[]>([]); const openMenu = ref(false); const dragBarRef = ref<ElRef>(null); const sideRef = ref<ElRef>(null); const currentRoute = ref<Nullable<RouteLocationNormalized>>(null);

      const { prefixCls } = useDesign('layout-mix-sider');
      const go = useGo();
      const { t } = useI18n();
      const {
        getMenuWidth,
        getCanDrag,
        getCloseMixSidebarOnChange,
        getMenuTheme,
        getMixSideTrigger,
        getRealWidth,
        getMixSideFixed,
        mixSideHasChildren,
        setMenuSetting,
        getIsMixSidebar,
        getCollapsed,
      } = useMenuSetting();

      const { title } = useGlobSetting();

      useDragLine(sideRef, dragBarRef, true);

      const getMenuStyle = computed((): CSSProperties => {
        return {
          width: unref(openMenu) ? `${unref(getMenuWidth)}px` : 0,
          left: `${unref(getMixSideWidth)}px`,
        };
      });

      const getIsFixed = computed(() => {
        /* eslint-disable-next-line */
        mixSideHasChildren.value = unref(chilrenMenus).length > 0;
        const isFixed = unref(getMixSideFixed) && unref(mixSideHasChildren);
        if (isFixed) {
          /* eslint-disable-next-line */
          openMenu.value = true;
        }
        return isFixed;
      });

      const getMixSideWidth = computed(() => {
        return unref(getCollapsed) ? SIDE_BAR_MINI_WIDTH : SIDE_BAR_SHOW_TIT_MINI_WIDTH;
      });

      const getDomStyle = computed((): CSSProperties => {
        const fixedWidth = unref(getIsFixed) ? unref(getRealWidth) : 0;
        const width = `${unref(getMixSideWidth) + fixedWidth}px`;
        return getWrapCommonStyle(width);
      });

      const getWrapStyle = computed((): CSSProperties => {
        const width = `${unref(getMixSideWidth)}px`;
        return getWrapCommonStyle(width);
      });

      const getMenuEvents = computed(() => {
        return !unref(getMixSideFixed)
          ? {
              onMouseleave: () => {
                closeMenu();
              },
            }
          : {};
      });

      const getShowDragBar = computed(() => unref(getCanDrag));

      onMounted(async () => {
        menuModules.value = await getShallowMenus();
      });

      listenerRouteChange((route) => {
        currentRoute.value = route;
        setActive(true);
        if (unref(getCloseMixSidebarOnChange)) {
          closeMenu();
        }
      });

      function getWrapCommonStyle(width: string): CSSProperties {
        return {
          width,
          maxWidth: width,
          minWidth: width,
          flex: `0 0 ${width}`,
        };
      }

      // Process module menu click
      async function hanldeModuleClick(path: string, hover = false) {
        const children = await getChildrenMenus(path);

        if (unref(activePath) === path) {
          if (!hover) {
            if (!unref(openMenu)) {
              openMenu.value = true;
            } else {
              closeMenu();
            }
          }
          if (!unref(openMenu)) {
            setActive();
          }
        } else {
          openMenu.value = true;
          activePath.value = path;
        }

        if (!children || children.length === 0) {
          go(path);
          chilrenMenus.value = [];
          closeMenu();
          return;
        }
        chilrenMenus.value = children;
      }

      // Set the currently active menu and submenu
      async function setActive(setChildren = false) {
        const path = currentRoute.value?.path;
        if (!path) return;
        const parentPath = await getCurrentParentPath(path);
        activePath.value = parentPath;
        // hanldeModuleClick(parentPath);
        if (unref(getIsMixSidebar)) {
          const activeMenu = unref(menuModules).find((item) => item.path === unref(activePath));
          const p = activeMenu?.path;
          if (p) {
            const children = await getChildrenMenus(p);
            if (setChildren) {
              chilrenMenus.value = children;

              if (unref(getMixSideFixed)) {
                openMenu.value = children.length > 0;
              }
            }
            if (children.length === 0) {
              chilrenMenus.value = [];
            }
          }
        }
      }

      function handleMenuClick(path: string) {
        go(path);
      }

      function handleClickOutside() {
        setActive(true);
        closeMenu();
      }

      function getItemEvents(item: Menu) {
        if (unref(getMixSideTrigger) === 'hover') {
          return {
            onMouseenter: () => hanldeModuleClick(item.path, true),
          };
        }
        return {
          onClick: () => hanldeModuleClick(item.path),
        };
      }

      function handleFixedMenu() {
        setMenuSetting({
          mixSideFixed: !unref(getIsFixed),
        });
      }

      // Close menu
      function closeMenu() {
        if (!unref(getIsFixed)) {
          openMenu.value = false;
        }
      }

      return {
        t,
        prefixCls,
        menuModules,
        hanldeModuleClick,
        activePath,
        chilrenMenus,
        getShowDragBar,
        handleMenuClick,
        getMenuStyle,
        handleClickOutside,
        sideRef,
        dragBarRef,
        title,
        openMenu,
        getMenuTheme,
        getItemEvents,
        getMenuEvents,
        getDomStyle,
        handleFixedMenu,
        getMixSideFixed,
        getWrapStyle,
        getCollapsed,
      };
    },

}); </script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-mix-sider';
  @width: 80px;
  .@{prefix-cls} {
    position: fixed;
    top: 0;
    left: 0;
    z-index: @layout-mix-sider-fixed-z-index;
    height: 100%;
    overflow: hidden;
    background-color: @sider-dark-bg-color;
    transition: all 0.2s ease 0s;

    &-dom {
      height: 100%;
      overflow: hidden;
      transition: all 0.2s ease 0s;
    }

    &-logo {
      display: flex;
      height: @header-height;
      padding-left: 0 !important;
      justify-content: center;

      img {
        width: @logo-width;
        height: @logo-width;
      }
    }

    &.light {
      .@{prefix-cls}-logo {
        border-bottom: 1px solid rgb(238, 238, 238);
      }

      &.open {
        > .scrollbar {
          border-right: 1px solid rgb(238, 238, 238);
        }
      }

      .@{prefix-cls}-module {
        &__item {
          font-weight: normal;
          color: rgba(0, 0, 0, 0.65);

          &--active {
            color: @primary-color;
            background-color: unset;
          }
        }
      }
      .@{prefix-cls}-menu-list {
        &__content {
          box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.1);
        }

        &__title {
          .pushpin {
            color: rgba(0, 0, 0, 0.35);

            &:hover {
              color: rgba(0, 0, 0, 0.85);
            }
          }
        }
      }
    }
    @border-color: @sider-dark-lighten-bg-color;

    &.dark {
      &.open {
        .@{prefix-cls}-logo {
          // border-bottom: 1px solid @border-color;
        }

        > .scrollbar {
          border-right: 1px solid @border-color;
        }
      }
      .@{prefix-cls}-menu-list {
        background-color: @sider-dark-bg-color;

        &__title {
          color: @white;
          border-bottom: none;
          border-bottom: 1px solid @border-color;
        }
      }
    }

    > .scrollbar {
      height: calc(100% - @header-height - 38px);
    }

    &.mini &-module {
      &__name {
        display: none;
      }

      &__icon {
        margin-bottom: 0;
      }
    }

    &-module {
      position: relative;
      padding-top: 1px;

      &__item {
        position: relative;
        padding: 12px 0;
        color: rgba(255, 255, 255, 0.65);
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          color: @white;
        }
        // &:hover,
        &--active {
          font-weight: 700;
          color: @white;
          background-color: @sider-dark-darken-bg-color;

          &::before {
            position: absolute;
            top: 0;
            left: 0;
            width: 3px;
            height: 100%;
            background-color: @primary-color;
            content: '';
          }
        }
      }

      &__icon {
        margin-bottom: 8px;
        font-size: 24px;
        transition: all 0.2s;
      }

      &__name {
        margin-bottom: 0;
        font-size: 12px;
        transition: all 0.2s;
      }
    }

    &-trigger {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 6px;
      padding-left: 12px;
      font-size: 18px;
      color: rgba(255, 255, 255, 0.65);
      cursor: pointer;
      background-color: @sider-dark-bg-color;
    }

    &.light &-trigger {
      color: rgba(0, 0, 0, 0.65);
      background-color: #fff;
    }

    &-menu-list {
      position: fixed;
      top: 0;
      width: 0;
      width: 200px;
      height: calc(100%);
      background-color: #fff;
      transition: all 0.2s;

      &__title {
        display: flex;
        height: @header-height;
        // margin-left: -6px;
        font-size: 18px;
        color: @primary-color;
        border-bottom: 1px solid rgb(238, 238, 238);
        opacity: 0;
        transition: unset;
        align-items: center;
        justify-content: space-between;

        &.show {
          min-width: 130px;
          opacity: 1;
          transition: all 0.5s ease;
        }

        .pushpin {
          margin-right: 6px;
          color: rgba(255, 255, 255, 0.65);
          cursor: pointer;

          &:hover {
            color: #fff;
          }
        }
      }

      &__content {
        height: calc(100% - @header-height) !important;

        .scrollbar__wrap {
          height: 100%;
          overflow-x: hidden;
        }

        .scrollbar__bar.is-horizontal {
          display: none;
        }

        .ant-menu {
          height: 100%;
        }

        .ant-menu-inline,
        .ant-menu-vertical,
        .ant-menu-vertical-left {
          border-right: 1px solid transparent;
        }
      }
    }

    &-drag-bar {
      position: absolute;
      top: 50px;
      right: -1px;
      width: 1px;
      height: calc(100% - 50px);
      cursor: ew-resize;
      background-color: #f8f8f9;
      border-top: none;
      border-bottom: none;
      box-shadow: 0 0 4px 0 rgba(28, 36, 56, 0.15);
    }
  }
</style>

    ```

src/components/SimpleMenu/src/SimpleSubMenu.vue

```
<template>
  <MenuItem
    :name="item.path"
    v-if="!menuHasChildren(item) && getShowMenu"
    v-bind="$props"
    :class="getLevelClass"
  >
    <Icon v-if="getIcon && getIconType == 0" :icon="getIcon" :size="16" />
    <a-image width="16px" height="16px" :src="getIcon" v-else-if="getIcon && getIconType == 1" />
    <span
      v-else-if="!getIcon && !getShowSubTitle && !collapsedShowTitle"
      style="
        padding-left: 6px;
        margin-right: 5px;
        width: 45px;
        overflow: hidden;
        text-overflow: clip;
        white-space: nowrap;
      "
      >{{ getI18nName }}</span
    >
    <div v-if="collapsedShowTitle && getIsCollapseParent" class="mt-1 collapse-title">
      {{ getI18nName }}
    </div>
    <template #title>
      <span :class="['ml-2', `${prefixCls}-sub-title`]"> {{ getI18nName }}</span>
      <SimpleMenuTag :item="item" :collapseParent="getIsCollapseParent" />
    </template>
  </MenuItem>
  <SubMenu
    :name="item.path"
    v-if="menuHasChildren(item) && getShowMenu"
    :class="[getLevelClass, theme]"
    :collapsedShowTitle="collapsedShowTitle"
  >
    <template #title>
      <div style="display: -webkit-flex; display: flex; align-items: center">
        <Icon v-if="getIcon && getIconType == 0" :icon="getIcon" :size="16" />
        <a-image
          v-else-if="getIcon && getIconType == 1"
          width="16px"
          height="16px"
          :src="getIcon"
        />
        <span
          v-else-if="!getIcon && !getShowSubTitle && !collapsedShowTitle"
          style="
            padding-left: 6px;
            margin-right: 5px;
            width: 45px;
            overflow: hidden;
            text-overflow: clip;
            white-space: nowrap;
          "
          >{{ getI18nName }}</span
        >
        <div v-if="collapsedShowTitle && getIsCollapseParent" class="mt-2 collapse-title">
          {{ getI18nName }}
        </div>
        <span v-show="getShowSubTitle" :class="['ml-2', `${prefixCls}-sub-title`]">
          {{ getI18nName }}
        </span>
        <SimpleMenuTag :item="item" :collapseParent="!!collapse && !!parent" />
      </div>
    </template>
    <template v-for="childrenItem in item.children || []" :key="childrenItem.path">
      <SimpleSubMenu v-bind="$props" :item="childrenItem" :parent="false" />
    </template>
  </SubMenu>
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import type { Menu } from '/@/router/types';
  import { defineComponent, computed } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import Icon from '/@/components/Icon/index';

  import MenuItem from './components/MenuItem.vue';
  import SubMenu from './components/SubMenuItem.vue';
  import { propTypes } from '/@/utils/propTypes';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

  export default defineComponent({
    name: 'SimpleSubMenu',
    components: {
      SubMenu,
      MenuItem,
      SimpleMenuTag: createAsyncComponent(() => import('./SimpleMenuTag.vue')),
      Icon,
    },
    props: {
      item: {
        type: Object as PropType<Menu>,
        default: () => ({}),
      },
      parent: propTypes.bool,
      collapsedShowTitle: propTypes.bool,
      collapse: propTypes.bool,
      theme: propTypes.oneOf(['dark', 'light']),
    },
    setup(props) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('simple-menu');

      const getShowMenu = computed(() => !props.item?.meta?.hideMenu);
      const getIcon = computed(() => props.item?.icon);
      const getIconType = computed(() => props.item?.iconType || 0);
      const getI18nName = computed(() => t(props.item?.name));
      const getShowSubTitle = computed(() => !props.collapse || !props.parent);
      const getIsCollapseParent = computed(() => !!props.collapse && !!props.parent);
      const getLevelClass = computed(() => {
        return [
          {
            [`${prefixCls}__parent`]: props.parent,
            [`${prefixCls}__children`]: !props.parent,
          },
        ];
      });

      function menuHasChildren(menuTreeItem: Menu): boolean {
        return (
          !menuTreeItem.meta?.hideChildrenInMenu &&
          Reflect.has(menuTreeItem, 'children') &&
          !!menuTreeItem.children &&
          menuTreeItem.children.length > 0
        );
      }

      return {
        prefixCls,
        menuHasChildren,
        getShowMenu,
        getIcon,
        getIconType,
        getI18nName,
        getShowSubTitle,
        getLevelClass,
        getIsCollapseParent,
      };
    },
  });
</script>

```

13. 新增加依赖(切换到 skillfull admin)

```
yarn add bpmn-js bpmn-js-properties-panel camunda-bpmn-moddle diagram-js-minimap wangeditor jsencrypt  crypto-js
```
14. tree添加支持直接solt title(src/components/Tree/src/Tree.vue)
```
return (
            <Tree.TreeNode {...propsData} node={toRaw(item)} key={get(item, keyField)}>
              {{
                title: () => (
                  <span
                    class={`${prefixCls}-title pl-2`}
                    onClick={handleClickNode.bind(null, item[keyField], item[childrenField])}
                  >
                    {item.slots?.title ? (
                      getSlot(slots, item.slots?.title, item)
                    ) : (
                      <>
                        {icon && <TreeIcon icon={icon} />}
                        {titleDom}
                        {/*{get(item, titleField)}*/}
                        <span class={`${prefixCls}__actions`}>
                          {renderAction({ ...item, level })}
                        </span>
                      </>
                    )}
                  </span>
                ),
                default: () => renderTreeNode({ data: children, level: level + 1 }),
              }}
            </Tree.TreeNode>
          );
```
替换为
```
return (
            <Tree.TreeNode {...propsData} node={toRaw(item)} key={get(item, keyField)}>
              {{
                title: () => (
                  <span
                    class={`${prefixCls}-title pl-2`}
                    onClick={handleClickNode.bind(null, item[keyField], item[childrenField])}
                  >
                    {slots?.title ? (
                      getSlot(slots, 'title', item)
                    ) : item.slots?.title ? (
                      getSlot(slots, item.slots?.title, item)
                    ) : (
                      <>
                        {icon && <TreeIcon icon={icon} />}
                        {titleDom}
                        {/*{get(item, titleField)}*/}
                        <span class={`${prefixCls}__actions`}>
                          {renderAction({ ...item, level })}
                        </span>
                      </>
                    )}
                  </span>
                ),
                default: () => renderTreeNode({ data: children, level: level + 1 }),
              }}
            </Tree.TreeNode>
          );
```