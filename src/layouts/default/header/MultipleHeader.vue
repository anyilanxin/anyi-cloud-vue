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
  <div :style="getPlaceholderDomStyle" v-if="getIsShowPlaceholderDom"></div>
  <div :style="getWrapStyle" :class="getClass">
    <LayoutHeader v-if="getShowInsetHeaderRef" />
    <MultipleTabs v-if="getShowTabs" />
    <SlideXTransition>
      <a-alert
        type="info"
        class="banner-notice"
        banner
        closable
        v-if="getShowBannerNotice"
        @close="handleClose"
      >
        <template #icon><AlertOutlined />({{ bannerNoticeList.length }})</template>
        <template #message>
          <div
            ref="contentParentDomRef"
            class="content-banner-notice-parent"
            @mouseenter="handleAnimate(0)"
            @mouseleave="handleAnimate(1)"
          >
            <div ref="contentDomRef" class="content-banner-notice">
              {{ noticeInfo['data'] }}
            </div>
          </div>
        </template>
      </a-alert>
    </SlideXTransition>
  </div>
</template>
<script lang="ts" setup>
  import { unref, computed, CSSProperties, onMounted, ref, nextTick } from 'vue';
  import { SlideXTransition } from '/@/components/Transition';
  import LayoutHeader from './index.vue';
  import { AlertOutlined } from '@ant-design/icons-vue';
  import MultipleTabs from '../tabs/index.vue';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useFullContent } from '/@/hooks/web/useFullContent';
  import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';
  import { useAppInject } from '/@/hooks/web/useAppInject';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useLayoutHeight } from '../content/useContentViewHeight';
  import { connectWebSocket, onWebSocket, SocketMessageEvent } from '/@/hooks/web/useWebSocket';
  const HEADER_HEIGHT = 48;
  const TABS_HEIGHT = 32;
  const BANNER_NOTICE_HEIGHT = 32;
  const contentDomRef = ref();
  const contentParentDomRef = ref();
  const noticeInfo = ref('');
  const animate = ref();
  const isAnimating = ref(false);
  const { setHeaderHeight } = useLayoutHeight();
  const { prefixCls } = useDesign('layout-multiple-header');
  const { getCalcContentWidth, getSplit } = useMenuSetting();
  const { getIsMobile } = useAppInject();
  const {
    getFixed,
    getShowInsetHeaderRef,
    getShowFullHeaderRef,
    getHeaderTheme,
    getShowHeader,
    getShowNotice,
  } = useHeaderSetting();
  const bannerNoticeList = ref<string[]>([]);
  const { getFullContent } = useFullContent();

  const { getShowMultipleTab } = useMultipleTabSetting();

  const getShowTabs = computed(() => {
    return unref(getShowMultipleTab) && !unref(getFullContent);
  });

  const getShowBannerNotice = computed(() => {
    return unref(getShowNotice) && !unref(getFullContent) && unref(bannerNoticeList).length > 0;
  });

  const getIsShowPlaceholderDom = computed(() => {
    return unref(getFixed) || unref(getShowFullHeaderRef);
  });

  const getWrapStyle = computed((): CSSProperties => {
    const style: CSSProperties = {};
    if (unref(getFixed)) {
      style.width = unref(getIsMobile) ? '100%' : unref(getCalcContentWidth);
    }
    if (unref(getShowFullHeaderRef)) {
      style.top = `${HEADER_HEIGHT}px`;
    }
    return style;
  });

  const getIsFixed = computed(() => {
    return unref(getFixed) || unref(getShowFullHeaderRef);
  });

  const getPlaceholderDomStyle = computed((): CSSProperties => {
    let height = 0;
    if (
      (unref(getShowFullHeaderRef) || !unref(getSplit)) &&
      unref(getShowHeader) &&
      !unref(getFullContent)
    ) {
      height += HEADER_HEIGHT;
    }
    if (unref(getShowMultipleTab) && !unref(getFullContent)) {
      height += TABS_HEIGHT;
    }
    if (unref(getShowBannerNotice) && !unref(getFullContent)) {
      height += BANNER_NOTICE_HEIGHT;
    }
    setHeaderHeight(height);
    return {
      height: `${height}px`,
    };
  });
  onMounted(() => {
    nextTick(() => {
      connectWebSocket();
    });
    onWebSocket(handleBannerNotice, SocketMessageEvent.NOTICE_EVENT);
  });
  function handleBannerNotice(data: any) {
    if (data.type == 1 && data.showType == 1) {
      bannerNoticeList.value.push(data);
      if (!isAnimating.value) {
        isAnimating.value = true;
        setTimeout(startAnimate, 2000);
      }
    }
  }
  async function startAnimate() {
    while (bannerNoticeList.value && bannerNoticeList.value.length > 0) {
      noticeInfo.value = bannerNoticeList.value[0] as string;
      const ballEl = contentParentDomRef.value;
      if (ballEl) {
        const offsetWidth = ballEl.offsetWidth;
        animate.value = contentDomRef.value.animate(
          {
            transform: [`translateX(${offsetWidth}px)`, `translateX(0px)`],
          },
          {
            duration: 3000,
            fill: 'forwards',
            easing: 'ease-out',
          },
        );
        await animate.value.finished;
        // 暂停部分
        const contentEl = contentDomRef.value;
        const itemWidth = contentEl.getBoundingClientRect().width;
        const gapWidth = Math.max(0, itemWidth - offsetWidth + 50);
        const duration = Math.max(0, Math.floor(gapWidth / 200) * 1000);
        animate.value = contentEl.animate(
          {
            transform: [`translateX(0px)`, `translateX(-${gapWidth}px)`],
          },
          {
            duration,
            delay: 3000,
            fill: 'forwards',
            easing: 'linear',
          },
        );
        await animate.value.finished;
        // 滑出部分
        animate.value = contentEl.animate(
          {
            transform: [`translateX(-${gapWidth}px)`, `translateX(-${itemWidth}px)`],
          },
          {
            duration: 1000,
            fill: 'forwards',
            easing: 'ease-in',
          },
        );
        await animate.value.finished;
      }
      bannerNoticeList.value.splice(0, 1);
    }
    isAnimating.value = false;
  }
  function handleAnimate(type: number) {
    if (animate.value?.playState !== 'finished') {
      if (type == 0) {
        animate.value?.pause();
      } else {
        animate.value?.play();
      }
    }
  }
  function handleClose() {
    bannerNoticeList.value = [];
  }
  const getClass = computed(() => {
    return [
      prefixCls,
      `${prefixCls}--${unref(getHeaderTheme)}`,
      { [`${prefixCls}--fixed`]: unref(getIsFixed) },
    ];
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-layout-multiple-header';

  .@{prefix-cls} {
    transition: width 0.2s;
    flex: 0 0 auto;

    &--dark {
      margin-left: -1px;
    }

    &--fixed {
      position: fixed;
      top: 0;
      z-index: @multiple-tab-fixed-z-index;
      width: 100%;
    }

    .banner-notice {
      height: 32px;
      padding: 0px 10px;
      line-height: 32px;
    }

    .content-banner-notice-parent {
      margin: 0px 5px;
      white-space: nowrap;
      text-align: center;
      position: relative;
      height: 32px;
      line-height: 32px;
      align-items: center;
      overflow: hidden;

      .content-banner-notice {
        position: absolute;
        height: 100%;
        white-space: nowrap;
        transition-timing-function: linear;
      }
    }
  }
</style>
