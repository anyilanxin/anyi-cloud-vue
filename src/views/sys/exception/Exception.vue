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
<script lang="tsx">
  import type { PropType } from 'vue';
  import { Result, Button } from 'ant-design-vue';
  import { defineComponent, ref, computed, unref } from 'vue';
  import { ExceptionEnum } from '/@/enums/exceptionEnum';
  import notDataSvg from '/@/assets/svg/no-data.svg';
  import netWorkSvg from '/@/assets/svg/net-error.svg';
  import { useRoute } from 'vue-router';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useGo, useRedo } from '/@/hooks/web/usePage';
  import { PageEnum } from '/@/enums/pageEnum';

  interface MapValue {
    title: string;
    subTitle: string;
    btnText?: string;
    icon?: string;
    handler?: Fn;
    status?: string;
  }

  export default defineComponent({
    name: 'ErrorPage',
    props: {
      // 状态码
      status: {
        type: Number as PropType<number>,
        default: ExceptionEnum.PAGE_NOT_FOUND,
      },

      title: {
        type: String as PropType<string>,
        default: '',
      },

      subTitle: {
        type: String as PropType<string>,
        default: '',
      },

      full: {
        type: Boolean as PropType<boolean>,
        default: false,
      },
    },
    setup(props) {
      const statusMapRef = ref(new Map<string | number, MapValue>());

      const { query } = useRoute();
      const go = useGo();
      const redo = useRedo();
      const { t } = useI18n();
      const { prefixCls } = useDesign('app-exception-page');

      const getStatus = computed(() => {
        const { status: routeStatus } = query;
        const { status } = props;
        return Number(routeStatus) || status;
      });

      const getMapValue = computed((): MapValue => {
        return unref(statusMapRef).get(unref(getStatus)) as MapValue;
      });

      const backLoginI18n = t('sys.exception.backLogin');
      const backHomeI18n = t('sys.exception.backHome');

      unref(statusMapRef).set(ExceptionEnum.PAGE_NOT_ACCESS, {
        title: '403',
        status: `${ExceptionEnum.PAGE_NOT_ACCESS}`,
        subTitle: t('sys.exception.subTitle403'),
        btnText: props.full ? backLoginI18n : backHomeI18n,
        handler: () => (props.full ? go(PageEnum.BASE_LOGIN) : go()),
      });

      unref(statusMapRef).set(ExceptionEnum.PAGE_NOT_FOUND, {
        title: '404',
        status: `${ExceptionEnum.PAGE_NOT_FOUND}`,
        subTitle: t('sys.exception.subTitle404'),
        btnText: props.full ? backLoginI18n : backHomeI18n,
        handler: () => (props.full ? go(PageEnum.BASE_LOGIN) : go()),
      });

      unref(statusMapRef).set(ExceptionEnum.ERROR, {
        title: '500',
        status: `${ExceptionEnum.ERROR}`,
        subTitle: t('sys.exception.subTitle500'),
        btnText: backHomeI18n,
        handler: () => go(),
      });

      unref(statusMapRef).set(ExceptionEnum.PAGE_NOT_DATA, {
        title: t('sys.exception.noDataTitle'),
        subTitle: '',
        btnText: t('common.redo'),
        handler: () => redo(),
        icon: notDataSvg,
      });

      unref(statusMapRef).set(ExceptionEnum.NET_WORK_ERROR, {
        title: t('sys.exception.networkErrorTitle'),
        subTitle: t('sys.exception.networkErrorSubTitle'),
        btnText: t('common.redo'),
        handler: () => redo(),
        icon: netWorkSvg,
      });

      return () => {
        const { title, subTitle, btnText, icon, handler, status } = unref(getMapValue) || {};
        return (
          <Result
            class={prefixCls}
            status={status as any}
            title={props.title || title}
            sub-title={props.subTitle || subTitle}
          >
            {{
              extra: () =>
                btnText && (
                  <Button type="primary" onClick={handler}>
                    {() => btnText}
                  </Button>
                ),
              icon: () => (icon ? <img src={icon} /> : null),
            }}
          </Result>
        );
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-app-exception-page';

  .@{prefix-cls} {
    display: flex;
    align-items: center;
    flex-direction: column;

    .ant-result-icon {
      img {
        max-width: 400px;
        max-height: 300px;
      }
    }
  }
</style>
