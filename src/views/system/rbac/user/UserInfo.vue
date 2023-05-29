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
  <div>
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleAssociate(orgId)"
          v-auth="'insert'"
          :disabled="!orgId"
          >关联已有用户</a-button
        >
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'insert'"
          >新增用户</a-button
        >
        <!-- <a-button
          color="error"
          :preIcon="!loading ? 'ant-design:sync-outlined' : ''"
          @click="handleSyncProcess"
          :loading="loading"
          v-auth="'sync-process-user'"
          >同步流程</a-button
        > -->
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
        <a-badge status="default" v-if="record.userStatus == 0" text="未激活" />
        <a-badge status="processing" v-else-if="record.userStatus == 1" text="启用" />
        <a-badge status="warning" v-else-if="record.userStatus == 2" text="冻结" />
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
              label: '移除机构',
              ifShow: () => (orgId ? true : false),
              auth: 'removeOrg',
              popConfirm: {
                title: `确定要把'${record.userName}'移除'${orgName}'机构吗？`,
                confirm: handleRemoveOrg.bind(null, record.userId),
              },
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
    <AssociateOrgModal @register="registerModal" @success="handleAssociateSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { reactive, watch } from 'vue';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { selectPage, deleteById, removeOrg } from '/@/api/modules/system/rbac/rbacUser';
  import { getAttachmentUrl } from '/@/utils';
  import { router } from '/@/router';
  import { useRoute } from 'vue-router';
  import AssociateOrgModal from './AssociateOrgModal.vue';
  import { columns, searchFormSchema } from './user.data';
  import { useGo } from '/@/hooks/web/usePage';
  const [registerModal, { openModal }] = useModal();
  const route = useRoute();
  const params = reactive(route.query as any);
  const props = defineProps({
    orgId: {
      type: String,
      default: '',
    },
    orgName: {
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
  // const loading = ref(false);
  const go = useGo();
  const searchInfo = reactive<Recordable>({});
  const [registerTable, { reload }] = useTable({
    title: '用户列表',
    api: selectPage,
    rowKey: 'userId',
    columns,
    formConfig: {
      labelWidth: 68,
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
    canResize: true,
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
    router.push({
      name: 'FixedPageUserInfo',
      query: {
        orgId: props.orgId,
        orgName: props.orgName,
      },
    });
  }
  function handleAssociate(orgId: string) {
    openModal(true, {
      orgId,
      orgName: props.orgName,
    });
  }
  async function handleRemoveOrg(userId: string) {
    await removeOrg(userId, props.orgId);
    reload();
  }
  // async function handleSyncProcess() {
  //   loading.value = true;
  //   try {
  //     await syncProcess();
  //   } finally {
  //     loading.value = false;
  //   }
  // }

  function handleEdit(userId: string) {
    router.push({
      name: 'FixedPageUserInfo',
      query: {
        orgId: params.orgId,
        userId,
      },
    });
  }
  function getPictureUrl(url: string) {
    return getAttachmentUrl(url);
  }
  async function handleDelete(userId: string) {
    await deleteById(userId);
    reload();
  }
  function handleImport() {}
  function handleExport() {}
  function handleOrgChange(orgId) {
    searchInfo.orgId = orgId;
    reload();
  }
  function handleAssociateSuccess() {
    reload();
  }

  function handleView(record: Recordable) {
    go('/system/account_detail/' + record.id);
  }
</script>
