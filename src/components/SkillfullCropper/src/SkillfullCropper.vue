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
  <div :class="getClass" :style="getWrapperStyle">
    <img
      v-show="isReady"
      ref="imgElRef"
      :src="src"
      :alt="alt"
      :crossorigin="crossorigin"
      :style="getImageStyle"
    />
  </div>
</template>
<script lang="ts">
  import type { CSSProperties } from 'vue';
  import { defineComponent, onMounted, ref, unref, computed, onUnmounted } from 'vue';
  import Cropper from 'cropperjs';
  import 'cropperjs/dist/cropper.css';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useDebounceFn } from '@vueuse/shared';

  type Options = Cropper.Options;

  const defaultOptions: Options = {
    aspectRatio: 1,
    zoomable: true,
    zoomOnTouch: true,
    zoomOnWheel: true,
    cropBoxMovable: true,
    cropBoxResizable: true,
    toggleDragModeOnDblclick: true,
    autoCrop: true,
    background: true,
    highlight: true,
    center: true,
    responsive: true,
    restore: true,
    checkCrossOrigin: true,
    checkOrientation: true,
    scalable: true,
    modal: true,
    guides: true,
    movable: true,
    rotatable: true,
  };

  const props = {
    src: { type: String, required: true },
    alt: { type: String },
    circled: { type: Boolean, default: false },
    realTimePreview: { type: Boolean, default: true },
    height: { type: [String, Number], default: '360px' },
    crossorigin: {
      type: String as PropType<'' | 'anonymous' | 'use-credentials' | undefined>,
      default: undefined,
    },
    imageStyle: { type: Object as PropType<CSSProperties>, default: () => ({}) },
    options: { type: Object as PropType<Options>, default: () => ({}) },
  };

  export default defineComponent({
    name: 'CropperImage',
    props,
    emits: ['cropend', 'ready', 'cropendError'],
    setup(props, { attrs, emit }) {
      const imgElRef = ref<ElRef<HTMLImageElement>>();
      const cropper = ref<Nullable<Cropper>>();
      const isReady = ref(false);

      const { prefixCls } = useDesign('cropper-image');
      const debounceRealTimeCroppered = useDebounceFn(realTimeCroppered, 80);

      const getImageStyle = computed((): CSSProperties => {
        return {
          height: props.height,
          maxWidth: '100%',
          ...props.imageStyle,
        };
      });

      const getClass = computed(() => {
        return [
          prefixCls,
          attrs.class,
          {
            [`${prefixCls}--circled`]: props.circled,
          },
        ];
      });

      const getWrapperStyle = computed((): CSSProperties => {
        return { height: `${props.height}`.replace(/px/, '') + 'px' };
      });

      onMounted(init);

      onUnmounted(() => {
        cropper.value?.destroy();
      });

      async function init() {
        const imgEl = unref(imgElRef);
        if (!imgEl) {
          return;
        }
        cropper.value = new Cropper(imgEl, {
          ...defaultOptions,
          ready: () => {
            isReady.value = true;
            realTimeCroppered();
            emit('ready', cropper.value);
          },
          crop() {
            debounceRealTimeCroppered();
          },
          zoom() {
            debounceRealTimeCroppered();
          },
          cropmove() {
            debounceRealTimeCroppered();
          },
          ...props.options,
        });
      }

      // Real-time display preview
      function realTimeCroppered() {
        props.realTimePreview && croppered();
      }

      // event: return base64 and width and height information after cropping
      function croppered() {
        if (!cropper.value) {
          return;
        }
        let imgInfo = cropper.value.getData();
        const canvas = props.circled ? getRoundedCanvas() : cropper.value.getCroppedCanvas();
        canvas.toBlob((blob) => {
          if (!blob) {
            return;
          }
          let fileReader: FileReader = new FileReader();
          fileReader.readAsDataURL(blob);
          fileReader.onloadend = (e) => {
            emit('cropend', {
              imgBase64: e.target?.result ?? '',
              imgInfo,
            });
          };
          fileReader.onerror = () => {
            emit('cropendError');
          };
        }, 'image/png');
      }

      // Get a circular picture canvas
      function getRoundedCanvas() {
        const sourceCanvas = cropper.value!.getCroppedCanvas();
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        const width = sourceCanvas.width;
        const height = sourceCanvas.height;
        canvas.width = width;
        canvas.height = height;
        context.imageSmoothingEnabled = true;
        context.drawImage(sourceCanvas, 0, 0, width, height);
        context.globalCompositeOperation = 'destination-in';
        context.beginPath();
        context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
        context.fill();
        return canvas;
      }

      return { getClass, imgElRef, getWrapperStyle, getImageStyle, isReady, croppered };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-cropper-image';

  .@{prefix-cls} {
    &--circled {
      .cropper-view-box,
      .cropper-face {
        border-radius: 50%;
      }
    }
  }
</style>
