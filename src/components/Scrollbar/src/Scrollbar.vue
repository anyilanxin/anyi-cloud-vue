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
 *   7.进行商用时，不得基于AnYi Cloud Vue的基础，修改包装而成一个与AnYi Cloud EE、AnYi Zeebe EE、AnYi Standalone EE功能类似的程序，进行销售或发布，参与同类软件产品市场的竞争；
 *   8.本软件使用的第三方依赖皆为开源软件，如需要修改第三方源码请遵循第三方源码附带开源协议；
 *   9.本软件中使用了bpmn js,使用请遵循bpmn.io开源协议：
 *     https://github.com/bpmn-io/bpmn-js/blob/develop/LICENSE
 *   10.若您的项目无法满足以上几点，可申请商业授权。
 -->
<template>
  <div class="scrollbar">
    <div
      ref="wrap"
      :class="[wrapClass, 'scrollbar__wrap', native ? '' : 'scrollbar__wrap--hidden-default']"
      :style="style"
      @scroll="handleScroll"
    >
      <component :is="tag" ref="resize" :class="['scrollbar__view', viewClass]" :style="viewStyle">
        <slot></slot>
      </component>
    </div>
    <template v-if="!native">
      <bar :move="moveX" :size="sizeWidth" />
      <bar vertical :move="moveY" :size="sizeHeight" />
    </template>
  </div>
</template>
<script lang="ts">
  import { addResizeListener, removeResizeListener } from '/@/utils/event';
  import componentSetting from '/@/settings/componentSetting';
  const { scrollbar } = componentSetting;
  import { toObject } from './util';
  import {
    defineComponent,
    ref,
    onMounted,
    onBeforeUnmount,
    nextTick,
    provide,
    computed,
    unref,
  } from 'vue';
  import Bar from './bar';

  export default defineComponent({
    name: 'Scrollbar',
    // inheritAttrs: false,
    components: { Bar },
    props: {
      native: {
        type: Boolean,
        default: scrollbar?.native ?? false,
      },
      wrapStyle: {
        type: [String, Array],
        default: '',
      },
      wrapClass: {
        type: [String, Array],
        default: '',
      },
      viewClass: {
        type: [String, Array],
        default: '',
      },
      viewStyle: {
        type: [String, Array],
        default: '',
      },
      noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
      tag: {
        type: String,
        default: 'div',
      },
    },
    setup(props) {
      const sizeWidth = ref('0');
      const sizeHeight = ref('0');
      const moveX = ref(0);
      const moveY = ref(0);
      const wrap = ref();
      const resize = ref();

      provide('scroll-bar-wrap', wrap);

      const style = computed(() => {
        if (Array.isArray(props.wrapStyle)) {
          return toObject(props.wrapStyle);
        }
        return props.wrapStyle;
      });

      const handleScroll = () => {
        if (!props.native) {
          moveY.value = (unref(wrap).scrollTop * 100) / unref(wrap).clientHeight;
          moveX.value = (unref(wrap).scrollLeft * 100) / unref(wrap).clientWidth;
        }
      };

      const update = () => {
        if (!unref(wrap)) return;

        const heightPercentage = (unref(wrap).clientHeight * 100) / unref(wrap).scrollHeight;
        const widthPercentage = (unref(wrap).clientWidth * 100) / unref(wrap).scrollWidth;

        sizeHeight.value = heightPercentage < 100 ? heightPercentage + '%' : '';
        sizeWidth.value = widthPercentage < 100 ? widthPercentage + '%' : '';
      };

      onMounted(() => {
        if (props.native) return;
        nextTick(update);
        if (!props.noresize) {
          addResizeListener(unref(resize), update);
          addResizeListener(unref(wrap), update);
          addEventListener('resize', update);
        }
      });

      onBeforeUnmount(() => {
        if (props.native) return;
        if (!props.noresize) {
          removeResizeListener(unref(resize), update);
          removeResizeListener(unref(wrap), update);
          removeEventListener('resize', update);
        }
      });

      return {
        moveX,
        moveY,
        sizeWidth,
        sizeHeight,
        style,
        wrap,
        resize,
        update,
        handleScroll,
      };
    },
  });
</script>
<style lang="less">
  .scrollbar {
    position: relative;
    height: 100%;
    overflow: hidden;

    &__wrap {
      height: 100%;
      overflow: auto;

      &--hidden-default {
        scrollbar-width: none;

        &::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
          opacity: 0%;
        }
      }
    }

    &__thumb {
      position: relative;
      display: block;
      width: 0;
      height: 0;
      cursor: pointer;
      background-color: rgb(144 147 153 / 30%);
      border-radius: inherit;
      transition: 0.3s background-color;

      &:hover {
        background-color: rgb(144 147 153 / 50%);
      }
    }

    &__bar {
      position: absolute;
      right: 2px;
      bottom: 2px;
      z-index: 1;
      border-radius: 4px;
      opacity: 0%;
      transition: opacity 80ms ease;

      &.is-vertical {
        top: 2px;
        width: 6px;

        & > div {
          width: 100%;
        }
      }

      &.is-horizontal {
        left: 2px;
        height: 6px;

        & > div {
          height: 100%;
        }
      }
    }
  }

  .scrollbar:active > .scrollbar__bar,
  .scrollbar:focus > .scrollbar__bar,
  .scrollbar:hover > .scrollbar__bar {
    opacity: 100%;
    transition: opacity 340ms ease-out;
  }
</style>
