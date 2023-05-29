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
    <BasicTable @register="registerTable" @selection-change="handleSelectionChange">
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
        <a-tag color="red" v-else>失败</a-tag>
      </template>
      <template #action="{ record }">
        <TableAction
          stopButtonPropagation
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              label: '详情',
              onClick: handleView.bind(null, record.operateId),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              label: '删除',
              auth: 'delete',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.operateId),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { selectPage, deleteById, deleteBatchByIds } from '/@/api/modules/logging/manage/operate';
  import { columns, searchFormSchema } from './operatelog.data';
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
  function handleView(operateId: string) {
    console.log('----operateId-------', operateId);
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
</script>

<style lang="less">
  .copy-class {
    color: @primary-color;
    cursor: pointer;
  }
</style>
