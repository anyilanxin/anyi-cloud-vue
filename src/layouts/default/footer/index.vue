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
  <Footer :class="prefixCls" ref="footerRef" v-if="getShowLayoutFooter || forceShow">
    <div :class="`${prefixCls}__links`">
      <a @click="openWindow(SITE_URL)">{{ t('layout.footer.contactMe') }}</a>
      <a-divider type="vertical" />
      <a @click="openWindow(DOC_URL)">{{ t('layout.footer.onlineDocument') }}</a>
      <a-divider type="vertical" />
      <a @click="openWindow(DOC_URL)">{{ t('layout.footer.question') }}</a>
      <a-divider type="vertical" />
      <a @click="openWindow(GITHUB_URL)">GitHub</a>
    </div>
    <div :class="`${prefixCls}__links`">
      <a class="beian" @click="openWindow(BEIAN_URL)">黔ICP备18011950号-1 </a>
      Copyright &copy;2020 ZXiaoZhou&nbsp;&nbsp;版权所有
    </div>
  </Footer>
</template>

<script lang="ts" setup>
  import { computed, unref, ref } from 'vue';
  import { Layout } from 'ant-design-vue';
  import { DOC_URL, SITE_URL, GITHUB_URL } from '/@/settings/siteSetting';
  import { openWindow } from '/@/utils';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { useRouter } from 'vue-router';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useLayoutHeight } from '../content/useContentViewHeight';
  import { propTypes } from '/@/utils/propTypes';
  defineProps({
    forceShow: propTypes.bool.def(false),
  });
  const Footer = Layout.Footer;
  const { t } = useI18n();
  const { getShowFooter } = useRootSetting();
  const { currentRoute } = useRouter();
  const { prefixCls } = useDesign('layout-footer');
  const BEIAN_URL = ref<string>('https://beian.miit.gov.cn');
  const footerRef = ref<ComponentRef>(null);
  const { setFooterHeight } = useLayoutHeight();

  const getShowLayoutFooter = computed(() => {
    if (unref(getShowFooter)) {
      const footerEl = unref(footerRef)?.$el;
      setFooterHeight(footerEl?.offsetHeight || 0);
    } else {
      setFooterHeight(0);
    }
    return unref(getShowFooter) && !unref(currentRoute).meta?.hiddenFooter;
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-footer';

  @normal-light-color: #313131;
  @hover-light-color: #007aff;
  @normal-dark-color: #a3a3af;
  @hover-dark-color: #007aff;

  .@{prefix-cls} {
    font-weight: 400;
    color: @normal-light-color;
    text-align: center;
    padding: 5px 50px;

    &__links {
      margin-bottom: 8px;

      a {
        color: @normal-light-color;

        &:hover {
          color: @hover-light-color;
          border-bottom: 2px solid @hover-light-color;
        }
      }

      .ant-divider {
        background-color: #7b7474;
      }

      .beian {
        margin-right: 10px;
      }
    }

    &__github {
      margin: 0 30px;

      &:hover {
        color: @hover-light-color;
      }
    }
  }

  [data-theme='dark'] .@{prefix-cls} {
    color: @normal-dark-color !important;
    text-align: center;
    padding: 5px 50px;

    &__links {
      margin-bottom: 8px;

      a {
        color: @normal-dark-color !important;

        &:hover {
          color: @hover-dark-color !important;
        }
      }

      .ant-divider {
        background-color: #7b7474 !important;
      }
    }

    &__github {
      margin: 0 30px;

      &:hover {
        color: @hover-dark-color !important;
      }
    }
  }
</style>
