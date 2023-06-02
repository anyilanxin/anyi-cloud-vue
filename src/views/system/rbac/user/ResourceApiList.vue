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
  <BasicTable
    @register="registerTable"
    :rowSelection="{ type: 'checkbox' }"
    :row-selection="{
      selectedRowKeys: data.keys,
      onSelect: handleSelect,
      onSelectAll: handleSelectAll,
      type: 'checkbox',
    }"
    :searchInfo="searchInfo"
  />
</template>
<script lang="ts" setup>
  import { reactive, watch, nextTick } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { selectResourcePage } from '/@/api/modules/system/rbac/rbacOrg';
  import { RbacResourceDto } from '/@/api/modules/system/rbac/model/rbacResourceModel';
  import { columns, searchFormSchema } from './resourceapi.data';
  import { useRoute } from 'vue-router';
  const route = useRoute();
  const params = reactive(route.query as any);
  const searchInfo = reactive<Recordable>({ authType: 1, orgId: params.orgId });
  const props = defineProps({
    resource: {
      type: Object as PropType<RbacResourceDto>,
      default: () => {},
    },
    value: {
      type: Object as PropType<string[]>,
      default: () => [] as string[],
    },
    selectApiInfos: {
      type: Object as PropType<any[]>,
      default: () => [] as any[],
    },
  });
  const emit = defineEmits(['change', 'checked']);
  const [registerTable, { reload }] = useTable({
    api: selectResourcePage,
    rowKey: 'apiId',
    columns,
    formConfig: {
      labelWidth: 70,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      alwaysShowLines: 1,
      autoAdvancedLine: 1,
    },
    useSearchForm: true,
    indentSize: 10,
    showIndexColumn: false,
    bordered: true,
    showTableSetting: false,
  });
  const data = reactive({
    keys: [] as string[],
    selectRows: [] as any[],
  });
  watch(
    () => props.resource,
    () => {
      searchInfo.resourceId = props.resource?.resourceId || '';
      nextTick(() => {
        reload();
      });
    },
    { immediate: true },
  );
  watch(
    () => props.value,
    () => {
      data.keys = props.value;
      data.selectRows = props.selectApiInfos;
    },
    { immediate: true },
  );
  function handleSelect(record, selected) {
    if (selected) {
      data.keys.push(record.apiId);
      data.selectRows.push(record);
    } else {
      let findIndex = data.selectRows.findIndex((val) => val.apiId == record.apiId);
      if (findIndex != -1) {
        data.selectRows.splice(findIndex, 1);
      }
      findIndex = data.keys.findIndex((val) => val == record.apiId);
      if (findIndex != -1) {
        data.keys.splice(findIndex, 1);
      }
    }
    emit('change', { selectedRows: data.selectRows, selectedRowKeys: data.keys });
  }
  function handleSelectAll(selected, __selectedRows, changeRows) {
    if (selected) {
      changeRows.forEach((item) => {
        data.keys.push(item.apiId);
        data.selectRows.push(item);
      });
    } else {
      changeRows.forEach((item) => {
        let findIndex = data.selectRows.findIndex((val) => val.apiId == item.apiId);
        if (findIndex != -1) {
          data.selectRows.splice(findIndex, 1);
        }
        findIndex = data.keys.findIndex((val) => val == item.apiId);
        if (findIndex != -1) {
          data.keys.splice(findIndex, 1);
        }
      });
    }
    emit('change', { selectedRows: data.selectRows, selectedRowKeys: data.keys });
  }
</script>

<style lang="less">
  .vben-basic-table-form-container {
    padding: 0px 16px 0px 16px;

    & > .ant-form {
      padding: 0px !important;
    }
  }
</style>
