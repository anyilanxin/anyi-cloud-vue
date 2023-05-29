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
 *   7.进行商用时，不得基于AnYi Cloud Vue的基础，修改包装而成一个与AnYi Zeebe EE、AnYi Cloud EE功能类似的程序，进行销售或发布，参与同类软件产品市场的竞争；
 *   8.本软件使用的第三方依赖皆为开源软件，如需要修改第三方源码请遵循第三方源码附带开源协议；
 *   9.本软件流程部分请遵循camunda开源协议：
 *     https://docs.camunda.org/manual/latest/introduction/third-party-libraries
 *     https://github.com/camunda/camunda-bpm-platform/blob/master/LICENSE
 *   10.若您的项目无法满足以上几点，可申请商业授权。
 -->
<template>
  <PageWrapper @back="goBack" :title="title || '申请详情'" contentFullHeight>
    <template #extra>
      <a-button preIcon="ant-design:close-outlined" @click="goBack" size="middle"> 取消 </a-button>
    </template>
    <Spin tip="加载中" :spinning="data.pageLoading" size="large">
      <a-card style="width: 100%; min-height: 73vh">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="menu-auth" tab="功能权限">
            <div style="margin-bottom: 5px">
              <a-checkbox v-model:checked="data.selectAll">全选/全不选</a-checkbox>
              <a-checkbox v-model:checked="data.linkage">父子联动</a-checkbox>
            </div>
            <MenuAuth
              v-model:value="data.authData.menuIds"
              :selectAll="data.selectAll"
              :linkage="data.linkage"
              style="max-height: 60vh; overflow-y: auto"
            />
          </a-tab-pane>
          <a-tab-pane key="data-auth" tab="数据权限" class="data-auth">
            <div style="width: 50%">
              <a-radio-group v-model:value="data.authData.dataAuthType" button-style="solid">
                <a-radio-button :value="1">全部</a-radio-button>
                <a-radio-button :value="2">当前机构</a-radio-button>
                <a-radio-button :value="3">当前机构及以下</a-radio-button>
                <a-radio-button :value="4">机构自定义</a-radio-button>
                <!-- <a-radio-button  :value="5">当前区域</a-radio-button>
              <a-radio-button  :value="6">当前区域及以下</a-radio-button> -->
                <!-- <a-radio-button  :value="7">区域自定义</a-radio-button> -->
                <a-radio-button :value="8">仅自己</a-radio-button>
              </a-radio-group>
              <a-card style="width: 80%; margin-top: 20px" v-show="data.authData.dataAuthType == 4">
                <OrgTree :value="data.authData.customDataAuthData" @change="handleDataAuthChange" />
              </a-card>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </Spin>
    <template #rightFooter>
      <a-button
        type="primary"
        style="margin-right: 10px"
        :loading="data.submitLoading"
        :preIcon="data.submitLoading ? '' : 'ant-design:form-outlined'"
        @click="handleSubmit"
        >确认</a-button
      >
      <a-button preIcon="ant-design:close-outlined" @click="goBack" size="middle"> 取消 </a-button>
    </template>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { Spin } from 'ant-design-vue';
  import MenuAuth from './MenuAuth.vue';
  import OrgTree from './OrgTree.vue';
  import { PageWrapper } from '/@/components/Page';
  import { RbacResourceDto } from '/@/api/modules/system/rbac/model/rbacResourceModel';
  import { getById as getRoleById, updateAuth } from '/@/api/modules/system/rbac/rbacRole';
  import { ref, reactive, onMounted } from 'vue';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useRoute, useRouter } from 'vue-router';
  const route = useRoute();
  const router = useRouter();
  const params = reactive(route.query as any);
  const activeKey = ref('menu-auth');
  const data = reactive({
    pageLoading: false,
    submitLoading: false,
    resource: {} as RbacResourceDto,
    selectAll: false,
    linkage: false,
    selectApiInfos: [] as any[],
    authData: {
      menuIds: [] as string[],
      apiIds: [] as string[],
      dataAuthType: 8,
      customDataAuthData: [] as string[],
    },
  });
  const { closeCurrent } = useTabs();
  const title = ref('角色授权');
  function goBack() {
    closeCurrent();
    router.back();
  }
  async function handleSubmit() {
    try {
      data.submitLoading = true;
      if (data.authData.dataAuthType != 4) {
        data.authData.customDataAuthData = [];
      }
      await updateAuth(data.authData, params.roleId);
      goBack();
    } finally {
      data.submitLoading = false;
    }
  }
  function handleDataAuthChange(keys: string[]) {
    data.authData.customDataAuthData = keys;
  }
  // function handleMenuChange(menuIds: string[]) {
  //   data.authData.menuIds = menuIds;
  // }
  async function handleDetail() {
    try {
      data.pageLoading = true;
      const roleInfo = await getRoleById(params.roleId);
      data.authData = {
        menuIds: roleInfo.menuIds,
        apiIds: roleInfo.apiIds,
        dataAuthType: roleInfo.dataAuthType || 8,
        customDataAuthData: roleInfo.customDataAuthData || [],
      };
      data.selectApiInfos = roleInfo.selectApiInfos || [];
    } finally {
      data.pageLoading = false;
    }
  }
  onMounted(() => {
    handleDetail();
  });
</script>

<style lang="less">
  .data-auth {
    margin: 10px;
    margin-left: 30px;
  }
</style>
