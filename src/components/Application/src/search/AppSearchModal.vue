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
  <Teleport to="body">
    <transition name="zoom-fade" mode="out-in">
      <div :class="getClass" @click.stop v-if="visible">
        <div :class="`${prefixCls}-content`" v-click-outside="handleClose">
          <div :class="`${prefixCls}-input__wrapper`">
            <a-input
              :class="`${prefixCls}-input`"
              :placeholder="t('common.searchText')"
              size="large"
              ref="inputRef"
              allow-clear
              @change="handleSearch"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
            <span :class="`${prefixCls}-cancel`" @click="handleClose">
              {{ t('common.cancelText') }}
            </span>
          </div>

          <div :class="`${prefixCls}-not-data`" v-show="getIsNotData">
            {{ t('component.app.searchNotData') }}
          </div>

          <ul :class="`${prefixCls}-list`" v-show="!getIsNotData" ref="scrollWrap">
            <li
              :ref="setRefs(index)"
              v-for="(item, index) in searchResult"
              :key="item.path"
              :data-index="index"
              @mouseenter="handleMouseenter"
              @click="handleEnter"
              :class="[
                `${prefixCls}-list__item`,
                {
                  [`${prefixCls}-list__item--active`]: activeIndex === index,
                },
              ]"
            >
              <div :class="`${prefixCls}-list__item-icon`">
                <Icon :icon="item.icon || 'mdi:form-select'" :size="20" />
              </div>
              <div :class="`${prefixCls}-list__item-text`">
                {{ item.name }}
              </div>
              <div :class="`${prefixCls}-list__item-enter`">
                <Icon icon="ant-design:enter-outlined" :size="20" />
              </div>
            </li>
          </ul>
          <AppSearchFooter />
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script lang="ts" setup>
  import { computed, unref, ref, watch, nextTick } from 'vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import AppSearchFooter from './AppSearchFooter.vue';
  import Icon from '/@/components/Icon';
  // @ts-ignore
  import vClickOutside from '/@/directives/clickOutside';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useRefs } from '/@/hooks/core/useRefs';
  import { useMenuSearch } from './useMenuSearch';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useAppInject } from '/@/hooks/web/useAppInject';

  const props = defineProps({
    visible: { type: Boolean },
  });

  const emit = defineEmits(['close']);

  const scrollWrap = ref(null);
  const inputRef = ref<Nullable<HTMLElement>>(null);

  const { t } = useI18n();
  const { prefixCls } = useDesign('app-search-modal');
  const [refs, setRefs] = useRefs();
  const { getIsMobile } = useAppInject();

  const { handleSearch, searchResult, keyword, activeIndex, handleEnter, handleMouseenter } =
    useMenuSearch(refs, scrollWrap, emit);

  const getIsNotData = computed(() => !keyword || unref(searchResult).length === 0);

  const getClass = computed(() => {
    return [
      prefixCls,
      {
        [`${prefixCls}--mobile`]: unref(getIsMobile),
      },
    ];
  });

  watch(
    () => props.visible,
    (visible: boolean) => {
      visible &&
        nextTick(() => {
          unref(inputRef)?.focus();
        });
    },
  );

  function handleClose() {
    searchResult.value = [];
    emit('close');
  }
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-app-search-modal';
  @footer-prefix-cls: ~'@{namespace}-app-search-footer';
  .@{prefix-cls} {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 800;
    display: flex;
    width: 100%;
    height: 100%;
    padding-top: 50px;
    background-color: rgb(0 0 0 / 25%);
    justify-content: center;

    &--mobile {
      padding: 0;

      > div {
        width: 100%;
      }

      .@{prefix-cls}-input {
        width: calc(100% - 38px);
      }

      .@{prefix-cls}-cancel {
        display: inline-block;
      }

      .@{prefix-cls}-content {
        width: 100%;
        height: 100%;
        border-radius: 0;
      }

      .@{footer-prefix-cls} {
        display: none;
      }

      .@{prefix-cls}-list {
        height: calc(100% - 80px);
        max-height: unset;

        &__item {
          &-enter {
            opacity: 0% !important;
          }
        }
      }
    }

    &-content {
      position: relative;
      width: 632px;
      margin: 0 auto auto;
      background-color: @component-background;
      border-radius: 6px;
      box-shadow: 0 25px 50px -12px rgb(0 0 0 / 25%);
      flex-direction: column;
    }

    &-input__wrapper {
      display: flex;
      padding: 14px 14px 0;
      justify-content: space-between;
      align-items: center;
    }

    &-input {
      width: 100%;
      height: 48px;
      font-size: 1.5em;
      color: #1c1e21;
      border-radius: 6px;

      span[role='img'] {
        color: #999;
      }
    }

    &-cancel {
      display: none;
      font-size: 1em;
      color: #666;
    }

    &-not-data {
      display: flex;
      width: 100%;
      height: 100px;
      font-size: 0.9;
      color: rgb(150 159 175);
      align-items: center;
      justify-content: center;
    }

    &-list {
      max-height: 472px;
      padding: 0 14px;
      padding-bottom: 20px;
      margin: 0 auto;
      margin-top: 14px;
      overflow: auto;

      &__item {
        position: relative;
        display: flex;
        width: 100%;
        height: 56px;
        padding-bottom: 4px;
        padding-left: 14px;
        margin-top: 8px;
        font-size: 14px;
        color: @text-color-base;
        cursor: pointer;
        background-color: @component-background;
        border-radius: 4px;
        box-shadow: 0 1px 3px 0 #d4d9e1;
        align-items: center;

        > div:first-child,
        > div:last-child {
          display: flex;
          align-items: center;
        }

        &--active {
          color: #fff;
          background-color: @primary-color;

          .@{prefix-cls}-list__item-enter {
            opacity: 100%;
          }
        }

        &-icon {
          width: 30px;
        }

        &-text {
          flex: 1;
        }

        &-enter {
          width: 30px;
          opacity: 0%;
        }
      }
    }
  }
</style>
