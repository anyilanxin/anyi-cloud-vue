<!--
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
 *   4.分发源码时候，请注明软件出处 https://github.com/anyilanxin/anyi-cloud-vue；
 *   5.在修改包名，模块名称，项目代码等时，请注明软件出处 https://github.com/anyilanxin/anyi-cloud-vue；
 *   6.本软件不允许在国家法律规定范围外使用，如出现违法行为原作者本人不承担任何法律风险；
 *   7.进行商用时，不得基于AnYi Cloud Vue的基础，修改包装而成一个与AnYi Zeebe EE、AnYi Cloud EE、AnYi Cloud EE Vue功能类似的程序，进行销售或发布，参与同类软件产品市场的竞争；
 *   8.本软件使用的第三方依赖皆为开源软件，如需要修改第三方源码请遵循第三方源码附带开源协议；
 *   9.本软件中使用了bpmn js,使用请遵循bpmn.io开源协议：
 *     https://github.com/bpmn-io/bpmn-js/blob/develop/LICENSE
 *   10.若您的项目无法满足以上几点，可申请商业授权。
 -->
<template>
  <ul :class="getClass">
    <slot></slot>
  </ul>
</template>

<script lang="ts">
  import type { PropType } from 'vue';
  import type { SubMenuProvider } from './types';
  import {
    defineComponent,
    ref,
    computed,
    onMounted,
    watchEffect,
    watch,
    nextTick,
    getCurrentInstance,
    provide,
  } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { propTypes } from '/@/utils/propTypes';
  import { createSimpleRootMenuContext } from './useSimpleMenuContext';
  import mitt from '/@/utils/mitt';
  export default defineComponent({
    name: 'Menu',
    props: {
      theme: propTypes.oneOf(['light', 'dark']).def('light'),
      activeName: propTypes.oneOfType([propTypes.string, propTypes.number]),
      openNames: {
        type: Array as PropType<string[]>,
        default: () => [],
      },
      accordion: propTypes.bool.def(true),
      width: propTypes.string.def('100%'),
      collapsedWidth: propTypes.string.def('48px'),
      indentSize: propTypes.number.def(16),
      collapse: propTypes.bool.def(true),
      activeSubMenuNames: {
        type: Array as PropType<(string | number)[]>,
        default: () => [],
      },
    },
    emits: ['select', 'open-change'],
    setup(props, { emit }) {
      const rootMenuEmitter = mitt();
      const instance = getCurrentInstance();

      const currentActiveName = ref<string | number>('');
      const openedNames = ref<string[]>([]);

      const { prefixCls } = useDesign('menu');

      const isRemoveAllPopup = ref(false);

      createSimpleRootMenuContext({
        rootMenuEmitter: rootMenuEmitter,
        activeName: currentActiveName,
      });

      const getClass = computed(() => {
        const { theme } = props;
        return [
          prefixCls,
          `${prefixCls}-${theme}`,
          `${prefixCls}-vertical`,
          {
            [`${prefixCls}-collapse`]: props.collapse,
          },
        ];
      });

      watchEffect(() => {
        openedNames.value = props.openNames;
      });

      watchEffect(() => {
        if (props.activeName) {
          currentActiveName.value = props.activeName;
        }
      });

      watch(
        () => props.openNames,
        () => {
          nextTick(() => {
            updateOpened();
          });
        },
      );

      function updateOpened() {
        rootMenuEmitter.emit('on-update-opened', openedNames.value);
      }

      function addSubMenu(name: string) {
        if (openedNames.value.includes(name)) return;
        openedNames.value.push(name);
        updateOpened();
      }

      function removeSubMenu(name: string) {
        openedNames.value = openedNames.value.filter((item) => item !== name);
        updateOpened();
      }

      function removeAll() {
        openedNames.value = [];
        updateOpened();
      }

      function sliceIndex(index: number) {
        if (index === -1) return;
        openedNames.value = openedNames.value.slice(0, index + 1);
        updateOpened();
      }

      provide<SubMenuProvider>(`subMenu:${instance?.uid}`, {
        addSubMenu,
        removeSubMenu,
        getOpenNames: () => openedNames.value,
        removeAll,
        isRemoveAllPopup,
        sliceIndex,
        level: 0,
        props: props as any,
      });

      onMounted(() => {
        openedNames.value = !props.collapse ? [...props.openNames] : [];
        updateOpened();
        rootMenuEmitter.on('on-menu-item-select', (name: string) => {
          currentActiveName.value = name;

          nextTick(() => {
            props.collapse && removeAll();
          });
          emit('select', name);
        });

        rootMenuEmitter.on('open-name-change', ({ name, opened }) => {
          if (opened && !openedNames.value.includes(name)) {
            openedNames.value.push(name);
          } else if (!opened) {
            const index = openedNames.value.findIndex((item) => item === name);
            index !== -1 && openedNames.value.splice(index, 1);
          }
        });
      });

      return { getClass, openedNames };
    },
  });
</script>
<style lang="less">
  @import './menu.less';
</style>
