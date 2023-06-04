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
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :destroyOnClose="true"
    :title="getTitle"
    :draggable="false"
    @ok="handleSubmit"
    width="60%"
  >
    <BasicTable
      @register="registerTable"
      :searchInfo="searchInfo"
      :maxHeight="300"
      :rowSelection="{ type: 'checkbox' }"
      :row-selection="{
        selectedRowKeys: dataInfo.keys,
        onSelect: handleSelect,
        onSelectAll: handleSelectAll,
        type: 'checkbox',
      }"
    >
      <template #headerTop>
        <Alert type="info" show-icon>
          <template #message>
            <div style="display: flex">
              <div style="margin-right: 20px; font-weight: 450; display: flex; align-items: center">
                <div>
                  <span style="margin-right: 5px">已选择:</span>
                  <span class="text-yellow-600">{{ dataInfo.keys?.length || 0 }}</span>
                </div>
                <a-divider type="vertical" />
                <div>
                  <a-button type="link" size="small" @click="handleClear">清空</a-button>
                </div>
              </div>
            </div>
          </template>
        </Alert>
      </template>
      <template #avatar="{ record }">
        <a-avatar :size="33" :src="getPictureUrl(record.avatar)" v-if="record.avatar" />
      </template>
      <template #userStatus="{ record }">
        <a-badge status="default" v-if="record.userStatus == 0" text="未激活" />
        <a-badge status="processing" v-else-if="record.userStatus == 1" text="启用" />
        <a-badge status="warning" v-else-if="record.userStatus == 2" text="冻结" />
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { Alert } from 'ant-design-vue';
  import { message } from 'ant-design-vue';
  import { reactive, computed } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { selectEnableUserPage, joinOrg } from '/@/api/modules/system/rbac/rbacUser';
  import { getAttachmentUrl } from '/@/utils';
  import { associateColumns, associateSearchFormSchema } from './user.data';
  const emit = defineEmits(['success', 'register']);
  const dataInfo = reactive({
    keys: [] as string[],
    orgId: '',
    orgName: '',
  });
  const searchInfo = reactive<Recordable>({ orgId: '' });
  const [registerModal, { setModalProps, closeModal, changeOkLoading }] = useModalInner(
    async (data) => {
      setModalProps({ confirmLoading: false });
      dataInfo.keys = [];
      dataInfo.orgId = data?.orgId;
      dataInfo.orgName = data?.orgName;
      searchInfo.orgId = dataInfo.orgId;
      reload();
    },
  );
  const getTitle = computed(() =>
    !dataInfo.orgName ? '关联机构' : '关联机构:' + dataInfo.orgName,
  );
  const [registerTable, { reload }] = useTable({
    title: '待关联用户列表',
    api: selectEnableUserPage,
    rowKey: 'userId',
    columns: associateColumns,
    formConfig: {
      labelWidth: 70,
      schemas: associateSearchFormSchema,
      autoSubmitOnEnter: true,
      alwaysShowLines: 1,
    },
    useSearchForm: true,
    showIndexColumn: false,
    showTableSetting: true,
    canResize: false,
    tableSetting: { fullScreen: false },
    bordered: true,
  });
  function getPictureUrl(url: string) {
    return getAttachmentUrl(url);
  }
  async function handleSubmit() {
    try {
      if (dataInfo.keys?.length <= 0) {
        message.error('请先选择用户');
        return;
      }
      changeOkLoading(true);
      const data = {
        orgId: dataInfo.orgId,
        userIds: dataInfo.keys,
      };
      await joinOrg(data);
      closeModal();
      emit('success');
    } finally {
      changeOkLoading(false);
    }
  }
  function handleSelect(record, selected) {
    if (selected) {
      dataInfo.keys.push(record.userId);
    } else {
      const findIndex = dataInfo.keys.findIndex((val) => val == record.userId);
      if (findIndex != -1) {
        dataInfo.keys.splice(findIndex, 1);
      }
    }
  }
  function handleSelectAll(selected, __selectedRows, changeRows) {
    if (selected) {
      changeRows.forEach((item) => {
        dataInfo.keys.push(item.userId);
      });
    } else {
      changeRows.forEach((item) => {
        const findIndex = dataInfo.keys.findIndex((val) => val == item.userId);
        if (findIndex != -1) {
          dataInfo.keys.splice(findIndex, 1);
        }
      });
    }
  }
  function handleClear() {
    dataInfo.keys = [];
  }
</script>
