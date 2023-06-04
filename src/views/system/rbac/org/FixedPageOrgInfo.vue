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
  <PageWrapper @back="goBack" :title="title || '申请详情'" contentFullHeight>
    <template #extra>
      <a-button preIcon="ant-design:close-outlined" @click="goBack" size="middle"> 取消 </a-button>
    </template>
    <Spin tip="加载中" :spinning="data.pageLoading" size="large">
      <a-card style="width: 100%; min-height: 73vh">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="base-info" tab="基本信息">
            <BasicForm @register="registerForm" style="padding-right: 10px">
              <template #areaCode="{ model, field }">
                <TreeSelect
                  :treeDefaultExpandedKeys="data.treeDefaultExpandedKeys"
                  :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                  v-model:value="model[field]"
                  placeholder="请选择所属区域"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                  :tree-data="data.areaData"
                  :load-data="onLoadData"
                  :fieldNames="{ children: 'children', label: 'areaName', value: 'areaId' }"
                />
              </template>
            </BasicForm>
          </a-tab-pane>
          <a-tab-pane key="menu-auth" tab="功能权限">
            <div style="margin-bottom: 5px">
              <a-checkbox v-model:checked="data.selectAll">全选/全不选</a-checkbox>
              <a-checkbox v-model:checked="data.linkage">父子联动</a-checkbox>
            </div>
            <MenuAuth
              v-model:value="data.authData.menuIds"
              :selectAll="data.selectAll"
              @change="handleMenuChange"
              :linkage="data.linkage"
              style="max-height: 60vh; overflow-y: auto"
            />
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
  import MenuAuth from './MenuAuth.vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './org.data';
  import { insert, update, getById } from '/@/api/modules/system/rbac/rbacOrg';
  import { Spin, TreeSelect } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { getList } from '/@/api/modules/system/common/commonArea';
  import { CommonAreaTreeDto } from '/@/api/modules/system/common/model/commonAreaModel';
  import { ref, reactive, onMounted } from 'vue';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useRoute, useRouter } from 'vue-router';
  const route = useRoute();
  const params = reactive(route.query as any);
  const router = useRouter();
  const activeKey = ref('base-info');
  const data = reactive({
    pageLoading: false,
    treeDefaultExpandedKeys: [] as string[],
    areaData: [] as CommonAreaTreeDto[],
    submitLoading: false,
    selectAll: false,
    linkage: false,
    selectApiInfos: [] as any[],
    authData: {
      menuIds: [] as string[],
      apiIds: [] as string[],
    },
  });
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 120,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  });
  const { closeCurrent } = useTabs();
  const title = ref('新增机构');
  function goBack() {
    closeCurrent();
    router.back();
  }
  function handleMenuChange(menuIds: string[]) {
    data.authData.menuIds = menuIds;
  }
  async function handleSubmit() {
    try {
      data.submitLoading = true;
      const values = await validate();
      values.orgMenuIds = data.authData.menuIds;
      values.orgResourceIds = data.authData.apiIds;
      if (params.orgId) {
        await update(values, params.orgId);
      } else {
        await insert(values);
      }
      goBack();
    } finally {
      data.submitLoading = false;
    }
  }
  async function initAreaData(activateAreaId?: string) {
    const result = await getList('', activateAreaId);
    data.areaData = result;
  }
  function onLoadData(treeNode: any) {
    return new Promise((resolve) => {
      const { areaId } = treeNode.dataRef;
      getList(areaId).then((res) => {
        updateNodeByKey(areaId, data.areaData, res);
        resolve(true);
      });
    });
  }
  function updateNodeByKey(areaId: string, areaData: any[], updateData: any[]) {
    var length = areaData.length;
    for (var index = 0; index < length; index++) {
      const element = areaData[index];
      const children = element['children'];
      if (element['areaId'] == areaId) {
        element.children = updateData;
      } else if (children && children.length) {
        updateNodeByKey(areaId, children, updateData);
      }
    }
  }
  async function handleDetail() {
    resetFields();
    data.treeDefaultExpandedKeys = [];
    data.selectApiInfos = [];
    data.authData.menuIds = [];
    data.authData.apiIds = [];
    if (params.orgId) {
      title.value = '编辑机构';
      const result = await getById(params.orgId);
      await initAreaData(result.areaCode);
      data.selectApiInfos = result.orgResourceInfos || [];
      data.authData.menuIds = result.orgMenuIds || [];
      data.authData.apiIds = result.orgResourceIds || [];
      if (result.areaCode) {
        data.treeDefaultExpandedKeys.push(result.areaCode);
      }
      setFieldsValue(result);
    } else {
      await initAreaData();
    }
  }
  onMounted(() => {
    handleDetail();
  });
</script>

<style lang="less">
  .skillfull-instance-preview {
    background-color: @component-background !important;
  }

  .skillfull-instance-preview-content-diagram {
    overflow-y: hidden !important;
  }
</style>
