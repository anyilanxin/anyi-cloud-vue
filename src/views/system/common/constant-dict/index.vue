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
  <PageWrapper dense contentFullHeight contentClass="flex">
    <DictList class="w-1/4 xl:w-3/8" @on-select="handleSelect" />
    <BasicTable
      @register="registerTable"
      class="w-3/4 xl:w-5/8"
      :searchInfo="searchInfo"
      @fetch-success="expandTableAll"
      @expanded-rows-change="expandedChange"
    >
      <template #itemStatus="{ record }">
        <a-badge status="processing" v-if="record.itemStatus == 1" text="启用" />
        <a-badge status="default" v-else text="停用" />
      </template>
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          :disabled="!searchInfo.dictId"
          >新增</a-button
        >
      </template>
      <template #action="{ record }">
        <TableAction
          stopButtonPropagation
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              tooltip: '查看字典项',
              onClick: handleDetail.bind(null, record),
            },
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑字典项',
              color: 'success',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除字典项',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.itemId),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <DictItemModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { reactive, nextTick } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { selectItemPage, deleteItem } from '/@/api/modules/system/common/commonDict';
  import { PageWrapper } from '/@/components/Page';
  import DictList from './DictList.vue';
  import { useModal } from '/@/components/Modal';
  import DictItemModal from './DictItemModal.vue';
  import { columns, searchFormSchema } from './dict.data';
  const [registerModal, { openModal }] = useModal();
  const searchInfo = reactive<Recordable>({});
  const [registerTable, { reload, updateTableDataRecord, expandAll }] = useTable({
    title: '字典项列表',
    api: selectItemPage,
    rowKey: 'itemId',
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    useSearchForm: true,
    indentSize: 10,
    showIndexColumn: false,
    bordered: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    actionColumn: {
      width: 110,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  function expandedChange(record) {
    console.log('--------record-----------', record);
  }
  function handleCreate() {
    console.log('--------record-----------', 'oeuroweurower00000');
    openModal(true, {
      isUpdate: false,
      id: searchInfo.dictId,
    });
  }
  function handleSelect(dictId) {
    console.log('--------record-------dictId-11111---', dictId);
    searchInfo.dictId = dictId;
    reload();
  }
  function handleDetail(record) {
    console.log('-handleDetail----roleId------', record);
  }
  function expandTableAll() {
    nextTick(expandAll);
  }
  function handleEdit(record) {
    openModal(true, {
      isUpdate: true,
      record,
    });
  }
  async function handleDelete(itemId: string) {
    await deleteItem(itemId);
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
