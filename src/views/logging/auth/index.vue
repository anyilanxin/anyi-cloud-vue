<template>
  <div>
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
      <template #authStatus="{ record }">
        <a-badge status="processing" v-if="record.authStatus == 1" text="成功" />
        <a-badge status="default" v-else-if="record.authStatus == 0" text="失败" />
      </template>
      <!-- <template #expandedRowRender="{ record }">
        <div style="text-align: center">
          <a-spin :spinning="data.logInfo[record.authLogId]?.loading" />
        </div>
        <template v-if="!data.logInfo[record.authLogId]?.loading">
          <a-empty v-if="!data.logInfo[record.authLogId]?.data" />
          <div v-else> {{ data.logInfo[record.authLogId].data.authLogId }}</div>
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
    <AuthLogModal @register="registerModal" />
  </div>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { selectPage, deleteById, deleteBatchByIds } from '/@/api/modules/logging/manage/authData';
  import { useModal } from '/@/components/Modal';
  import AuthLogModal from './AuthLogModal.vue';
  import { columns, searchFormSchema } from './authlog.data';
  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload }] = useTable({
    title: '授权日志列表',
    api: selectPage,
    rowKey: 'authLogId',
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

  function handleView(authLogId: string) {
    openModal(true, {
      isUpdate: true,
      authLogId: authLogId,
    });
  }
  async function handleDelete(authLogId: string) {
    await deleteById(authLogId);
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
  async function handleExpandedChange(expanded, record) {
    data.logInfo[record.authLogId] = {
      data: [],
      loading: true,
    };
    if (expanded) {
      try {
        data.logInfo[record.authLogId].data = await getById(record.authLogId);
      } finally {
        data.logInfo[record.authLogId].loading = false;
      }
    }
  }
</script>
