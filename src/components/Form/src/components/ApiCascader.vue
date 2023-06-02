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
  <a-cascader
    v-model:value="state"
    :options="options"
    :load-data="loadData"
    change-on-select
    @change="handleChange"
    :displayRender="handleRenderDisplay"
  >
    <template #suffixIcon v-if="loading">
      <LoadingOutlined spin />
    </template>
    <template #notFoundContent v-if="loading">
      <span>
        <LoadingOutlined spin class="mr-1" />
        {{ t('component.form.apiSelectNotFound') }}
      </span>
    </template>
  </a-cascader>
</template>
<script lang="ts">
  import { defineComponent, PropType, ref, unref, watch, watchEffect } from 'vue';
  import { Cascader } from 'ant-design-vue';
  import { propTypes } from '/@/utils/propTypes';
  import { isFunction } from '/@/utils/is';
  import { get, omit } from 'lodash-es';
  import { useRuleFormItem } from '/@/hooks/component/useFormItem';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  interface Option {
    value: string;
    label: string;
    loading?: boolean;
    isLeaf?: boolean;
    children?: Option[];
  }
  export default defineComponent({
    name: 'ApiCascader',
    components: {
      LoadingOutlined,
      [Cascader.name]: Cascader,
    },
    props: {
      value: {
        type: Array,
      },
      api: {
        type: Function as PropType<(arg?: Recordable) => Promise<Option[]>>,
        default: null,
      },
      numberToString: propTypes.bool,
      resultField: propTypes.string.def(''),
      labelField: propTypes.string.def('label'),
      valueField: propTypes.string.def('value'),
      childrenField: propTypes.string.def('children'),
      asyncFetchParamKey: propTypes.string.def('parentCode'),
      immediate: propTypes.bool.def(true),
      // init fetch params
      initFetchParams: {
        type: Object as PropType<Recordable>,
        default: () => ({}),
      },
      // 是否有下级，默认是
      isLeaf: {
        type: Function as PropType<(arg: Recordable) => boolean>,
        default: null,
      },
      displayRenderArray: {
        type: Array,
      },
    },
    emits: ['change', 'defaultChange'],
    setup(props, { emit }) {
      const apiData = ref<any[]>([]);
      const options = ref<Option[]>([]);
      const loading = ref<boolean>(false);
      const emitData = ref<any[]>([]);
      const isFirstLoad = ref(true);
      const { t } = useI18n();
      // Embedded in the form, just use the hook binding to perform form verification
      const [state] = useRuleFormItem(props, 'value', 'change', emitData);

      watch(
        apiData,
        (data) => {
          const opts = generatorOptions(data);
          options.value = opts;
        },
        { deep: true },
      );

      function generatorOptions(options: any[]): Option[] {
        const { labelField, valueField, numberToString, childrenField, isLeaf } = props;
        return options.reduce((prev, next: Recordable) => {
          if (next) {
            const value = next[valueField];
            const item = {
              ...omit(next, [labelField, valueField]),
              label: next[labelField],
              value: numberToString ? `${value}` : value,
              isLeaf: isLeaf && typeof isLeaf === 'function' ? isLeaf(next) : false,
            };
            const children = Reflect.get(next, childrenField);
            if (children) {
              Reflect.set(item, childrenField, generatorOptions(children));
            }
            prev.push(item);
          }
          return prev;
        }, [] as Option[]);
      }

      async function initialFetch() {
        const api = props.api;
        if (!api || !isFunction(api)) return;
        apiData.value = [];
        loading.value = true;
        try {
          const res = await api(props.initFetchParams);
          if (Array.isArray(res)) {
            apiData.value = res;
            return;
          }
          if (props.resultField) {
            apiData.value = get(res, props.resultField) || [];
          }
        } catch (error) {
          console.warn(error);
        } finally {
          loading.value = false;
        }
      }

      async function loadData(selectedOptions: Option[]) {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;

        const api = props.api;
        if (!api || !isFunction(api)) return;
        try {
          const res = await api({
            [props.asyncFetchParamKey]: Reflect.get(targetOption, 'value'),
          });
          if (Array.isArray(res)) {
            const children = generatorOptions(res);
            targetOption.children = children;
            return;
          }
          if (props.resultField) {
            const children = generatorOptions(get(res, props.resultField) || []);
            targetOption.children = children;
          }
        } catch (e) {
          console.error(e);
        } finally {
          targetOption.loading = false;
        }
      }

      watchEffect(() => {
        props.immediate && initialFetch();
      });

      watch(
        () => props.initFetchParams,
        () => {
          !unref(isFirstLoad) && initialFetch();
        },
        { deep: true },
      );

      function handleChange(keys, args) {
        emitData.value = keys;
        emit('defaultChange', keys, args);
      }

      function handleRenderDisplay({ labels, selectedOptions }) {
        if (unref(emitData).length === selectedOptions.length) {
          return labels.join(' / ');
        }
        if (props.displayRenderArray) {
          return props.displayRenderArray.join(' / ');
        }
        return '';
      }

      return {
        state,
        options,
        loading,
        t,
        handleChange,
        loadData,
        handleRenderDisplay,
      };
    },
  });
</script>
