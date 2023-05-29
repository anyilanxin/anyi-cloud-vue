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
  <div>
    <BasicTable
      @register="registerTable"
      @expand="handleExpandedChange"
      :row-selection="{
        selectedRowKeys: data.keys,
        onSelect: handleSelect,
        onSelectAll: handleSelectAll,
        type: 'checkbox',
      }"
    >
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
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, watch } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { selectPage, getMenuActionById } from '/@/api/modules/system/rbac/rbacOrgRole';
  import { columns, searchFormSchema } from './orgRole.data';
  const props = defineProps({
    value: {
      type: Object as PropType<string[]>,
      default: () => [] as string[],
    },
    selectRoleInfos: {
      type: Object as PropType<any[]>,
      default: () => [] as any[],
    },
  });
  const emit = defineEmits(['change', 'checked']);
  const [registerTable] = useTable({
    title: '角色列表',
    api: selectPage,
    rowKey: 'orgRoleId',
    columns,
    formConfig: {
      labelWidth: 80,
      schemas: searchFormSchema,
      alwaysShowLines: 1,
      autoAdvancedLine: 1,
    },
    useSearchForm: true,
    bordered: true,
    showTableSetting: false,
    expandRowByClick: true,
  });
  const data = reactive({
    meauActions: {},
    keys: [] as string[],
    selectRows: [] as any[],
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
  watch(
    () => props.value,
    () => {
      data.keys = props.value;
      data.selectRows = props.selectRoleInfos;
    },
    { immediate: true },
  );
  function handleSelect(record, selected) {
    if (selected) {
      data.keys.push(record.orgRoleId);
      data.selectRows.push(record);
    } else {
      let findIndex = data.selectRows.findIndex((val) => val.orgRoleId == record.orgRoleId);
      if (findIndex != -1) {
        data.selectRows.splice(findIndex, 1);
      }
      findIndex = data.keys.findIndex((val) => val == record.orgRoleId);
      if (findIndex != -1) {
        data.keys.splice(findIndex, 1);
      }
    }
    emit('change', { selectedRows: data.selectRows, selectedRowKeys: data.keys });
  }
  function handleSelectAll(selected, __selectedRows, changeRows) {
    if (selected) {
      changeRows.forEach((item) => {
        data.keys.push(item.orgRoleId);
        data.selectRows.push(item);
      });
    } else {
      changeRows.forEach((item) => {
        let findIndex = data.selectRows.findIndex((val) => val.orgRoleId == item.orgRoleId);
        if (findIndex != -1) {
          data.selectRows.splice(findIndex, 1);
        }
        findIndex = data.keys.findIndex((val) => val == item.orgRoleId);
        if (findIndex != -1) {
          data.keys.splice(findIndex, 1);
        }
      });
    }
    emit('change', { selectedRows: data.selectRows, selectedRowKeys: data.keys });
  }
</script>
