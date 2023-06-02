/*
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
 */
import type {
  UseModalReturnType,
  ModalMethods,
  ModalProps,
  ReturnMethods,
  UseModalInnerReturnType,
} from '../typing';
import {
  ref,
  onUnmounted,
  unref,
  getCurrentInstance,
  reactive,
  watchEffect,
  nextTick,
  toRaw,
} from 'vue';
import { isProdMode } from '/@/utils/env';
import { isFunction } from '/@/utils/is';
import { isEqual } from 'lodash-es';
import { tryOnUnmounted } from '@vueuse/core';
import { error } from '/@/utils/log';
import { computed } from 'vue';

const dataTransfer = reactive<any>({});

const visibleData = reactive<{ [key: number]: boolean }>({});

/**
 * @description: Applicable to independent modal and call outside
 */
export function useModal(): UseModalReturnType {
  const modal = ref<Nullable<ModalMethods>>(null);
  const loaded = ref<Nullable<boolean>>(false);
  const uid = ref<string>('');

  function register(modalMethod: ModalMethods, uuid: string) {
    if (!getCurrentInstance()) {
      throw new Error('useModal() can only be used inside setup() or functional components!');
    }
    uid.value = uuid;
    isProdMode() &&
      onUnmounted(() => {
        modal.value = null;
        loaded.value = false;
        dataTransfer[unref(uid)] = null;
      });
    if (unref(loaded) && isProdMode() && modalMethod === unref(modal)) return;

    modal.value = modalMethod;
    loaded.value = true;
    modalMethod.emitVisible = (visible: boolean, uid: number) => {
      visibleData[uid] = visible;
    };
  }

  const getInstance = () => {
    const instance = unref(modal);
    if (!instance) {
      error('useModal instance is undefined!');
    }
    return instance;
  };

  const methods: ReturnMethods = {
    setModalProps: (props: Partial<ModalProps>): void => {
      getInstance()?.setModalProps(props);
    },

    getVisible: computed((): boolean => {
      return visibleData[~~unref(uid)];
    }),

    redoModalHeight: () => {
      getInstance()?.redoModalHeight?.();
    },

    openModal: <T = any>(visible = true, data?: T, openOnSet = true): void => {
      getInstance()?.setModalProps({
        visible: visible,
      });

      if (!data) return;
      const id = unref(uid);
      if (openOnSet) {
        dataTransfer[id] = null;
        dataTransfer[id] = toRaw(data);
        return;
      }
      const equal = isEqual(toRaw(dataTransfer[id]), toRaw(data));
      if (!equal) {
        dataTransfer[id] = toRaw(data);
      }
    },

    closeModal: () => {
      getInstance()?.setModalProps({ visible: false });
    },
  };
  return [register, methods];
}

export const useModalInner = (callbackFn?: Fn): UseModalInnerReturnType => {
  const modalInstanceRef = ref<Nullable<ModalMethods>>(null);
  const currentInstance = getCurrentInstance();
  const uidRef = ref<string>('');

  const getInstance = () => {
    const instance = unref(modalInstanceRef);
    if (!instance) {
      error('useModalInner instance is undefined!');
    }
    return instance;
  };

  const register = (modalInstance: ModalMethods, uuid: string) => {
    isProdMode() &&
      tryOnUnmounted(() => {
        modalInstanceRef.value = null;
      });
    uidRef.value = uuid;
    modalInstanceRef.value = modalInstance;
    currentInstance?.emit('register', modalInstance, uuid);
  };

  watchEffect(() => {
    const data = dataTransfer[unref(uidRef)];
    if (!data) return;
    if (!callbackFn || !isFunction(callbackFn)) return;
    nextTick(() => {
      callbackFn(data);
    });
  });

  return [
    register,
    {
      changeLoading: (loading = true) => {
        getInstance()?.setModalProps({ loading });
      },
      getVisible: computed((): boolean => {
        return visibleData[~~unref(uidRef)];
      }),

      changeOkLoading: (loading = true) => {
        getInstance()?.setModalProps({ confirmLoading: loading });
      },

      closeModal: () => {
        getInstance()?.setModalProps({ visible: false });
      },

      setModalProps: (props: Partial<ModalProps>) => {
        getInstance()?.setModalProps(props);
      },

      redoModalHeight: () => {
        const callRedo = getInstance()?.redoModalHeight;
        callRedo && callRedo();
      },
    },
  ];
};
