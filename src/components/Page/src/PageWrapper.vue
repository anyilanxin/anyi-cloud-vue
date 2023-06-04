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
  <div :class="getClass" ref="wrapperRef">
    <PageHeader
      :ghost="ghost"
      :title="title"
      v-bind="omit($attrs, 'class')"
      ref="headerRef"
      v-if="content || $slots.headerContent || title || getHeaderSlots.length"
    >
      <template #default>
        <template v-if="content">
          {{ content }}
        </template>
        <slot name="headerContent" v-else></slot>
      </template>
      <template #[item]="data" v-for="item in getHeaderSlots">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </PageHeader>

    <div class="overflow-hidden" :class="getContentClass" :style="getContentStyle" ref="contentRef">
      <slot></slot>
    </div>

    <PageFooter v-if="getShowFooter" ref="footerRef">
      <template #left>
        <slot name="leftFooter"></slot>
      </template>
      <template #right>
        <slot name="rightFooter"></slot>
      </template>
    </PageFooter>
  </div>
</template>
<script lang="ts">
  import { CSSProperties, PropType, provide } from 'vue';

  import { defineComponent, computed, watch, ref, unref } from 'vue';
  import PageFooter from './PageFooter.vue';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { propTypes } from '/@/utils/propTypes';
  import { omit } from 'lodash-es';
  import { PageHeader } from 'ant-design-vue';
  import { useContentHeight } from '/@/hooks/web/useContentHeight';
  import { PageWrapperFixedHeightKey } from '..';

  export default defineComponent({
    name: 'PageWrapper',
    components: { PageFooter, PageHeader },
    inheritAttrs: false,
    props: {
      title: propTypes.string,
      dense: propTypes.bool,
      ghost: propTypes.bool,
      content: propTypes.string,
      contentStyle: {
        type: Object as PropType<CSSProperties>,
      },
      contentBackground: propTypes.bool,
      contentFullHeight: propTypes.bool,
      contentClass: propTypes.string,
      fixedHeight: propTypes.bool,
      upwardSpace: propTypes.oneOfType([propTypes.number, propTypes.string]).def(0),
    },
    setup(props, { slots, attrs }) {
      const wrapperRef = ref(null);
      const headerRef = ref(null);
      const contentRef = ref(null);
      const footerRef = ref(null);
      const { prefixCls } = useDesign('page-wrapper');

      provide(
        PageWrapperFixedHeightKey,
        computed(() => props.fixedHeight),
      );

      const getIsContentFullHeight = computed(() => {
        return props.contentFullHeight;
      });

      const getUpwardSpace = computed(() => props.upwardSpace);
      const { redoHeight, setCompensation, contentHeight } = useContentHeight(
        getIsContentFullHeight,
        wrapperRef,
        [headerRef, footerRef],
        [contentRef],
        getUpwardSpace,
      );
      setCompensation({ useLayoutFooter: true, elements: [footerRef] });

      const getClass = computed(() => {
        return [
          prefixCls,
          {
            [`${prefixCls}--dense`]: props.dense,
          },
          attrs.class ?? {},
        ];
      });

      const getShowFooter = computed(() => slots?.leftFooter || slots?.rightFooter);

      const getHeaderSlots = computed(() => {
        return Object.keys(omit(slots, 'default', 'leftFooter', 'rightFooter', 'headerContent'));
      });

      const getContentStyle = computed((): CSSProperties => {
        const { contentFullHeight, contentStyle, fixedHeight } = props;
        if (!contentFullHeight) {
          return { ...contentStyle };
        }

        const height = `${unref(contentHeight)}px`;
        return {
          ...contentStyle,
          minHeight: height,
          ...(fixedHeight ? { height } : {}),
        };
      });

      const getContentClass = computed(() => {
        const { contentBackground, contentClass } = props;
        return [
          `${prefixCls}-content`,
          contentClass,
          {
            [`${prefixCls}-content-bg`]: contentBackground,
          },
        ];
      });

      watch(
        () => [getShowFooter.value],
        () => {
          redoHeight();
        },
        {
          flush: 'post',
          immediate: true,
        },
      );

      return {
        getContentStyle,
        wrapperRef,
        headerRef,
        contentRef,
        footerRef,
        getClass,
        getHeaderSlots,
        prefixCls,
        getShowFooter,
        omit,
        getContentClass,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-page-wrapper';

  .@{prefix-cls} {
    position: relative;

    .@{prefix-cls}-content {
      margin: 16px;
    }

    .ant-page-header {
      &:empty {
        padding: 0;
      }
    }

    &-content-bg {
      background-color: @component-background;
    }

    &--dense {
      .@{prefix-cls}-content {
        margin: 0;
      }
    }
  }
</style>
