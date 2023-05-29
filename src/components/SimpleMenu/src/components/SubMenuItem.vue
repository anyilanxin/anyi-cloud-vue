<!--
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
 *   7.进行商用时，不得基于AnYi Cloud Vue的基础，修改包装而成一个与AnYi Zeebe EE、AnYi Cloud EE功能类似的程序，进行销售或发布，参与同类软件产品市场的竞争；
 *   8.本软件使用的第三方依赖皆为开源软件，如需要修改第三方源码请遵循第三方源码附带开源协议；
 *   9.本软件流程部分请遵循camunda开源协议：
 *     https://docs.camunda.org/manual/latest/introduction/third-party-libraries
 *     https://github.com/camunda/camunda-bpm-platform/blob/master/LICENSE
 *   10.若您的项目无法满足以上几点，可申请商业授权。
 -->
<template>
  <li :class="getClass">
    <template v-if="!getCollapse">
      <div :class="`${prefixCls}-submenu-title`" @click.stop="handleClick" :style="getItemStyle">
        <slot name="title"></slot>
        <Icon
          icon="eva:arrow-ios-downward-outline"
          :size="14"
          :class="`${prefixCls}-submenu-title-icon`"
        />
      </div>
      <CollapseTransition>
        <ul :class="prefixCls" v-show="opened">
          <slot></slot>
        </ul>
      </CollapseTransition>
    </template>

    <Popover
      placement="right"
      :overlayClassName="`${prefixCls}-menu-popover`"
      v-else
      :visible="getIsOpend"
      @visible-change="handleVisibleChange"
      :overlayStyle="getOverlayStyle"
      :align="{ offset: [0, 0] }"
    >
      <div :class="getSubClass" v-bind="getEvents(false)">
        <div
          :class="[
            {
              [`${prefixCls}-submenu-popup`]: !getParentSubMenu,
              [`${prefixCls}-submenu-collapsed-show-tit`]: collapsedShowTitle,
            },
          ]"
        >
          <slot name="title"></slot>
        </div>
        <Icon
          v-if="getParentSubMenu"
          icon="eva:arrow-ios-downward-outline"
          :size="14"
          :class="`${prefixCls}-submenu-title-icon`"
        />
      </div>
      <!-- eslint-disable-next-line -->
      <template #content v-show="opened">
        <div v-bind="getEvents(true)">
          <ul :class="[prefixCls, `${prefixCls}-${getTheme}`, `${prefixCls}-popup`]">
            <slot></slot>
          </ul>
        </div>
      </template>
    </Popover>
  </li>
</template>

<script lang="ts">
  import type { CSSProperties, PropType } from 'vue';
  import type { SubMenuProvider } from './types';
  import {
    defineComponent,
    computed,
    unref,
    getCurrentInstance,
    toRefs,
    reactive,
    provide,
    onBeforeMount,
    inject,
  } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { propTypes } from '/@/utils/propTypes';
  import { useMenuItem } from './useMenu';
  import { useSimpleRootMenuContext } from './useSimpleMenuContext';
  import { CollapseTransition } from '/@/components/Transition';
  import Icon from '/@/components/Icon';
  import { Popover } from 'ant-design-vue';
  import { isBoolean, isObject } from '/@/utils/is';
  import mitt from '/@/utils/mitt';

  const DELAY = 200;
  export default defineComponent({
    name: 'SubMenu',
    components: {
      Icon,
      CollapseTransition,
      Popover,
    },
    props: {
      name: {
        type: [String, Number] as PropType<string | number>,
        required: true,
      },
      disabled: propTypes.bool,
      collapsedShowTitle: propTypes.bool,
    },
    setup(props) {
      const instance = getCurrentInstance();

      const state = reactive({
        active: false,
        opened: false,
      });

      const data = reactive({
        timeout: null as TimeoutHandle | null,
        mouseInChild: false,
        isChild: false,
      });

      const { getParentSubMenu, getItemStyle, getParentMenu, getParentList } =
        useMenuItem(instance);

      const { prefixCls } = useDesign('menu');

      const subMenuEmitter = mitt();

      const { rootMenuEmitter } = useSimpleRootMenuContext();

      const {
        addSubMenu: parentAddSubmenu,
        removeSubMenu: parentRemoveSubmenu,
        removeAll: parentRemoveAll,
        getOpenNames: parentGetOpenNames,
        isRemoveAllPopup,
        sliceIndex,
        level,
        props: rootProps,
        handleMouseleave: parentHandleMouseleave,
      } = inject<SubMenuProvider>(`subMenu:${getParentMenu.value?.uid}`)!;

      const getClass = computed(() => {
        return [
          `${prefixCls}-submenu`,
          {
            [`${prefixCls}-item-active`]: state.active,
            [`${prefixCls}-opened`]: state.opened,
            [`${prefixCls}-submenu-disabled`]: props.disabled,
            [`${prefixCls}-submenu-has-parent-submenu`]: unref(getParentSubMenu),
            [`${prefixCls}-child-item-active`]: state.active,
          },
        ];
      });

      const getAccordion = computed(() => rootProps.accordion);
      const getCollapse = computed(() => rootProps.collapse);
      const getTheme = computed(() => rootProps.theme);

      const getOverlayStyle = computed((): CSSProperties => {
        return {
          minWidth: '200px',
        };
      });

      const getIsOpend = computed(() => {
        const name = props.name;
        if (unref(getCollapse)) {
          return parentGetOpenNames().includes(name);
        }
        return state.opened;
      });

      const getSubClass = computed(() => {
        const isActive = rootProps.activeSubMenuNames.includes(props.name);
        return [
          `${prefixCls}-submenu-title`,
          {
            [`${prefixCls}-submenu-active`]: isActive,
            [`${prefixCls}-submenu-active-border`]: isActive && level === 0,
            [`${prefixCls}-submenu-collapse`]: unref(getCollapse) && level === 0,
          },
        ];
      });

      function getEvents(deep: boolean) {
        if (!unref(getCollapse)) {
          return {};
        }
        return {
          onMouseenter: handleMouseenter,
          onMouseleave: () => handleMouseleave(deep),
        };
      }

      function handleClick() {
        const { disabled } = props;
        if (disabled || unref(getCollapse)) return;
        const opened = state.opened;

        if (unref(getAccordion)) {
          const { uidList } = getParentList();
          rootMenuEmitter.emit('on-update-opened', {
            opend: false,
            parent: instance?.parent,
            uidList: uidList,
          });
        } else {
          rootMenuEmitter.emit('open-name-change', {
            name: props.name,
            opened: !opened,
          });
        }
        state.opened = !opened;
      }

      function handleMouseenter() {
        const disabled = props.disabled;
        if (disabled) return;

        subMenuEmitter.emit('submenu:mouse-enter-child');

        const index = parentGetOpenNames().findIndex((item) => item === props.name);

        sliceIndex(index);

        const isRoot = level === 0 && parentGetOpenNames().length === 2;
        if (isRoot) {
          parentRemoveAll();
        }
        data.isChild = parentGetOpenNames().includes(props.name);
        clearTimeout(data.timeout!);
        data.timeout = setTimeout(() => {
          parentAddSubmenu(props.name);
        }, DELAY);
      }

      function handleMouseleave(deepDispatch = false) {
        const parentName = getParentMenu.value?.props.name;
        if (!parentName) {
          isRemoveAllPopup.value = true;
        }

        if (parentGetOpenNames().slice(-1)[0] === props.name) {
          data.isChild = false;
        }

        subMenuEmitter.emit('submenu:mouse-leave-child');
        if (data.timeout) {
          clearTimeout(data.timeout!);
          data.timeout = setTimeout(() => {
            if (isRemoveAllPopup.value) {
              parentRemoveAll();
            } else if (!data.mouseInChild) {
              parentRemoveSubmenu(props.name);
            }
          }, DELAY);
        }
        if (deepDispatch) {
          if (getParentSubMenu.value) {
            parentHandleMouseleave?.(true);
          }
        }
      }

      onBeforeMount(() => {
        subMenuEmitter.on('submenu:mouse-enter-child', () => {
          data.mouseInChild = true;
          isRemoveAllPopup.value = false;
          clearTimeout(data.timeout!);
        });
        subMenuEmitter.on('submenu:mouse-leave-child', () => {
          if (data.isChild) return;
          data.mouseInChild = false;
          clearTimeout(data.timeout!);
        });

        rootMenuEmitter.on(
          'on-update-opened',
          (data: boolean | (string | number)[] | Recordable) => {
            if (unref(getCollapse)) return;
            if (isBoolean(data)) {
              state.opened = data;
              return;
            }
            if (isObject(data) && rootProps.accordion) {
              const { opend, parent, uidList } = data as Recordable;
              if (parent === instance?.parent) {
                state.opened = opend;
              } else if (!uidList.includes(instance?.uid)) {
                state.opened = false;
              }
              return;
            }

            if (props.name && Array.isArray(data)) {
              state.opened = (data as (string | number)[]).includes(props.name);
            }
          },
        );

        rootMenuEmitter.on('on-update-active-name:submenu', (data: number[]) => {
          if (instance?.uid) {
            state.active = data.includes(instance?.uid);
          }
        });
      });

      function handleVisibleChange(visible: boolean) {
        state.opened = visible;
      }

      // provide
      provide<SubMenuProvider>(`subMenu:${instance?.uid}`, {
        addSubMenu: parentAddSubmenu,
        removeSubMenu: parentRemoveSubmenu,
        getOpenNames: parentGetOpenNames,
        removeAll: parentRemoveAll,
        isRemoveAllPopup,
        sliceIndex,
        level: level + 1,
        handleMouseleave,
        props: rootProps,
      });

      return {
        getClass,
        prefixCls,
        getCollapse,
        getItemStyle,
        handleClick,
        handleVisibleChange,
        getParentSubMenu,
        getOverlayStyle,
        getTheme,
        getIsOpend,
        getEvents,
        getSubClass,
        ...toRefs(state),
        ...toRefs(data),
      };
    },
  });
</script>
