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
  <span>{{ date }}</span>
</template>
<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useIntervalFn } from '@vueuse/core';
  import { formatToDateTime, formatToDate, dateUtil } from '/@/utils/dateUtil';
  import { isNumber, isObject, isString } from '/@/utils/is';
  import { propTypes } from '/@/utils/propTypes';

  const ONE_SECONDS = 1000;
  const ONE_MINUTES = ONE_SECONDS * 60;
  const ONE_HOUR = ONE_MINUTES * 60;
  const ONE_DAY = ONE_HOUR * 24;

  export default defineComponent({
    name: 'Time',
    props: {
      value: propTypes.oneOfType([propTypes.number, propTypes.instanceOf(Date), propTypes.string])
        .isRequired,
      step: propTypes.number.def(60),
      mode: propTypes.oneOf(['date', 'datetime', 'relative']).def('relative'),
    },
    setup(props) {
      const date = ref('');

      const { t } = useI18n();

      useIntervalFn(setTime, props.step * ONE_SECONDS);

      watch(
        () => props.value,
        () => {
          setTime();
        },
        { immediate: true },
      );

      function getTime() {
        const { value } = props;
        let time = 0;
        if (isNumber(value)) {
          const timestamp = value.toString().length > 10 ? value : value * 1000;
          time = new Date(timestamp).getTime();
        } else if (isString(value)) {
          time = new Date(value).getTime();
        } else if (isObject(value)) {
          time = value.getTime();
        }
        return time;
      }

      function setTime() {
        const { mode, value } = props;
        const time = getTime();
        if (mode === 'relative') {
          date.value = getRelativeTime(time);
        } else {
          if (mode === 'datetime') {
            date.value = formatToDateTime(value);
          } else if (mode === 'date') {
            date.value = formatToDate(value);
          }
        }
      }

      function getRelativeTime(timeStamp: number) {
        const currentTime = new Date().getTime();

        // Determine whether the incoming timestamp is earlier than the current timestamp
        const isBefore = dateUtil(timeStamp).isBefore(currentTime);

        let diff = currentTime - timeStamp;
        if (!isBefore) {
          diff = -diff;
        }

        let resStr = '';
        let dirStr = isBefore ? t('component.time.before') : t('component.time.after');

        if (diff < ONE_SECONDS) {
          resStr = t('component.time.just');
          // Less than or equal to 59 seconds
        } else if (diff < ONE_MINUTES) {
          resStr = parseInt(diff / ONE_SECONDS) + t('component.time.seconds') + dirStr;
          // More than 59 seconds, less than or equal to 59 minutes and 59 seconds
        } else if (diff >= ONE_MINUTES && diff < ONE_HOUR) {
          resStr = Math.floor(diff / ONE_MINUTES) + t('component.time.minutes') + dirStr;
          // More than 59 minutes and 59 seconds, less than or equal to 23 hours, 59 minutes and 59 seconds
        } else if (diff >= ONE_HOUR && diff < ONE_DAY) {
          resStr = Math.floor(diff / ONE_HOUR) + t('component.time.hours') + dirStr;
          // More than 23 hours, 59 minutes and 59 seconds, less than or equal to 29 days, 59 minutes and 59 seconds
        } else if (diff >= ONE_DAY && diff < 2623860000) {
          resStr = Math.floor(diff / ONE_DAY) + t('component.time.days') + dirStr;
          // More than 29 days, 59 minutes, 59 seconds, less than 364 days, 23 hours, 59 minutes, 59 seconds, and the incoming timestamp is earlier than the current
        } else if (diff >= 2623860000 && diff <= 31567860000 && isBefore) {
          resStr = dateUtil(timeStamp).format('MM-DD-HH-mm');
        } else {
          resStr = dateUtil(timeStamp).format('YYYY');
        }
        return resStr;
      }

      return { date };
    },
  });
</script>
