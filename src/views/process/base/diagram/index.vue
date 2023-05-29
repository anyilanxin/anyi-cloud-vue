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
  <div>
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleToDesign('')"
          >新建模型</a-button
        >
        <a-button color="warning" preIcon="ant-design:cloud-upload-outlined" @click="handleImport"
          >导入</a-button
        >
        <a-button color="success" preIcon="ant-design:cloud-download-outlined" @click="handleExport"
          >导出</a-button
        >
      </template>
      <template #form-category="{ model, field }">
        <a-select
          v-model:value="model[field]"
          style="width: 100%"
          allowClear
          placeholder="请选择流程类别"
          :options="
            categoryList.map((item) => ({ value: item.categoryCode, label: item.categoryName }))
          "
        />
      </template>
      <template #processDefinitionKeys="{ record }">
        <span>
          <CopyOutlined
            class="copy-class"
            @click="copyInfo(record.processDefinitionKeys)"
            v-if="record.processDefinitionKeys"
          />
          {{ record.processDefinitionKeys || '' }}
        </span>
      </template>
      <template #modelState="{ record }">
        <a-badge status="processing" v-if="record.modelState == 1" text="已经部署" />
        <a-badge
          status="default"
          v-else-if="record.modelState == 2"
          color="gold"
          text="新版本待部署"
        />
        <a-badge status="default" v-else text="未部署" />
      </template>
      <template #headerTop>
        <Alert type="info" show-icon>
          <template #message>
            <div style="display: flex">
              <div style="margin-right: 20px; font-weight: 450">
                <span style="margin-right: 5px">未部署:</span>
                <span class="text-yellow-600">{{ statInfo.noDeployment }}</span>
              </div>
              <div style="margin-right: 20px; font-weight: 450">
                <span style="margin-right: 5px">已部署:</span>
                <span class="text-blue-400">{{ statInfo.deployment }}</span>
              </div>
              <div style="margin-right: 20px; font-weight: 450">
                <span style="margin-right: 5px">新版本待部署:</span>
                <span class="text-green-400">{{ statInfo.newVersion }}</span>
              </div>
            </div>
          </template>
        </Alert>
      </template>
      <template #action="{ record }">
        <TableAction
          stopButtonPropagation
          :actions="[
            {
              label: '编辑',
              icon: 'clarity:note-edit-line',
              tooltip: '编辑',
              onClick: handleToDesign.bind(null, record.modelId),
            },
            {
              label: '预览',
              icon: 'ant-design:eye-outlined',
              tooltip: '预览',
              onClick: handleView.bind(null, record.modelId),
            },
            {
              label: '部署',
              icon: 'ant-design:node-expand-outlined',
              tooltip: '部署',
              ifShow: () => record.modelState !== 1,
              onClick: handleDeployment.bind(null, record.modelId),
            },
            {
              label: '历史',
              icon: 'ant-design:bars-outlined',
              tooltip: '历史管理',
              onClick: handleHistoryDeployment.bind(null, record.modelId),
              ifShow: () => record.deploymentId,
            },
          ]"
          :dropDownActions="[
            {
              label: '复制',
              onClick: handleCopy.bind(null, record.modelId),
            },
            {
              label: '导出',
              onClick: handleView.bind(null, record.modelId),
            },
            {
              label: '删除',
              onClick: handleDelete.bind(null, record),
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
    <DiagramDeployment @register="registerDeploymentModal" width="34%" @success="handleReloadAll" />
    <DiagramDelete @register="deleteModal" width="34%" @success="handleReloadAll" />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, ref, nextTick } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { SkillFullBpmnPreview } from 'skillfull-process-pro-antvue';
  import DiagramDeployment from './DiagramDeployment.vue';
  import DiagramDelete from './DiagramDelete.vue';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { CopyOutlined } from '@ant-design/icons-vue';
  import { router } from '/@/router';
  import { columns, searchFormSchema } from './diagram.data';
  import { selectPage, statistics, getById } from '/@/api/modules/process/base/designModel';
  import type { DesignModelDeploymentStatiDto } from '/@/api/modules/process/base/model/designModelModel';
  import { getList } from '/@/api/modules/process/base/processCategory';
  import { ProcessCategoryDto } from '/@/api/modules/process/base/model/processCategoryModel';
  import { Alert } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  const { createMessage } = useMessage();
  const { clipboardRef, copiedRef } = useCopyToClipboard();
  const [registerPreviesModal, { openModal: openPreviewModal }] = useModal();
  const [registerDeploymentModal, { openModal: openModelDeploymentModal }] = useModal();
  const [deleteModal, { openModal: openDeleteModal }] = useModal();
  const categoryList = ref<ProcessCategoryDto[]>([]);
  const searchInfo = reactive<Recordable>({});
  const bpmnPreviewTitle = ref('');
  const bpmnPreviewDomRef = ref();
  const statInfo = ref<DesignModelDeploymentStatiDto>({
    noDeployment: 0,
    deployment: 0,
    newVersion: 0,
  });
  const [registerTable, { reload }] = useTable({
    title: '模型列表',
    api: selectPage,
    rowKey: 'modelId',
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      alwaysShowLines: 1,
      autoAdvancedLine: 1,
    },
    useSearchForm: true,
    indexColumnProps: {
      width: 70,
    },
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    bordered: true,
    actionColumn: {
      width: 320,
      title: '操作',
      align: 'left',
      fixed: 'right',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  async function getCategory() {
    categoryList.value = await getList({ categoryState: 1 });
  }
  async function handleCopy(modelId: string) {
    router.push({
      name: 'FixedPageModelDesign',
      query: {
        modelId: modelId ? modelId : '',
        isCopy: 'true',
      },
    });
  }
  function handleDelete(record: any) {
    openDeleteModal(true, { ...record });
  }
  async function handleView(modelId: string) {
    const data = await getById(modelId);
    bpmnPreviewTitle.value = data.diagramNames;
    openPreviewModal(true);
    nextTick(() => {
      bpmnPreviewDomRef.value.viewBase64Bpmn(data.diagramData);
    });
  }
  function handleReloadAll() {
    reload();
    getModelStat();
  }
  async function getModelStat() {
    const data = await statistics();
    statInfo.value = data;
  }
  async function handleDeployment(modelId: string) {
    openModelDeploymentModal(true, {
      modelId: modelId,
    });
  }
  function handleToDesign(modelId?: string) {
    router.push({
      name: 'FixedPageModelDesign',
      query: {
        modelId: modelId ? modelId : '',
      },
    });
  }
  function handleHistoryDeployment(modelId: string) {
    router.push({
      name: 'FixedPageHistoryDeployment',
      query: {
        modelId: modelId,
      },
    });
  }
  function handleImport() {}
  function handleExport() {}
  function copyInfo(info: any) {
    clipboardRef.value = info;
    if (copiedRef.value) {
      createMessage.success('复制成功');
    }
  }
  onMounted(() => {
    getCategory();
    getModelStat();
  });
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
