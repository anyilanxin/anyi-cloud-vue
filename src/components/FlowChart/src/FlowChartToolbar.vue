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
  <div :class="`${prefixCls}-toolbar`" class="flex items-center px-2 py-1">
    <template v-for="item in toolbarItemList" :key="item.type">
      <Tooltip placement="bottom" v-bind="item.disabled ? { visible: false } : {}">
        <template #title>{{ item.tooltip }}</template>
        <span :class="`${prefixCls}-toolbar__icon`" v-if="item.icon" @click="onControl(item)">
          <Icon
            :icon="item.icon"
            :class="item.disabled ? 'cursor-not-allowed disabeld' : 'cursor-pointer'"
          />
        </span>
      </Tooltip>
      <Divider v-if="item.separate" type="vertical" />
    </template>
  </div>
</template>
<script lang="ts">
  import type { ToolbarConfig } from './types';

  import { defineComponent, ref, onUnmounted, unref, nextTick, watchEffect } from 'vue';
  import { Divider, Tooltip } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';

  import { useFlowChartContext } from './useFlowContext';
  import { ToolbarTypeEnum } from './enum';

  export default defineComponent({
    name: 'FlowChartToolbar',
    components: { Icon, Divider, Tooltip },
    props: {
      prefixCls: String,
    },
    emits: ['view-data'],
    setup(_, { emit }) {
      const toolbarItemList = ref<ToolbarConfig[]>([
        {
          type: ToolbarTypeEnum.ZOOM_IN,
          icon: 'codicon:zoom-out',
          tooltip: '缩小',
        },
        {
          type: ToolbarTypeEnum.ZOOM_OUT,
          icon: 'codicon:zoom-in',
          tooltip: '放大',
        },
        {
          type: ToolbarTypeEnum.RESET_ZOOM,
          icon: 'codicon:screen-normal',
          tooltip: '重置比例',
        },
        { separate: true },
        {
          type: ToolbarTypeEnum.UNDO,
          icon: 'ion:arrow-undo-outline',
          tooltip: '后退',
          disabled: true,
        },
        {
          type: ToolbarTypeEnum.REDO,
          icon: 'ion:arrow-redo-outline',
          tooltip: '前进',
          disabled: true,
        },
        { separate: true },
        {
          type: ToolbarTypeEnum.SNAPSHOT,
          icon: 'ion:download-outline',
          tooltip: '下载',
        },
        {
          type: ToolbarTypeEnum.VIEW_DATA,
          icon: 'carbon:document-view',
          tooltip: '查看数据',
        },
      ]);

      const { logicFlow } = useFlowChartContext();

      function onHistoryChange({ data: { undoAble, redoAble } }) {
        const itemsList = unref(toolbarItemList);
        const undoIndex = itemsList.findIndex((item) => item.type === ToolbarTypeEnum.UNDO);
        const redoIndex = itemsList.findIndex((item) => item.type === ToolbarTypeEnum.REDO);
        if (undoIndex !== -1) {
          unref(toolbarItemList)[undoIndex].disabled = !undoAble;
        }
        if (redoIndex !== -1) {
          unref(toolbarItemList)[redoIndex].disabled = !redoAble;
        }
      }

      const onControl = (item) => {
        const lf = unref(logicFlow);
        if (!lf) {
          return;
        }
        switch (item.type) {
          case ToolbarTypeEnum.ZOOM_IN:
            lf.zoom();
            break;
          case ToolbarTypeEnum.ZOOM_OUT:
            lf.zoom(true);
            break;
          case ToolbarTypeEnum.RESET_ZOOM:
            lf.resetZoom();
            break;
          case ToolbarTypeEnum.UNDO:
            lf.undo();
            break;
          case ToolbarTypeEnum.REDO:
            lf.redo();
            break;
          case ToolbarTypeEnum.SNAPSHOT:
            lf.getSnapshot();
            break;
          case ToolbarTypeEnum.VIEW_DATA:
            emit('view-data');
            break;
        }
      };

      watchEffect(async () => {
        if (unref(logicFlow)) {
          await nextTick();
          unref(logicFlow)?.on('history:change', onHistoryChange);
        }
      });

      onUnmounted(() => {
        unref(logicFlow)?.off('history:change', onHistoryChange);
      });
      return { toolbarItemList, onControl };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-flow-chart-toolbar';

  html[data-theme='dark'] {
    .lf-dnd {
      background: #080808;
    }
  }
  .@{prefix-cls} {
    height: 36px;
    background-color: @app-content-background;
    border-bottom: 1px solid @border-color-base;

    .disabeld {
      color: @disabled-color;
    }

    &__icon {
      display: inline-block;
      padding: 2px 4px;
      margin-right: 10px;

      &:hover {
        color: @primary-color;
      }
    }
  }
</style>
