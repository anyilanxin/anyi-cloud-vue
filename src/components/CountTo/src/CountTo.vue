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
 *   7.进行商用时，不得基于AnYi Cloud Vue 的基础，修改包装而成一个与AnYi Zeebe EE、AnYi Cloud EE功能类似的程序，进行销售或发布，参与同类软件产品市场的竞争；
 *   8.本软件使用的第三方依赖皆为开源软件，如需要修改第三方源码请遵循第三方源码附带开源协议；
 *   9.本软件流程部分请遵循camunda开源协议：
 *     https://docs.camunda.org/manual/latest/introduction/third-party-libraries
 *     https://github.com/camunda/camunda-bpm-platform/blob/master/LICENSE
 *   10.若您的项目无法满足以上几点，可申请商业授权。
 -->
<template>
  <span :style="{ color }">
    {{ value }}
  </span>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, watchEffect, unref, onMounted, watch } from 'vue';
  import { useTransition, TransitionPresets } from '@vueuse/core';
  import { isNumber } from '/@/utils/is';

  const props = {
    startVal: { type: Number, default: 0 },
    endVal: { type: Number, default: 2021 },
    duration: { type: Number, default: 1500 },
    autoplay: { type: Boolean, default: true },
    decimals: {
      type: Number,
      default: 0,
      validator(value: number) {
        return value >= 0;
      },
    },
    prefix: { type: String, default: '' },
    suffix: { type: String, default: '' },
    separator: { type: String, default: ',' },
    decimal: { type: String, default: '.' },
    /**
     * font color
     */
    color: { type: String },
    /**
     * Turn on digital animation
     */
    useEasing: { type: Boolean, default: true },
    /**
     * Digital animation
     */
    transition: { type: String, default: 'linear' },
  };

  export default defineComponent({
    name: 'CountTo',
    props,
    emits: ['onStarted', 'onFinished'],
    setup(props, { emit }) {
      const source = ref(props.startVal);
      const disabled = ref(false);
      let outputValue = useTransition(source);

      const value = computed(() => formatNumber(unref(outputValue)));

      watchEffect(() => {
        source.value = props.startVal;
      });

      watch([() => props.startVal, () => props.endVal], () => {
        if (props.autoplay) {
          start();
        }
      });

      onMounted(() => {
        props.autoplay && start();
      });

      function start() {
        run();
        source.value = props.endVal;
      }

      function reset() {
        source.value = props.startVal;
        run();
      }

      function run() {
        outputValue = useTransition(source, {
          disabled,
          duration: props.duration,
          onFinished: () => emit('onFinished'),
          onStarted: () => emit('onStarted'),
          ...(props.useEasing ? { transition: TransitionPresets[props.transition] } : {}),
        });
      }

      function formatNumber(num: number | string) {
        if (!num && num !== 0) {
          return '';
        }
        const { decimals, decimal, separator, suffix, prefix } = props;
        num = Number(num).toFixed(decimals);
        num += '';

        const x = num.split('.');
        let x1 = x[0];
        const x2 = x.length > 1 ? decimal + x[1] : '';

        const rgx = /(\d+)(\d{3})/;
        if (separator && !isNumber(separator)) {
          while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + separator + '$2');
          }
        }
        return prefix + x1 + x2 + suffix;
      }

      return { value, start, reset };
    },
  });
</script>
