/*
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
 */
import type { ColEx } from '../types';
import type { AdvanceState } from '../types/hooks';
import type { ComputedRef, Ref } from 'vue';
import type { FormProps, FormSchema } from '../types/form';
import { computed, unref, watch } from 'vue';
import { isBoolean, isFunction, isNumber, isObject } from '/@/utils/is';
import { useBreakpoint } from '/@/hooks/event/useBreakpoint';
import { useDebounceFn } from '@vueuse/core';

const BASIC_COL_LEN = 24;

interface UseAdvancedContext {
  advanceState: AdvanceState;
  emit: EmitType;
  getProps: ComputedRef<FormProps>;
  getSchema: ComputedRef<FormSchema[]>;
  formModel: Recordable;
  defaultValueRef: Ref<Recordable>;
}

export default function ({
  advanceState,
  emit,
  getProps,
  getSchema,
  formModel,
  defaultValueRef,
}: UseAdvancedContext) {
  const { realWidthRef, screenEnum, screenRef } = useBreakpoint();

  const getEmptySpan = computed((): number => {
    if (!advanceState.isAdvanced) {
      return 0;
    }
    // For some special cases, you need to manually specify additional blank lines
    const emptySpan = unref(getProps).emptySpan || 0;

    if (isNumber(emptySpan)) {
      return emptySpan;
    }
    if (isObject(emptySpan)) {
      const { span = 0 } = emptySpan;
      const screen = unref(screenRef) as string;

      const screenSpan = (emptySpan as any)[screen.toLowerCase()];
      return screenSpan || span || 0;
    }
    return 0;
  });

  const debounceUpdateAdvanced = useDebounceFn(updateAdvanced, 30);

  watch(
    [() => unref(getSchema), () => advanceState.isAdvanced, () => unref(realWidthRef)],
    () => {
      const { showAdvancedButton } = unref(getProps);
      if (showAdvancedButton) {
        debounceUpdateAdvanced();
      }
    },
    { immediate: true },
  );

  function getAdvanced(itemCol: Partial<ColEx>, itemColSum = 0, isLastAction = false, actionSpan) {
    const width = unref(realWidthRef);

    const mdWidth =
      parseInt(itemCol.md as string) ||
      parseInt(itemCol.xs as string) ||
      parseInt(itemCol.sm as string) ||
      (itemCol.span as number) ||
      BASIC_COL_LEN;

    const lgWidth = parseInt(itemCol.lg as string) || mdWidth;
    const xlWidth = parseInt(itemCol.xl as string) || lgWidth;
    const xxlWidth = parseInt(itemCol.xxl as string) || xlWidth;
    if (width <= screenEnum.LG) {
      itemColSum += mdWidth;
    } else if (width < screenEnum.XL) {
      itemColSum += lgWidth;
    } else if (width < screenEnum.XXL) {
      itemColSum += xlWidth;
    } else {
      itemColSum += xxlWidth;
    }
    const nowItemColSum = itemColSum + actionSpan;
    if (isLastAction) {
      advanceState.hideAdvanceBtn = false;
      if (nowItemColSum <= BASIC_COL_LEN * 2) {
        // When less than or equal to 2 lines, the collapse and expand buttons are not displayed
        advanceState.hideAdvanceBtn = true;
        advanceState.isAdvanced = true;
      } else if (
        nowItemColSum > BASIC_COL_LEN * 2 &&
        nowItemColSum <= BASIC_COL_LEN * (unref(getProps).autoAdvancedLine || 3)
      ) {
        console.log('---------eqweqwe-----', unref(getProps).autoAdvancedLine);
        advanceState.hideAdvanceBtn = false;

        // More than 3 lines collapsed by default
      } else if (!advanceState.isLoad) {
        advanceState.isLoad = true;
        advanceState.isAdvanced = !advanceState.isAdvanced;
      }
      return { isAdvanced: advanceState.isAdvanced, itemColSum };
    }
    if (nowItemColSum > BASIC_COL_LEN * (unref(getProps).alwaysShowLines || 1)) {
      return { isAdvanced: advanceState.isAdvanced, itemColSum };
    } else {
      // The first line is always displayed
      return { isAdvanced: true, itemColSum };
    }
  }

  function updateAdvanced() {
    let itemColSum = 0;
    let realItemColSum = 0;
    const { baseColProps = {}, actionColOptions } = unref(getProps);
    const actionSpan = parseInt(actionColOptions?.span ?? 6);
    for (const schema of unref(getSchema)) {
      const { show, colProps } = schema;
      let isShow = true;

      if (isBoolean(show)) {
        isShow = show;
      }

      if (isFunction(show)) {
        isShow = show({
          schema: schema,
          model: formModel,
          field: schema.field,
          values: {
            ...unref(defaultValueRef),
            ...formModel,
          },
        });
      }

      if (isShow && (colProps || baseColProps)) {
        const { itemColSum: sum, isAdvanced } = getAdvanced(
          { ...baseColProps, ...colProps },
          itemColSum,
          false,
          actionSpan,
        );

        itemColSum = sum || 0;
        if (isAdvanced) {
          realItemColSum = itemColSum;
        }
        schema.isAdvanced = isAdvanced;
      }
    }

    advanceState.actionSpan = (realItemColSum % BASIC_COL_LEN) + unref(getEmptySpan);

    getAdvanced(
      unref(getProps).actionColOptions || { span: BASIC_COL_LEN },
      itemColSum,
      true,
      actionSpan,
    );

    emit('advanced-change');
  }

  function handleToggleAdvanced() {
    advanceState.isAdvanced = !advanceState.isAdvanced;
  }

  return { handleToggleAdvanced };
}
