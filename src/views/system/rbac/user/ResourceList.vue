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
  <div :class="prefixCls">
    <BasicTree
      title="资源列表"
      search
      default-expand-all
      :show-icon="true"
      :clickRowToExpand="false"
      :toolbar="false"
      :tree-data="resourceData"
      :fieldNames="{ key: 'resourceIdAndTag', title: 'resourceName' }"
      @select="handleSelect"
    >
      <template #title="{ resourceIcon, resourceName, resourceStatus }">
        <div>
          <a-avatar
            shape="square"
            :size="20"
            :src="getPictureUrl(resourceIcon)"
            v-if="resourceIcon"
          />
          <span style="margin-left: 7px">{{ resourceName }}</span>
          <span style="color: #f5222d" v-if="resourceStatus == 0">(禁用)</span>
        </div>
      </template>
    </BasicTree>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getAttachmentUrl } from '/@/utils';
  import { BasicTree } from '/@/components/Tree';
  import { selectResourceList } from '/@/api/modules/system/rbac/rbacOrg';
  import { RbacResourceDto } from '/@/api/modules/system/rbac/model/rbacResourceModel';
  const { prefixCls } = useDesign('system-list');
  const emit = defineEmits(['select']);
  const resourceData = ref<RbacResourceDto[]>([]);
  async function fetch() {
    const data = await selectResourceList();
    if (data && data.length > 0) {
      data.forEach((item) => {
        item.slots = { icon: 'custom' };
      });
    }
    resourceData.value = data;
  }
  function handleSelect(__keys: any, e: { selected: boolean; selectedNodes; node; event }) {
    emit('select', e.selectedNodes[0]);
  }
  function getPictureUrl(url: string) {
    return getAttachmentUrl(url);
  }
  onMounted(() => {
    fetch();
  });
  defineExpose({
    fetch,
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-system-list';
  .@{prefix-cls} {
    .ant-tree li .ant-tree-node-content-wrapper {
      height: 27px;
    }
  }
</style>
