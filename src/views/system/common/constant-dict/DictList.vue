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
 *   7.进行商用时，不得基于AnYi Cloud Vue 的基础，修改包装而成一个与AnYi Zeebe EE、AnYi Cloud EE功能类似的程序，进行销售或发布，参与同类软件产品市场的竞争；
 *   8.本软件使用的第三方依赖皆为开源软件，如需要修改第三方源码请遵循第三方源码附带开源协议；
 *   9.本软件流程部分请遵循camunda开源协议：
 *     https://docs.camunda.org/manual/latest/introduction/third-party-libraries
 *     https://github.com/camunda/camunda-bpm-platform/blob/master/LICENSE
 *   10.若您的项目无法满足以上几点，可申请商业授权。
 -->
<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <BasicTable @register="registerDictTable" @selection-change="selectionChange">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          value="small"
          >新增</a-button
        >
        <a-button
          color="warning"
          preIcon="ant-design:cloud-upload-outlined"
          @click="handleImport"
          value="small"
          >导入</a-button
        >
        <a-button
          color="success"
          preIcon="ant-design:cloud-download-outlined"
          @click="handleExport"
          value="small"
          >导出</a-button
        >
      </template>
      <template #dictAction="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              tooltip: '查看字典',
              onClick: handleView.bind(null, record),
            },
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑字典',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除字典',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.dictId),
              },
            },
          ]"
        />
      </template>
      <template #dictStatus="{ record }">
        <a-badge status="processing" v-if="record.dictStatus == 1" text="启用" />
        <a-badge status="default" v-else text="停用" />
      </template>
      <template #dictType="{ record }">
        <a-tag :color="dictType[record.dictType].color">
          {{ dictType[record.dictType].text }}
        </a-tag>
      </template>
    </BasicTable>
    <DictModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import DictModal from './DictModal.vue';
  import { selectPage, deleteById } from '/@/api/modules/system/common/commonDict';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, useTable, BasicColumn, TableAction } from '/@/components/Table';
  const columns: BasicColumn[] = [
    {
      title: '字典名称',
      dataIndex: 'dictName',
      width: 100,
    },
    {
      title: '字典编码',
      dataIndex: 'dictCode',
      align: 'center',
      width: 100,
    },
    {
      title: '类型',
      dataIndex: 'dictType',
      slots: { customRender: 'dictType' },
      width: 60,
    },
    {
      title: '状态',
      slots: { customRender: 'dictStatus' },
      dataIndex: 'dictStatus',
      width: 75,
    },
  ];
  const dictType = {
    0: {
      text: '字符',
      color: 'blue',
    },
    1: {
      text: '数字',
      color: 'cyan',
    },
    2: {
      text: '布尔',
      color: 'green',
    },
  };
  const [registerDictTable, { reload, updateTableDataRecord }] = useTable({
    api: selectPage,
    title: '字典列表',
    rowKey: 'dictId',
    showIndexColumn: false,
    columns,
    useSearchForm: false,
    rowSelection: { type: 'radio' },
    showTableSetting: false,
    bordered: true,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
      fixed: undefined,
      slots: { customRender: 'dictAction' },
    },
  });
  const emit = defineEmits(['onSelect']);
  const [registerModal, { openModal }] = useModal();
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }
  function handleImport() {}
  function handleExport() {}
  function handleView(record) {
    console.log('------record---', record);
  }
  function selectionChange(record) {
    let dictId = '';
    if (record.keys && Object.keys(record.keys).length > 0) {
      dictId = record.keys[0];
    }
    emit('onSelect', dictId);
  }
  function handleEdit(record) {
    openModal(true, {
      isUpdate: true,
      record,
    });
  }
  async function handleDelete(dictId: string) {
    await deleteById(dictId);
    reload();
  }
  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      updateTableDataRecord(values.id, values);
    } else {
      reload();
    }
  }
</script>
