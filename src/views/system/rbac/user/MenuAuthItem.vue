<!--
 * Copyright (c) 2023-present ZHOUXUANHONG(安一老厨)<anyilanxin@aliyun.com>
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
  <a-checkbox-group class="role-auth-menu-parent" v-model:value="checkedList">
    <ul class="role-auth-menu-ul">
      <li v-for="item in data" :key="item.menuId" class="role-auth-menu-li">
        <a-checkbox
          :value="item.menuId"
          @click.prevent="selectCheckbox(item)"
          :indeterminate="indeterminate"
        >
          {{ item.metaTitle }}
        </a-checkbox>
        <MenuAuthItem
          :data="item.children"
          :linkage="linkage"
          v-if="item.menuType == 0 && item.children"
          :value="value"
        />
        <a-checkbox-group
          class="role-auth-menu-menu-checkbox"
          v-else-if="item.children"
          v-model:value="checkedList"
        >
          <template v-for="subItem in item.children" :key="subItem.menuId">
            <a-checkbox :value="subItem.menuId" @click.prevent="selectCheckbox(subItem)">
              {{ subItem.metaTitle }}
            </a-checkbox>
          </template>
        </a-checkbox-group>
      </li>
    </ul>
  </a-checkbox-group>
</template>
<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ref, watch } from 'vue';
  const props = defineProps({
    data: {
      type: Object as PropType<any[]>,
      default: () => [] as any[],
    },
    value: {
      type: Object as PropType<string[]>,
      default: () => [] as string[],
    },
    linkage: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits(['change']);
  const checkedList = ref<string[]>([]);
  const indeterminate = ref(false);
  watch(
    () => props.value,
    (val, old) => {
      if (val !== old) {
        checkedList.value = props.value;
      }
    },
    { immediate: true, deep: true },
  );
  function selectCheckbox(item: any) {
    const menuId = item.menuId;
    let findIndex = checkedList.value.findIndex((val) => val == menuId);
    if (findIndex != -1) {
      checkedList.value.splice(findIndex, 1);
      if (props.linkage && item.children && item.children.length > 0) {
        getAllMenuId(item.children, true);
      }
    } else {
      checkedList.value.push(item.menuId);
      if (props.linkage && item.children && item.children.length > 0) {
        getAllMenuId(item.children, false);
      }
    }

    emit('change', checkedList.value);
  }

  function getAllMenuId(children: any[], clear: boolean) {
    const length = children?.length || 0;
    if (length > 0) {
      for (var index = 0; index < length; index++) {
        const item = children[index];
        let findIndex = checkedList.value.findIndex((val) => val == item.menuId);
        if (findIndex == -1 && !clear) {
          checkedList.value.push(item.menuId);
        } else if (findIndex !== -1 && clear) {
          checkedList.value.splice(findIndex, 1);
        }
        if (item.children && item.children.length > 0) {
          getAllMenuId(item.children, clear);
        }
      }
    }
  }
</script>

<style lang="less">
  .role-auth-menu-parent {
    position: relative;
    width: 100%;

    .role-auth-menu-ul {
      width: 100%;
      // padding: 10px;

      .role-auth-menu-li {
        display: flex;
        border-left: 1px solid @border-color-base;
        border-bottom: 1px solid @border-color-base;
        padding-left: 10px;
        align-items: center;
        padding-top: 10px;
        padding-bottom: 10px;

        .ant-checkbox-wrapper {
          min-width: 150px;
        }

        .ant-checkbox-wrapper + .ant-checkbox-wrapper {
          margin-left: 0px;
        }

        .role-auth-menu-menu-checkbox {
          width: 100%;
          padding-top: 10px;
          padding-left: 5px;
          padding-bottom: 10px;
          border-left: 1px solid @border-color-base;
        }
      }
    }
  }
</style>
