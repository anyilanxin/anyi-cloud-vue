<!--
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
 -->
<template>
  <ScrollContainer ref="wrapperRef">
    <div ref="spinRef" :style="spinStyle" v-loading="loading" :loading-tip="loadingTip">
      <slot></slot>
    </div>
  </ScrollContainer>
</template>
<script lang="ts">
  import type { CSSProperties } from 'vue';
  import {
    defineComponent,
    computed,
    ref,
    watchEffect,
    unref,
    watch,
    onMounted,
    nextTick,
    onUnmounted,
  } from 'vue';
  import { useWindowSizeFn } from '/@/hooks/event/useWindowSizeFn';
  import { ScrollContainer } from '/@/components/Container';
  import { createModalContext } from '../hooks/useModalContext';
  import { useMutationObserver } from '@vueuse/core';

  const props = {
    loading: { type: Boolean },
    useWrapper: { type: Boolean, default: true },
    modalHeaderHeight: { type: Number, default: 57 },
    modalFooterHeight: { type: Number, default: 74 },
    minHeight: { type: Number, default: 200 },
    height: { type: Number },
    footerOffset: { type: Number, default: 0 },
    visible: { type: Boolean },
    fullScreen: { type: Boolean },
    loadingTip: { type: String },
  };

  export default defineComponent({
    name: 'ModalWrapper',
    components: { ScrollContainer },
    inheritAttrs: false,
    props,
    emits: ['height-change', 'ext-height'],
    setup(props, { emit }) {
      const wrapperRef = ref<ComponentRef>(null);
      const spinRef = ref<ElRef>(null);
      const realHeightRef = ref(0);
      const minRealHeightRef = ref(0);

      let realHeight = 0;

      let stopElResizeFn: Fn = () => {};

      useWindowSizeFn(setModalHeight.bind(null, false));

      useMutationObserver(
        spinRef,
        () => {
          setModalHeight();
        },
        {
          attributes: true,
          subtree: true,
        },
      );

      createModalContext({
        redoModalHeight: setModalHeight,
      });

      const spinStyle = computed((): CSSProperties => {
        return {
          minHeight: `${props.minHeight}px`,
          [props.fullScreen ? 'height' : 'maxHeight']: `${unref(realHeightRef)}px`,
        };
      });

      watchEffect(() => {
        props.useWrapper && setModalHeight();
      });

      watch(
        () => props.fullScreen,
        (v) => {
          setModalHeight();
          if (!v) {
            realHeightRef.value = minRealHeightRef.value;
          } else {
            minRealHeightRef.value = realHeightRef.value;
          }
        },
      );

      onMounted(() => {
        const { modalHeaderHeight, modalFooterHeight } = props;
        emit('ext-height', modalHeaderHeight + modalFooterHeight);
      });

      onUnmounted(() => {
        stopElResizeFn && stopElResizeFn();
      });

      async function scrollTop() {
        nextTick(() => {
          const wrapperRefDom = unref(wrapperRef);
          if (!wrapperRefDom) return;
          (wrapperRefDom as any)?.scrollTo?.(0);
        });
      }

      async function setModalHeight() {
        // 解决在弹窗关闭的时候监听还存在,导致再次打开弹窗没有高度
        // 加上这个,就必须在使用的时候传递父级的visible
        if (!props.visible) return;
        const wrapperRefDom = unref(wrapperRef);
        if (!wrapperRefDom) return;

        const bodyDom = wrapperRefDom.$el.parentElement;
        if (!bodyDom) return;
        bodyDom.style.padding = '0';
        await nextTick();

        try {
          const modalDom = bodyDom.parentElement && bodyDom.parentElement.parentElement;
          if (!modalDom) return;

          const modalRect = getComputedStyle(modalDom as Element).top;
          const modalTop = Number.parseInt(modalRect);
          let maxHeight =
            window.innerHeight -
            modalTop * 2 +
            (props.footerOffset! || 0) -
            props.modalFooterHeight -
            props.modalHeaderHeight;

          // 距离顶部过进会出现滚动条
          if (modalTop < 40) {
            maxHeight -= 26;
          }
          await nextTick();
          const spinEl = unref(spinRef);

          if (!spinEl) return;
          await nextTick();
          // if (!realHeight) {
          realHeight = spinEl.scrollHeight;
          // }

          if (props.fullScreen) {
            realHeightRef.value =
              window.innerHeight - props.modalFooterHeight - props.modalHeaderHeight - 28;
          } else {
            realHeightRef.value = props.height
              ? props.height
              : realHeight > maxHeight
              ? maxHeight
              : realHeight;
          }
          emit('height-change', unref(realHeightRef));
        } catch (error) {
          console.log(error);
        }
      }

      return { wrapperRef, spinRef, spinStyle, scrollTop, setModalHeight };
    },
  });
</script>
