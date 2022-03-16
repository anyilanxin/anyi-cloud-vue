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
      item: { type: Object as PropType<Menu>, default: () => ({}) },
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
