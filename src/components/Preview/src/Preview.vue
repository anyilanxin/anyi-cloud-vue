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
  <div :class="prefixCls">
    <PreviewGroup>
      <slot v-if="!imageList || $slots.default"></slot>
      <template v-else>
        <template v-for="item in getImageList" :key="item.src">
          <Image v-bind="item">
            <template #placeholder v-if="item.placeholder">
              <Image v-bind="item" :src="item.placeholder" :preview="false" />
            </template>
          </Image>
        </template>
      </template>
    </PreviewGroup>
  </div>
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import { defineComponent, computed } from 'vue';

  import { Image } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { propTypes } from '/@/utils/propTypes';
  import { isString } from '/@/utils/is';

  interface ImageProps {
    alt?: string;
    fallback?: string;
    src: string;
    width: string | number;
    height?: string | number;
    placeholder?: string | boolean;
    preview?:
      | boolean
      | {
          visible?: boolean;
          onVisibleChange?: (visible: boolean, prevVisible: boolean) => void;
          getContainer: string | HTMLElement | (() => HTMLElement);
        };
  }

  type ImageItem = string | ImageProps;

  export default defineComponent({
    name: 'ImagePreview',
    components: {
      Image,
      PreviewGroup: Image.PreviewGroup,
    },
    props: {
      functional: propTypes.bool,
      imageList: {
        type: Array as PropType<ImageItem[]>,
      },
    },
    setup(props) {
      const { prefixCls } = useDesign('image-preview');

      const getImageList = computed((): any[] => {
        const { imageList } = props;
        if (!imageList) {
          return [];
        }
        return imageList.map((item) => {
          if (isString(item)) {
            return {
              src: item,
              placeholder: false,
            };
          }
          return item;
        });
      });

      return {
        prefixCls,
        getImageList,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-image-preview';

  .@{prefix-cls} {
    .ant-image {
      margin-right: 10px;
    }

    .ant-image-preview-operations {
      background-color: rgb(0 0 0 / 40%);
    }
  }
</style>
