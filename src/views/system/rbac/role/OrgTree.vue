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
  <div>
    <BasicTree
      title="机构列表"
      toolbar
      search
      checkable
      v-model:value="checkedKeys"
      :treeData="treeData"
      ref="asyncExpandTreeRef"
      @check="handleCheck"
      :fieldNames="{ key: 'orgId', title: 'orgName' }"
    >
      <template #title="item">
        <span>
          {{ item.orgName }}
        </span>
        <a-tag
          :color="item.orgType === 1 ? 'blue' : 'green'"
          style="margin-left: 4px; line-height: 18px; padding: 0 5px"
        >
          {{ item.orgType === 1 ? '公司' : '部门' }}
        </a-tag>
      </template>
    </BasicTree>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, nextTick, unref, watch } from 'vue';
  import { BasicTree } from '/@/components/Tree';
  import { selectOrgTreeList } from '/@/api/modules/system/rbac/rbacOrg';
  import { RbacOrgTreeDto } from '/@/api/modules/system/rbac/model/rbacOrgModel';
  const emit = defineEmits(['change']);
  const asyncExpandTreeRef = ref();
  const treeData = ref<RbacOrgTreeDto[]>([]);
  const checkedKeys = ref<string[]>(['1543380652053282816']);
  const props = defineProps({
    value: {
      type: Object as PropType<string[]>,
      default: () => [] as string[],
    },
  });
  watch(
    () => props.value,
    (val, old) => {
      if (val !== old) {
        checkedKeys.value = props.value;
      }
    },
    { immediate: true, deep: true },
  );
  async function fetch() {
    treeData.value = await selectOrgTreeList(1);
    // 默认展开一级
    nextTick(() => {
      unref(asyncExpandTreeRef)?.filterByLevel(2);
    });
  }
  function handleCheck() {
    emit('change', checkedKeys.value);
  }
  onMounted(() => {
    fetch();
  });
</script>
