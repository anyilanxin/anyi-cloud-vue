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
 *   7.进行商用时，不得基于AnYi Cloud Vue的基础，修改包装而成一个与AnYi Zeebe EE、AnYi Cloud EE、AnYi Cloud EE Vue功能类似的程序，进行销售或发布，参与同类软件产品市场的竞争；
 *   8.本软件使用的第三方依赖皆为开源软件，如需要修改第三方源码请遵循第三方源码附带开源协议；
 *   9.本软件中使用了bpmn js,使用请遵循bpmn.io开源协议：
 *     https://github.com/bpmn-io/bpmn-js/blob/develop/LICENSE
 *   10.若您的项目无法满足以上几点，可申请商业授权。
 -->
<template>
  <div>
    <BasicTable @register="registerTable" :searchInfo="searchInfo" :beforeFetch="beforeFetch">
      <template #toolbar>
        <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleCreate"
          >新增服务</a-button
        >
        <a-button
          color="error"
          :preIcon="!loadingSync ? 'ant-design:sync-outlined' : ''"
          :loading="loadingSync"
          @click="handleSyncGateway"
          >刷新网关</a-button
        >
        <a-button color="warning" preIcon="ant-design:cloud-upload-outlined" @click="handleImport"
          >导入</a-button
        >
        <a-button color="success" preIcon="ant-design:cloud-download-outlined" @click="handleExport"
          >导出</a-button
        >
      </template>
      <template #serviceInstanceState="{ record }">
        {{ record.healthyNum }}/{{ record.instanceNum }}
        <Progress
          :percent="(record.healthyNum / record.instanceNum) * 100"
          size="small"
          :stroke-color="{
            '0%': '#108ee9',
            '100%': '#87d068',
          }"
          v-if="record.instanceNum > 0"
        />
        <Progress :percent="0" size="small" v-else />
      </template>
      <template #serviceState="{ record }">
        <a-badge status="processing" v-if="record.serviceState == 1" text="启用" />
        <a-badge status="default" v-else text="停用" />
      </template>
      <template #headerTop>
        <Alert type="info" show-icon>
          <template #message>
            <div style="display: flex">
              <div style="margin-right: 20px; font-weight: 450">
                <span style="margin-right: 5px">纳入管理总服务数:</span>
                <span>{{ statInfo.manageTotalService }}</span>
              </div>
              <div style="margin-right: 20px; font-weight: 450">
                <span style="margin-right: 5px">未纳入管理总服务数:</span>
                <span>{{ statInfo.notManageTotalService }}</span>
              </div>
              <div style="margin-right: 20px; font-weight: 450">
                <span style="margin-right: 5px">系统实例数:</span>
                <span>{{ statInfo.healthyInstanceCount }}</span>
              </div>
              <div style="margin-right: 20px; font-weight: 450" class="text-yellow-600">
                <span style="margin-right: 5px">系统异常实例数:</span>
                <span>{{ statInfo.noHealthyInstanceCount }}</span>
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
              icon: 'clarity:note-edit-line',
              tooltip: '编辑',
              onClick: handleEdit.bind(null, record.serviceId),
            },
            {
              icon: 'ant-design:security-scan-outlined',
              tooltip: '过滤器',
              onClick: handleFilter.bind(null, record),
            },
            {
              icon: 'ant-design:api-outlined',
              tooltip: '路由',
              color: 'error',
              onClick: handleRouter.bind(null, record),
            },
            {
              icon: 'ant-design:deployment-unit-outlined',
              tooltip: '实例',
              onClick: handleInstance.bind(null, record),
              ifShow: () => record.instanceNum != 0,
            },
          ]"
          :dropDownActions="[
            {
              label: '详情',
              onClick: handleView.bind(null, record),
            },
            {
              label: record.serviceState == 1 ? '禁用' : '启用',
              onClick: handleView.bind(null, record.serviceId),
            },
            {
              label: '删除',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.serviceId),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <ModalService @register="registerModal" @success="handleSuccess" />
    <ModalServiceInstance @register="registerInstanceModal" />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import ModalService from './ModalService.vue';
  import ModalServiceInstance from './ModalServiceInstance.vue';
  import { router } from '/@/router';
  import { columns, searchFormSchema } from './service.data';
  import { useGo } from '/@/hooks/web/usePage';
  import {
    selectPage,
    systemStat,
    syncGateway,
    deleteById,
  } from '/@/api/modules/system/manage/manageService';
  import { SystemStatDto } from '/@/api/modules/system/manage/model/manageServiceModel';
  import { Alert, Progress } from 'ant-design-vue';
  const go = useGo();
  const [registerModal, { openModal }] = useModal();
  const [registerInstanceModal, { openModal: openInstanceModal }] = useModal();
  const searchInfo = reactive<Recordable>({});
  const loadingSync = ref(false);
  const statInfo = ref<SystemStatDto>({
    manageTotalService: 0,
    notManageTotalService: 0,
    healthyInstanceCount: 0,
    noHealthyInstanceCount: 0,
  });
  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: '服务列表',
    api: selectPage,
    rowKey: 'serviceId',
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      alwaysShowLines: 1,
      autoAdvancedLine: 1,
    },
    indexColumnProps: {
      width: 70,
      fixed: 'left',
    },
    useSearchForm: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    bordered: true,
    actionColumn: {
      width: 190,
      title: '操作',
      align: 'left',
      fixed: 'right',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }
  function handleEdit(serviceId: string) {
    openModal(true, {
      isUpdate: true,
      id: serviceId,
    });
  }
  async function handleDelete(serviceId: string) {
    await deleteById(serviceId);
    reload();
  }

  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      updateTableDataRecord(values.id, values);
    } else {
      reload();
    }
    getSystemStat();
  }
  async function getSystemStat() {
    const data = await systemStat();
    statInfo.value = data;
  }
  function handleImport() {}
  function handleExport() {}
  function handleRouter(record: Recordable) {
    router.push({
      name: 'FixedPageServiceRouter',
      query: {
        serviceId: record.serviceId,
        serviceName: record.serviceName,
        serviceCode: record.serviceCode,
        isLoadBalancer: record.isLoadBalancer,
      },
    });
  }
  function handleFilter(record: Recordable) {
    router.push({
      name: 'FixedPageCustomFilter',
      query: {
        serviceId: record.serviceId,
        serviceName: record.serviceName,
      },
    });
  }
  function beforeFetch(record: Recordable) {
    getSystemStat();
    return record;
  }
  async function handleSyncGateway() {
    loadingSync.value = true;
    try {
      await syncGateway();
    } finally {
      loadingSync.value = false;
    }
  }
  function handleInstance(record: Recordable) {
    openInstanceModal(true, {
      serviceName: record.serviceName,
      serviceCode: record.serviceCode,
    });
  }
  onMounted(() => {
    getSystemStat();
  });
  function handleView(systemId: string) {
    go('/system/account_detail/' + systemId);
  }
</script>
