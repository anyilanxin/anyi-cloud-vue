<template>
  <div ref="registerTableDomRef">
    <BasicTable
      @register="registerTable"
      @selection-change="handleSelectionChange"
      @expand="handleExpandedChange"
    >
      <template #toolbar>
        <a-button
          type="primary"
          danger
          v-show="data.keys.length > 0"
          :loading="loading.deleteBatch"
          :preIcon="!loading.deleteBatch ? 'ant-design:delete-outlined' : ''"
          @click="handleDeleteBatch"
          v-auth="'deleteBatch'"
          >批量删除</a-button
        >
        <a-button
          color="success"
          :loading="loading.export"
          :preIcon="!loading.export ? 'ant-design:cloud-download-outlined' : ''"
          @click="handleExport"
          v-auth="'export'"
          >导出</a-button
        >
      </template>
      <template #operateStatus="{ record }">
        <a-tag color="processing" v-if="record.operateStatus == 1"> 成功 </a-tag>
        <a-tag color="warning" v-else>失败</a-tag>
      </template>
      <!-- <template #expandedRowRender="{ record }">
        <div style="text-align: center">
          <a-spin :spinning="data.logInfo[record.operateId]?.loading" />
        </div>
        <template v-if="!data.logInfo[record.operateId]?.loading">
          <a-empty v-if="!data.logInfo[record.operateId]?.data" />
          <div v-else style="width: 65%">
            <a-descriptions bordered :column="12" :labelStyle="{ width: '200px' }">
              <a-descriptions-item label="日志编号" :span="6">
                {{ data.logInfo[record.operateId].data.logCode }}
              </a-descriptions-item>
              <a-descriptions-item label="操作用户" :span="6">
                {{ data.logInfo[record.operateId].data.userName }}
              </a-descriptions-item>
              <a-descriptions-item label="客户端编号" :span="6">
                {{ data.logInfo[record.operateId].data.requestClientCode }}
              </a-descriptions-item>
              <a-descriptions-item label="客户端名称" :span="6">
                {{ data.logInfo[record.operateId].data.requestClientName }}
              </a-descriptions-item>
              <a-descriptions-item label="请求ip" :span="6">
                {{ data.logInfo[record.operateId].data.requestIp }}
              </a-descriptions-item>
              <a-descriptions-item label="请求状态" :span="6">
                <a-tag
                  color="processing"
                  v-if="data.logInfo[record.operateId].data.operateStatus == 1"
                >
                  成功
                </a-tag>
                <a-tag color="warning" v-else>失败</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="日志类型" :span="6">
                {{ data.logInfo[record.operateId].data.logTypeDescribe }}
              </a-descriptions-item>
              <a-descriptions-item label="数据来源" :span="6">
                {{ data.logInfo[record.operateId].data.dataSources }}
              </a-descriptions-item>
              <a-descriptions-item label="请求开始时间" :span="6">
                {{ data.logInfo[record.operateId].data.requestStartTime }}
              </a-descriptions-item>
              <a-descriptions-item label="请求结束时间" :span="6">
                {{ data.logInfo[record.operateId].data.requestEndTime }}
              </a-descriptions-item>
              <a-descriptions-item label="耗时" :span="6">
                {{ data.logInfo[record.operateId].data.costTime }}
              </a-descriptions-item>
              <a-descriptions-item label="请求方法" :span="6">
                {{ data.logInfo[record.operateId].data.requestMethod }}
              </a-descriptions-item>
              <a-descriptions-item :span="12">
                <template #label>
                  <div>
                    请求路径<CopyOutlined
                      class="copy-class"
                      @click="copyLogInfo(data.logInfo[record.operateId].data.requestUrl)"
                    />
                  </div>
                </template>
                {{ data.logInfo[record.operateId].data.requestUrl }}
              </a-descriptions-item>
              <a-descriptions-item
                :span="12"
                v-if="data.logInfo[record.operateId].data.requestParam"
              >
                <template #label>
                  <div>
                    请求参数<CopyOutlined
                      class="copy-class"
                      @click="copyLogInfo(data.logInfo[record.operateId].data.requestParam)"
                    />
                  </div>
                </template>
                <div style="max-height: 150px; overflow: auto">
                  {{ data.logInfo[record.operateId].data.requestParam }}
                </div>
              </a-descriptions-item>
              <a-descriptions-item
                :span="12"
                v-if="data.logInfo[record.operateId].data.requestResult"
              >
                <template #label>
                  <div>
                    请求结果<CopyOutlined
                      class="copy-class"
                      @click="copyLogInfo(data.logInfo[record.operateId].data.requestResult)"
                    />
                  </div>
                </template>
                <div style="max-height: 150px; overflow: auto">
                  {{ data.logInfo[record.operateId].data.requestResult }}
                </div>
              </a-descriptions-item>
              <a-descriptions-item
                :span="12"
                v-if="data.logInfo[record.operateId].data.logOtherData"
              >
                <template #label>
                  <div>
                    日志其余内容<CopyOutlined
                      class="copy-class"
                      @click="copyLogInfo(data.logInfo[record.operateId].data.logOtherData)"
                    />
                  </div>
                </template>
                <div style="max-height: 150px; overflow: auto">
                  {{ data.logInfo[record.operateId].data.logOtherData }}
                </div>
              </a-descriptions-item>
            </a-descriptions>
          </div>
        </template>
      </template> -->
      <template #action="{ record }">
        <TableAction
          stopButtonPropagation
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              label: '详情',
              onClick: handleView.bind(null, record.authLogId),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              label: '删除',
              auth: 'delete',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.authLogId),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <OperateLogModal @register="registerModal" />
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import {
    selectPage,
    deleteById,
    deleteBatchByIds,
    getById,
  } from '/@/api/modules/logging/manage/operate';
  import { useModal } from '/@/components/Modal';
  import OperateLogModal from './OperateLogModal.vue';
  import { CopyOutlined } from '@ant-design/icons-vue';
  import { columns, searchFormSchema } from './operatelog.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  const { createMessage } = useMessage();
  const { clipboardRef, copiedRef } = useCopyToClipboard();
  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload }] = useTable({
    title: '操作日志列表',
    api: selectPage,
    rowKey: 'operateId',
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
    clickToRowSelect: false,
    rowSelection: { type: 'checkbox' },
    tableSetting: { fullScreen: true },
    bordered: true,
    actionColumn: {
      width: 140,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  const loading = reactive({
    deleteBatch: false,
    export: false,
  });
  const data = reactive({
    keys: [],
    logInfo: {},
  });
  const registerTableDomRef = ref();
  function handleView(operateId: string) {
    openModal(true, {
      isUpdate: true,
      operateId: operateId,
    });
  }
  async function handleDelete(operateId: string) {
    await deleteById(operateId);
    reload();
  }
  async function handleDeleteBatch() {
    try {
      loading.deleteBatch = true;
      await deleteBatchByIds(data.keys);
    } finally {
      loading.deleteBatch = false;
    }
    reload();
  }
  async function handleSelectionChange({ keys }) {
    data.keys = keys;
  }
  async function handleExport() {
    try {
      loading.export = true;
    } finally {
      loading.export = false;
    }
  }
  function copyLogInfo(logInfo: any) {
    clipboardRef.value = logInfo;
    if (copiedRef.value) {
      createMessage.success('复制成功');
    }
  }
  async function handleExpandedChange(expanded, record) {
    data.logInfo[record.operateId] = {
      data: [],
      loading: true,
    };
    if (expanded) {
      try {
        data.logInfo[record.operateId].data = await getById(record.operateId);
      } finally {
        data.logInfo[record.operateId].loading = false;
      }
    }
  }
</script>

<style lang="less">
  .copy-class {
    color: @primary-color;
    cursor: pointer;
  }
</style>
