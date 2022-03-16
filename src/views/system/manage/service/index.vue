<template>
  <div>
    <BasicTable @register="registerTable" :searchInfo="searchInfo" :beforeFetch="beforeFetch">
      <template #toolbar>
        <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleCreate"
          >新增服务</a-button
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
              icon: 'clarity:info-standard-line',
              tooltip: '详情',
              onClick: handleView.bind(null, record.serviceId),
            },
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑',
              onClick: handleEdit.bind(null, record.serviceId),
            },
            {
              icon: 'ant-design:api-outlined',
              tooltip: '路由',
              color: 'warning',
              onClick: handleRouter.bind(null, record),
            },
          ]"
          :dropDownActions="[
            {
              label: '过滤器',
              onClick: handleFilter.bind(null, record.serviceId),
            },
            {
              label: '状态',
              onClick: handleView.bind(null, record.modelId),
            },
            {
              label: '删除',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.modelId),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <ServiceModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { router } from '/@/router';
  import ServiceModal from './ServiceModal.vue';
  import { columns, searchFormSchema } from './service.data';
  import { useGo } from '/@/hooks/web/usePage';
  import { selectPage, systemStat } from '/@/api/modules/system/manage/manageService';
  import { SystemStatDto } from '/@/api/modules/system/manage/model/manageServiceModel';
  import { Alert, Progress } from 'ant-design-vue';
  const go = useGo();
  const [registerModal, { openModal }] = useModal();
  const searchInfo = reactive<Recordable>({});
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
    },
    useSearchForm: true,
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
  function handleEdit(serviceId: string) {
    openModal(true, {
      isUpdate: true,
      id: serviceId,
    });
  }
  function handleDelete(serviceId: string) {
    console.log(serviceId);
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
      name: 'RouterInfo',
      params: {
        serviceId: record.serviceId,
        serviceName: record.serviceName,
      },
    });
  }
  function handleFilter(serviceId: string) {
    go('/system/service_filter/' + serviceId);
  }
  function beforeFetch(record: Recordable) {
    getSystemStat();
    return record;
  }
  onMounted(() => {
    getSystemStat();
  });
  function handleView(systemId: string) {
    go('/system/account_detail/' + systemId);
  }
</script>
