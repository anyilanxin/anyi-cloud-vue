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
  <PageWrapper dense contentFullHeight contentClass="flex">
    <SysList class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <BasicTable
      @register="registerTable"
      class="w-3/4 xl:w-4/5"
      :searchInfo="searchInfo"
      @fetch-success="expandTableAll"
    >
      <template #menuType="{ record }">
        <a-tag :color="menuType[record.menuType].color">
          {{ menuType[record.menuType].text }}
        </a-tag>
      </template>
      <template #menuStatus="{ record }">
        <a-badge status="processing" v-if="record.menuStatus == 1" text="启用" />
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
              icon: 'ant-design:plus-square-outlined',
              tooltip: '添加下级',
              auth: 'add',
              ifShow: () => record.menuType != 2,
              onClick: handleChild.bind(null, record),
            },
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑菜单',
              color: 'success',
              auth: 'update',
              onClick: handleEdit.bind(null, record),
            },
          ]"
          :dropDownActions="[
            {
              label: '查看',
              onClick: handleDetail.bind(null, record.menuId),
            },
            {
              label: '删除',
              auth: 'delete',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.menuId),
              },
            },
            {
              label: record.menuStatus == 1 ? '禁用' : '启用',
              auth: 'resetPassword',
              onClick: handleDelete.bind(null, record.menuId),
            },
          ]"
        />
      </template>
    </BasicTable>
    <MenuModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { reactive, nextTick } from 'vue';
  import Icon from '/@/components/Icon/index';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getAttachmentUrl } from '/@/utils';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { selectPage, deleteById } from '/@/api/modules/system/rbac/rbacMenu';
  import { PageWrapper } from '/@/components/Page';
  import SysList from './SystemList.vue';

  import { useModal } from '/@/components/Modal';
  import MenuModal from './MenuModal.vue';

  import { columns, searchFormSchema } from './menu.data';

  const menuType = {
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
  const { prefixCls } = useDesign('menu-content');
  const [registerModal, { openModal }] = useModal();
  const searchInfo = reactive<Recordable>({});
  const [registerTable, { reload, updateTableDataRecord, expandAll }] = useTable({
    title: '菜单列表',
    api: selectPage,
    rowKey: 'menuId',
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
    bordered: true,
    canResize: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    actionColumn: {
      width: 110,
      title: '操作',
      align: 'left',
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
  function handleDetail(menuId: string) {
    console.log('-handleDetail----menuId------', menuId);
  }
  function expandTableAll() {
    nextTick(expandAll);
  }
  function handleEdit(record: any) {
    openModal(true, {
      isUpdate: true,
      systemId: record.systemId,
      menuId: record.menuId,
    });
  }
  function handleChild(record: any) {
    openModal(true, {
      isUpdate: false,
      systemId: record.systemId,
      parentId: record.menuId,
      parentType: record.menuType,
    });
  }
  function getPictureUrl(url: string) {
    return getAttachmentUrl(url);
  }
  async function handleDelete(menuId: string) {
    await deleteById(menuId);
    reload();
  }

  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      updateTableDataRecord(values.menuId, values);
    } else {
      reload();
    }
  }

  function handleSelect(systemId = '') {
    searchInfo.systemId = systemId;
    reload();
  }
</script>
