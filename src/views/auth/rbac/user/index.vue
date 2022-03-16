<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <OrgTree class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <BasicTable @register="registerTable" class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'insert'"
          >新增用户</a-button
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
      <template #avatar="{ record }">
        <a-avatar :size="33" :src="getPictureUrl(record.avatar)" v-if="record.avatar" />
      </template>
      <template #userStatus="{ record }">
        <a-badge status="processing" v-if="record.userStatus == 1" text="启用" />
        <a-badge status="default" v-else text="停用" />
      </template>
      <template #action="{ record }">
        <TableAction
          stopButtonPropagation
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              tooltip: '查看用户详情',
              onClick: handleView.bind(null, record.userId),
            },
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑用户资料',
              auth: 'update',
              onClick: handleEdit.bind(null, record.userId),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              auth: 'delete',
              tooltip: '删除此账号',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.userId),
              },
            },
          ]"
          :dropDownActions="[
            {
              label: '分配角色',
              auth: 'authRole',
              onClick: handleAuth.bind(null, record.userId),
            },
            {
              label: '重置密码',
              auth: 'resetPassword',
              onClick: handleEdit.bind(null, record.userId),
            },
          ]"
        />
      </template>
    </BasicTable>
    <UserModal @register="registerModal" @success="handleSuccess" />
    <UserAuthModal @register="registerAuthModal" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { selectPage, deleteById } from '/@/api/modules/auth/rbac/rbacUser';
  import { PageWrapper } from '/@/components/Page';
  import OrgTree from './OrgTree.vue';
  import { getAttachmentUrl } from '/@/utils';
  import { useModal } from '/@/components/Modal';
  import UserModal from './UserModal.vue';
  import UserAuthModal from './UserAuthModal.vue';
  import { columns, searchFormSchema } from './user.data';
  import { useGo } from '/@/hooks/web/usePage';
  const go = useGo();
  const [registerModal, { openModal }] = useModal();
  const [registerAuthModal, { openModal: openAuthModal }] = useModal();
  const searchInfo = reactive<Recordable>({});
  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: '用户列表',
    api: selectPage,
    rowKey: 'userId',
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
      width: 150,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });

  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  function handleEdit(userId: string) {
    openModal(true, {
      userId,
      isUpdate: true,
    });
  }
  function getPictureUrl(url: string) {
    return getAttachmentUrl(url);
  }
  async function handleDelete(userId: string) {
    await deleteById(userId);
    reload();
  }

  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      updateTableDataRecord(values.userId, values);
    } else {
      reload();
    }
  }
  function handleAuth(userId: string) {
    openAuthModal(true, {
      userId,
      isUpdate: true,
    });
  }
  function handleImport() {}
  function handleExport() {}
  function handleSelect(orgId = '') {
    searchInfo.orgId = orgId;
    reload();
  }

  function handleView(record: Recordable) {
    go('/system/account_detail/' + record.id);
  }
</script>
