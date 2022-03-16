<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <SysList class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <BasicTable
      @register="registerTable"
      class="w-3/4 xl:w-4/5"
      :searchInfo="searchInfo"
      @fetch-success="expandTableAll"
    >
      <template #permissionType="{ record }">
        <a-tag
          :color="permissionType[record.permissionType].color"
          v-if="record.permissionType != 2"
        >
          {{ permissionType[record.permissionType].text }}
        </a-tag>
        <a-tag :color="actionType[record.actionType].color" v-else>
          {{ permissionType[record.permissionType].text }}({{ actionType[record.actionType].text }})
        </a-tag>
      </template>
      <template #permissionStatus="{ record }">
        <a-badge status="processing" v-if="record.permissionStatus == 1" text="启用" />
        <a-badge status="default" v-else text="停用" />
      </template>
      <template #icon="{ record }">
        <a-avatar
          :size="20"
          :src="getPictureUrl(record.icon)"
          shape="square"
          v-if="record.icon && record.iconType == 1"
        />
        <Icon
          v-if="record.icon && record.iconType == 0"
          :icon="record.icon"
          :size="20"
          :class="`${prefixCls}-wrapper__icon mr-2`"
        />
      </template>
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'insert'"
          :disabled="!searchInfo.systemId"
          >新增</a-button
        >
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
      <template #action="{ record }">
        <TableAction
          stopButtonPropagation
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              tooltip: '查看权限详情',
              onClick: handleDetail.bind(null, record.permissionId),
            },
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑权限',
              color: 'success',
              auth: 'update',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除权限',
              auth: 'delete',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.permissionId),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <UserModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { reactive, nextTick } from 'vue';
  import Icon from '/@/components/Icon/index';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getAttachmentUrl } from '/@/utils';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { selectPage } from '/@/api/modules/auth/rbac/rbacPermission';
  import { PageWrapper } from '/@/components/Page';
  import SysList from './SystemList.vue';

  import { useModal } from '/@/components/Modal';
  import UserModal from './PermissionModal.vue';

  import { columns, searchFormSchema } from './permission.data';

  const permissionType = {
    0: {
      text: '目录',
      color: 'blue',
    },
    1: {
      text: '菜单',
      color: 'cyan',
    },
    2: {
      text: '按钮',
      color: 'green',
    },
  };
  const actionType = {
    1: {
      text: '前端',
      color: 'green',
    },
    2: {
      text: '后端',
      color: 'orange',
    },
    3: {
      text: '通用',
      color: 'red',
    },
  };
  const { prefixCls } = useDesign('permission-content');
  const [registerModal, { openModal }] = useModal();
  const searchInfo = reactive<Recordable>({});
  const [registerTable, { reload, updateTableDataRecord, expandAll }] = useTable({
    title: '权限列表',
    api: selectPage,
    rowKey: 'permissionId',
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      alwaysShowLines: 1,
      autoAdvancedLine: 1,
    },
    useSearchForm: true,
    isTreeTable: true,
    indentSize: 10,
    bordered: true,
    showTableSetting: true,
    canResize: true,
    tableSetting: { fullScreen: true },
    actionColumn: {
      width: 110,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
      systemId: searchInfo.systemId,
    });
  }
  function handleImport() {}
  function handleExport() {}
  function handleDetail(permissionId: string) {
    console.log('-handleDetail----permissionId------', permissionId);
  }
  function expandTableAll() {
    nextTick(expandAll);
  }
  function handleEdit(record) {
    console.log('-handleDetail----permissionId---11111---', record);
    openModal(true, {
      isUpdate: true,
      systemId: record.systemId,
      permissionId: record.permissionId,
    });
  }
  function getPictureUrl(url: string) {
    return getAttachmentUrl(url);
  }
  function handleDelete(permissionId: string) {
    console.log('--handleDelete---permissionId------', permissionId);
  }

  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      updateTableDataRecord(values.permissionId, values);
    } else {
      reload();
    }
  }

  function handleSelect(systemId = '') {
    searchInfo.systemId = systemId;
    reload();
  }
</script>
