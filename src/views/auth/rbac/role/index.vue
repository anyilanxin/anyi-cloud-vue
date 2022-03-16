<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate" v-auth="'insert'"> 新增角色 </a-button>
        <a-button
          color="warning"
          preIcon="ant-design:cloud-sync-outlined"
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
      <template #roleStatus="{ record }">
        <a-badge status="processing" v-if="record.roleStatus == 1" text="启用" />
        <a-badge status="default" v-else text="停用" />
      </template>
      <template #expandedRowRender="{ record }">
        <a-empty v-if="!record.permissionInfos || record.permissionInfos.length <= 0" />
        <a-row :gutter="24" :style="{ marginBottom: '12px' }" v-else>
          <a-col
            :span="12"
            v-for="(permission, index) in record.permissionInfos"
            :key="index"
            :style="{ marginBottom: '12px' }"
          >
            <a-col :span="4">
              <span>{{ permission.metaTitle }}：</span>
            </a-col>
            <a-col :span="20" v-if="permission.actionSet && permission.actionSet.length > 0">
              <a-tag
                :color="actionType[action.actionType].color"
                v-for="(action, k) in permission.actionSet"
                :key="k"
                style="margin-left: 2px"
                >{{ action.metaTitle }}({{ actionType[action.actionType].text }})</a-tag
              >
            </a-col>
            <a-col :span="20" v-else>-</a-col>
          </a-col>
        </a-row>
      </template>
      <template #action="{ record }">
        <TableAction
          stopButtonPropagation
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              label: '编辑',
              tooltip: '编辑角色',
              auth: 'update',
              ifShow: () => record.roleCode !== setting.superRoleCode,
              onClick: handleEdit.bind(null, record.roleId),
            },
            {
              icon: 'clarity:info-standard-line',
              label: '详情',
              tooltip: '查看详情',
              onClick: handleDetail.bind(null, record.roleId),
            },
            {
              icon: 'ant-design:merge-cells-outlined',
              color: 'warning',
              auth: 'authMenu',
              label: '功能',
              ifShow: () => record.roleCode !== setting.superRoleCode,
              tooltip: '功能权限',
              onClick: handleMenu.bind(null, record.roleId),
            },
          ]"
          :dropDownActions="[
            {
              label: '设置数据权限',
              auth: 'dataAuth',
              ifShow: () => record.roleCode !== setting.superRoleCode,
              onClick: handleData.bind(null, record),
            },
            {
              label: '删除',
              auth: 'delete',
              ifShow: () => record.enableDelete !== 0 && record.roleCode !== setting.superRoleCode,
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.roleId),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <RoleModal @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import projectSetting from '/@/settings/projectSetting';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { selectPage } from '/@/api/modules/auth/rbac/rbacRole';

  import { useDrawer } from '/@/components/Drawer';
  import RoleModal from './RoleModal.vue';

  import { columns, searchFormSchema } from './role.data';
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { reload }] = useTable({
    title: '角色列表',
    api: selectPage,
    rowKey: 'roleId',
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      alwaysShowLines: 1,
      autoAdvancedLine: 1,
    },
    indexColumnProps: {
      width: 60,
    },
    useSearchForm: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    // bordered: true,
    expandRowByClick: true,
    // showIndexColumn: true,

    actionColumn: {
      width: 250,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      align: 'left',
    },
  });
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
  const setting = ref(projectSetting);
  function handleImport() {}
  function handleExport() {}
  function handleDetail(roleId: string) {
    console.log('-handleDetail----roleId------', roleId);
  }
  function handleMenu(roleId: string) {
    openDrawer(true, {
      isUpdate: true,
      roleId,
    });
  }
  function handleData(record: Recordable) {
    openDrawer(true, {
      record,
      isUpdate: true,
      isDataAuth: true,
    });
  }
  function handleCreate() {
    openDrawer(true, {
      isUpdate: false,
    });
  }

  function handleEdit(roleId: string) {
    openDrawer(true, {
      roleId,
      isUpdate: true,
    });
  }
  function handleDelete(roleId: string) {
    console.log('--handleDelete---roleId------', roleId);
  }
  function handleSuccess() {
    reload();
  }
</script>
