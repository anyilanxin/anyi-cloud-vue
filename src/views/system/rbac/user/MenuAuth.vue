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
    <MenuAuthItem
      :data="data.menuTree"
      v-if="data.menuTree && data.menuTree.length > 0"
      class="menu-auth"
      :linkage="linkage"
      v-model:value="data.selectTree"
    />
    <a-empty v-else />
  </div>
</template>
<script lang="ts" setup>
  import MenuAuthItem from './MenuAuthItem.vue';
  import { reactive, onMounted, watch } from 'vue';
  import { getMenuTree } from '/@/api/modules/system/rbac/rbacOrg';
  import { useRoute } from 'vue-router';
  const route = useRoute();
  const params = reactive(route.query as any);
  const data = reactive({
    menuTree: [] as any[],
    selectTree: [] as string[],
  });
  const props = defineProps({
    value: {
      type: Object as PropType<string[]>,
      default: () => [] as string[],
    },
    selectAll: {
      type: Boolean,
      default: false,
    },
    linkage: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits(['change']);
  watch(
    () => props.value,
    (val, old) => {
      if (val !== old) {
        data.selectTree = props.value;
      }
    },
    { immediate: true, deep: true },
  );
  watch(
    () => data.selectTree,
    (val, old) => {
      if (val !== old) {
        emit('change', data.selectTree);
      }
    },
    { immediate: true, deep: true },
  );
  watch(
    () => props.selectAll,
    (val, old) => {
      if (val !== old) {
        if (props.selectAll) {
          getAllMenuId(data.menuTree);
        } else if (old != undefined) {
          data.selectTree = [];
        }
        emit('change', data.selectTree);
      }
    },
    { immediate: true },
  );
  function getAllMenuId(children: any[]) {
    const length = children?.length || 0;
    if (length > 0) {
      for (var index = 0; index < length; index++) {
        const item = children[index];
        let findIndex = data.selectTree.findIndex((val) => val == item.menuId);
        if (findIndex == -1) {
          data.selectTree.push(item.menuId);
        }
        if (item.children && item.children.length > 0) {
          getAllMenuId(item.children);
        }
      }
    }
  }
  async function handleMenuTree() {
    data.menuTree = await getMenuTree(params.orgId);
  }
  onMounted(() => {
    handleMenuTree();
  });
</script>

<style lang="less">
  .menu-auth {
    border: 1px solid @border-color-base;

    min-height: 60vh;
    overflow: auto;
  }
</style>
