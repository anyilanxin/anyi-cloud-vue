<template>
  <div>
    <BasicTable @register="registerTable" @fetch-success="expandTableAll">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate" v-auth="'insert'"> 新增组织 </a-button>
        <a-button
          color="warning"
          preIcon="ant-design:cloud-upload-outlined"
          @click="handleImport"
          v-auth="'import'"
          >导入</a-button
        >
        <a-button
          color="success"
          preIcon="ant-design:cloud-download-outlined"
          @click="handleExport"
          v-auth="'export'"
          >导出</a-button
        >
      </template>
      <template #orgStatus="{ record }">
        <a-badge status="processing" v-if="record.orgStatus == 1" text="启用" />
        <a-badge status="default" v-else text="停用" />
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              tooltip: '查看组织',
              onClick: handleDetail.bind(null, record.roleId),
            },
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑组织',
              auth: 'update',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              auth: 'delete',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <OrgModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { nextTick } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { selectPage } from '/@/api/modules/auth/rbac/rbacOrg';

  import { useModal } from '/@/components/Modal';
  import OrgModal from './OrgModal.vue';

  import { columns, searchFormSchema } from './org.data';

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload, expandAll, updateTableDataRecord }] = useTable({
    title: '组织列表',
    api: selectPage,
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      alwaysShowLines: 1,
      autoAdvancedLine: 1,
    },
    indentSize: 10,
    isTreeTable: true,
    useSearchForm: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    bordered: true,
    canResize: true,
    actionColumn: {
      width: 110,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      fixed: 'right',
    },
  });

  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  function handleEdit(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
    });
  }
  function expandTableAll() {
    nextTick(expandAll);
  }
  function handleDetail() {}
  function handleDelete(record: Recordable) {
    console.log(record);
  }
  function handleImport() {}
  function handleExport() {}
  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      updateTableDataRecord(values.orgId, values);
    } else {
      reload();
    }
  }
</script>
