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
 *   7.进行商用时，不得基于AnYi Cloud Vue的基础，修改包装而成一个与AnYi Cloud EE、AnYi Zeebe EE、AnYi Standalone EE功能类似的程序，进行销售或发布，参与同类软件产品市场的竞争；
 *   8.本软件使用的第三方依赖皆为开源软件，如需要修改第三方源码请遵循第三方源码附带开源协议；
 *   9.本软件中使用了bpmn js,使用请遵循bpmn.io开源协议：
 *     https://github.com/bpmn-io/bpmn-js/blob/develop/LICENSE
 *   10.若您的项目无法满足以上几点，可申请商业授权。
 -->
<template>
  <div>
    <BasicTable @register="registerTable" @expand="handleExpandedChange" :searchInfo="searchInfo">
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
      <!-- <template #expandedRowRender="{ record }">
        <div style="text-align: center">
          <a-spin :spinning="data.meauActions[record.orgRoleId]?.loading" />
        </div>
        <template v-if="!data.meauActions[record.orgRoleId]?.loading">
          <a-empty
            v-if="
              !data.meauActions[record.orgRoleId]?.data ||
              data.meauActions[record.orgRoleId]?.data.length < 1
            "
          />
          <a-row :gutter="24" :style="{ marginBottom: '12px' }" v-else>
            <a-col
              :span="12"
              v-for="(permission, index) in data.meauActions[record.orgRoleId].data"
              :key="index"
              :style="{ marginBottom: '12px' }"
            >
              <a-col :span="4">
                <span>{{ permission.metaTitle }}：</span>
              </a-col>
              <a-col :span="20" v-if="permission.actionSet && permission.actionSet.length > 0">
                <a-tag
                  color="green"
                  v-for="(action, k) in permission.actionSet"
                  :key="k"
                  style="margin-left: 4px; margin-bottom: 4px"
                  >{{ action.metaTitle }}</a-tag
                >
              </a-col>
              <a-col :span="20" v-else>-</a-col>
            </a-col>
          </a-row>
        </template>
      </template> -->
      <template #action="{ record }">
        <TableAction
          stopButtonPropagation
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              label: '编辑',
              tooltip: '编辑角色',
              auth: 'update',
              ifShow: () => !record.superRole,
              onClick: handleEdit.bind(null, record.orgRoleId),
            },
            {
              icon: 'ant-design:api-outlined',
              label: '授权',
              color: 'success',
              auth: 'apiAuth',
              tooltip: '授予权限',
              onClick: handleAuth.bind(null, record.orgRoleId),
            },
          ]"
          :dropDownActions="[
            {
              label: '详情',
              auth: 'dataAuth',
              onClick: handleDetail.bind(null, record.orgRoleId),
            },
            {
              label: '删除',
              auth: 'delete',
              ifShow: () => record.enableDelete !== 0 && !record.superRole,
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.orgRoleId),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <RoleModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { reactive, watch } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import {
    selectPage,
    deleteById,
    getMenuActionById,
  } from '/@/api/modules/system/rbac/rbacOrgRole';
  import { useModal } from '/@/components/Modal';
  import RoleModal from './RoleModal.vue';
  import { router } from '/@/router';
  import { columns, searchFormSchema } from './orgRole.data';
  const props = defineProps({
    orgId: {
      type: String,
      default: '',
    },
  });
  watch(
    () => props.orgId,
    (val, old) => {
      if (val != old) {
        handleOrgChange(val);
      }
    },
  );
  const searchInfo = reactive<Recordable>({});
  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload }] = useTable({
    title: '机构角色列表',
    api: selectPage,
    rowKey: 'orgRoleId',
    columns,
    formConfig: {
      labelWidth: 68,
      schemas: searchFormSchema,
      alwaysShowLines: 1,
      autoAdvancedLine: 1,
    },
    indexColumnProps: {
      width: 60,
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    tableSetting: { fullScreen: true },
    expandRowByClick: true,
    actionColumn: {
      width: 200,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
      align: 'left',
    },
  });
  const data = reactive({
    meauActions: {},
  });
  async function handleExpandedChange(expanded, record) {
    data.meauActions[record.orgRoleId] = {
      data: [],
      loading: true,
    };
    if (expanded) {
      try {
        data.meauActions[record.orgRoleId].data = await getMenuActionById(record.orgRoleId);
      } finally {
        data.meauActions[record.orgRoleId].loading = false;
      }
    }
  }
  function handleOrgChange(orgId: string) {
    searchInfo.orgId = orgId;
    if (orgId) {
      reload();
    }
  }
  function handleAuth(orgRoleId: string) {
    router.push({
      name: 'FixedPageOrgRoleInfo',
      query: {
        orgRoleId,
        orgId: props.orgId,
      },
    });
  }
  function handleImport() {}
  function handleExport() {}
  function handleDetail(orgRoleId: string) {
    console.log('-handleDetail----orgRoleId------', orgRoleId);
  }
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
      orgId: props.orgId,
    });
  }

  // async function handleSyncProcess() {
  //   loading.value = true;
  //   try {
  //     await syncProcess();
  //   } finally {
  //     loading.value = false;
  //   }
  // }

  function handleEdit(orgRoleId: string) {
    openModal(true, {
      orgRoleId,
      orgId: props.orgId,
      isUpdate: true,
    });
  }
  async function handleDelete(orgRoleId: string) {
    await deleteById(orgRoleId);
    reload();
  }
  function handleSuccess() {
    reload();
  }
</script>
