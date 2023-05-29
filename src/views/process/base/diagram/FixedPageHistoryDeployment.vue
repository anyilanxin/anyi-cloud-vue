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
  <PageWrapper @back="goBack" :title="'历史部署' + `(${modeDetail['diagramNames']})`">
    <div>
      <BasicTable @register="registerTable" :searchInfo="searchInfo">
        <template #processDefinitionIds="{ record }">
          <span>
            <CopyOutlined class="copy-class" @click="copyInfo(record.processDefinitionIds)" />
            {{ record.processDefinitionIds && record.processDefinitionIds.toString() }}
          </span>
        </template>
        <template #processDefinitionKeys="{ record }">
          <span>
            <CopyOutlined class="copy-class" @click="copyInfo(record.processDefinitionKeys)" />
            {{ record.processDefinitionKeys }}
          </span>
        </template>
        <template #toolbar>
          <a-button
            color="success"
            preIcon="ant-design:cloud-download-outlined"
            @click="handleExport"
            >导出</a-button
          >
        </template>
        <template #haveRunTask="{ record }">
          <a-tag color="processing" v-if="record.active != 0 || record.suspended != 0">
            <template #icon>
              <SyncOutlined :spin="true" />
            </template>
            有任务
          </a-tag>
          <a-tag color="default" v-else>
            <template #icon>
              <ClockCircleOutlined />
            </template>
            无任务
          </a-tag>
        </template>
        <template #action="{ record }">
          <TableAction
            stopButtonPropagation
            :actions="[
              {
                label: '预览',
                icon: 'ant-design:eye-outlined',
                tooltip: '预览',
                onClick: handleView.bind(null, record.historyModelId),
              },
              {
                label: '再次部署',
                icon: 'ant-design:node-expand-outlined',
                tooltip: '部署',
                onClick: handleDeployment.bind(null, record.historyModelId),
              },
            ]"
            :dropDownActions="[
              {
                label: '设置最新',
                onClick: handleSetNewVersion.bind(null, record.historyModelId),
              },

              {
                label: '复制',
                onClick: handleCopy.bind(null, record.historyModelId),
              },
              {
                label: '导出',
                onClick: handleView.bind(null, record.historyModelId),
              },
              {
                label: '删除',
                onClick: handleDelete.bind(null, record),
              },
            ]"
          />
        </template>
        <template #suspensionState="{ record }">
          <a-badge
            status="processing"
            v-if="record.suspended == 0 && record.active > 0"
            text="激活"
          />
          <a-badge status="error" v-else-if="record.suspended > 0" text="有挂起" />
          <a-badge status="default" v-else-if="record.totalNum == 0" text="无任务" />
          <a-badge status="warning" v-else text="完成或终止" />
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
      <DiagramHistoryDelete @register="deleteModal" width="34%" @success="handleReloadAll" />
      <DiagramDeploymentHistory
        @register="registerDeploymentModal"
        width="34%"
        @success="handleReloadAll"
      />
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { SyncOutlined, ClockCircleOutlined } from '@ant-design/icons-vue';
  import { reactive, ref, onMounted, nextTick } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { SkillFullBpmnPreview } from 'skillfull-process-pro-antvue';
  import DiagramHistoryDelete from './DiagramHistoryDelete.vue';
  import DiagramDeploymentHistory from './DiagramDeploymentHistory.vue';
  import { historyDeployment } from '/@/api/modules/process/manage/definitionManage';
  import { PageWrapper } from '/@/components/Page';
  import { CopyOutlined } from '@ant-design/icons-vue';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useRoute, useRouter } from 'vue-router';
  import { getById as getModelDetail } from '/@/api/modules/process/base/designModel';
  import { historyDeploymentColumns, searchHistoryDeploymentFormSchema } from './diagram.data';
  import { selectPage, getById } from '/@/api/modules/process/base/designModelHistory';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  const { notification, createMessage } = useMessage();
  const [registerPreviesModal, { openModal: openPreviewModal }] = useModal();
  const { clipboardRef, copiedRef } = useCopyToClipboard();
  const [deleteModal, { openModal: openDeleteModal }] = useModal();
  const route = useRoute();
  const router = useRouter();
  const { closeCurrent } = useTabs();
  const [registerDeploymentModal, { openModal: openModelDeploymentModal }] = useModal();
  const modelId = ref(route.query?.modelId as string);
  const modeDetail = ref({});
  const searchInfo = reactive<Recordable>({});
  const bpmnPreviewTitle = ref('');
  const bpmnPreviewDomRef = ref();
  searchInfo.modelId = modelId.value;
  const [registerTable, { reload }] = useTable({
    api: selectPage,
    rowKey: 'historyModelId',
    columns: historyDeploymentColumns,
    formConfig: {
      labelWidth: 120,
      schemas: searchHistoryDeploymentFormSchema,
      autoSubmitOnEnter: true,
    },
    indentSize: 10,
    useSearchForm: true,
    showTableSetting: true,
    canResize: true,
    indexColumnProps: {
      width: 70,
    },
    tableSetting: { fullScreen: true },
    bordered: true,
    actionColumn: {
      width: 210,
      title: '操作',
      align: 'left',
      fixed: 'right',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  async function handleCopy(historyModelId: string) {
    router.push({
      name: 'FixedPageModelDesign',
      query: {
        modelId: historyModelId,
        isCopy: 'true',
        history: 'true',
      },
    });
  }
  function handleDelete(record: any) {
    openDeleteModal(true, { ...record });
  }
  async function handleView(historyModelId: string) {
    const data = await getById(historyModelId);
    bpmnPreviewTitle.value = data.diagramNames;
    openPreviewModal(true);
    nextTick(() => {
      bpmnPreviewDomRef.value.viewBase64Bpmn(data.diagramData);
    });
  }
  async function handleSetNewVersion(historyModelId: string) {
    const data = await getById(historyModelId);
    const deploymentInfo = {
      deploymentName: data.diagramNames,
      deploymentId: data.deploymentId,
      historyModelId: data.historyModelId,
    };
    await historyDeployment(deploymentInfo);
    notification.success({
      message: '通知',
      description: '设置为有效版本成功',
      duration: 3,
    });
    reload();
  }
  function handleReloadAll() {
    reload();
  }
  async function handleDeployment(historyModelId: string) {
    openModelDeploymentModal(true, {
      historyModelId: historyModelId,
    });
  }
  async function getModelDetailInfo() {
    modeDetail.value = await getModelDetail(modelId.value);
  }
  function handleExport() {}
  function goBack() {
    closeCurrent();
    router.back();
  }
  function copyInfo(info: any) {
    clipboardRef.value = info;
    if (copiedRef.value) {
      createMessage.success('复制成功');
    }
  }
  onMounted(() => {
    getModelDetailInfo();
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
