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
  <PageWrapper dense contentFullHeight contentClass="flex">
    <CategoryList class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <BasicTable
      @register="registerTable"
      class="w-3/4 xl:w-4/5"
      :searchInfo="searchInfo"
      @fetch-success="expandTableAll"
    >
      <template #processDefinitionKey="{ record }">
        <span>
          <CopyOutlined class="copy-class" @click="copyInfo(record.processDefinitionKey)" />
          {{ record.processDefinitionKey }}
        </span>
      </template>
      <template #action="{ record }">
        <TableAction
          stopButtonPropagation
          :actions="[
            {
              icon: 'ant-design:select-outlined',
              label: '发起流程',
              color: 'success',
              auth: 'update',
              onClick: handleToSubmit.bind(null, record.processDefinitionKey),
            },
            {
              icon: 'ant-design:eye-outlined',
              label: '预览',
              onClick: handleView.bind(null, record.processDefinitionKey),
            },
          ]"
        />
      </template>
    </BasicTable>
    <BasicModal
      @register="registerPreviesModal"
      v-bind="$attrs"
      :canFullscreen="false"
      :title="bpmnPreviewTitle"
      :showCancelBtn="false"
      :showOkBtn="false"
      width="44%"
      :height="400"
    >
      <SkillFullBpmnPreview
        ref="bpmnPreviewDomRef"
        buttonPosition="top"
        size="small"
        useExternalHeight
        :externalHeight="340"
        :showMinimap="false"
      />
    </BasicModal>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { reactive, nextTick, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import {
    selectPageDefinition,
    getDeploymentDetail,
  } from '/@/api/modules/process/manage/definitionManage';
  import { router } from '/@/router';
  import { PageWrapper } from '/@/components/Page';
  import { CopyOutlined } from '@ant-design/icons-vue';
  import { SkillFullBpmnPreview } from 'skillfull-process-pro-antvue';
  import CategoryList from './CategoryList.vue';
  import { useModal, BasicModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { columns, searchFormSchema } from './market.data';
  const { createMessage } = useMessage();
  const [registerPreviesModal, { openModal: openPreviewModal }] = useModal();
  const { clipboardRef, copiedRef } = useCopyToClipboard();
  const searchInfo = reactive<Recordable>({ newVersion: true });
  const bpmnPreviewTitle = ref('');
  const bpmnPreviewDomRef = ref();
  const [registerTable, { reload, expandAll }] = useTable({
    title: '流程列表',
    api: selectPageDefinition,
    rowKey: 'processDefinitionId',
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      alwaysShowLines: 1,
      autoAdvancedLine: 1,
    },
    useSearchForm: true,
    bordered: true,
    canResize: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    indexColumnProps: {
      width: 80,
    },
    actionColumn: {
      width: 160,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });

  function handleToSubmit(processDefinitionKey: string) {
    router.push({
      name: 'FixedPageSubmitProcess',
      query: {
        processDefinitionKey,
      },
    });
  }
  async function handleView(processDefinitionKey: string) {
    const data = await getDeploymentDetail(processDefinitionKey);
    bpmnPreviewTitle.value = data.deploymentName;
    openPreviewModal(true);
    nextTick(() => {
      bpmnPreviewDomRef.value.viewBase64Bpmn(data.diagramData);
    });
  }
  function expandTableAll() {
    nextTick(expandAll);
  }
  function copyInfo(info: any) {
    clipboardRef.value = info;
    if (copiedRef.value) {
      createMessage.success('复制成功');
    }
  }
  function handleSelect(categoryCode = '') {
    searchInfo.category = categoryCode;
    reload();
  }
</script>

<style lang="less">
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
  @import 'bpmn-js/dist/assets/bpmn-js.css';
  @import 'bpmn-js/dist/assets/diagram-js.css';
  @import 'diagram-js-minimap/assets/diagram-js-minimap.css';

  .copy-class {
    color: @primary-color;
    cursor: pointer;
  }

  .skillfull-bpmn-preview {
    background-color: @component-background !important;
  }

  .skillfull-bpmn-preview-content-diagram {
    overflow-y: hidden !important;
  }
</style>
