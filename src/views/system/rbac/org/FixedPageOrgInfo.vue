<template>
  <PageWrapper @back="goBack" :title="title || '申请详情'" contentFullHeight>
    <template #extra>
      <a-button preIcon="ant-design:close-outlined" @click="goBack" size="middle"> 取消 </a-button>
    </template>
    <Spin tip="加载中" :spinning="data.pageLoading" size="large">
      <a-card style="width: 100%; min-height: 73vh">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="base-info" tab="基本信息">
            <BasicForm @register="registerForm" style="padding-right: 10px" />
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
          <a-tab-pane key="resource-auth" tab="资源权限">
            <a-row type="flex" justify="start">
              <a-col :span="4">
                <ResourceList @select="handleResourceSelect" />
              </a-col>
              <a-col :span="15">
                <ResourceApiList
                  :resource="data.resource"
                  :selectApiInfos="data.selectApiInfos"
                  v-model:value="data.authData.apiIds"
                  @change="handleChange"
                />
              </a-col>
              <a-col :span="5" style="max-height: 60vh; overflow-y: auto">
                <div>
                  <div
                    style="
                      font-size: 18px;
                      font-weight: 500;
                      line-height: 26px;
                      color: #000000d9;
                      width: 100%;
                      border-bottom: 1px solid #d9d9d9;
                      margin-bottom: 3px;
                    "
                    >已选择：</div
                  >
                  <template v-if="data.selectApiInfos && data.selectApiInfos">
                    <Popover
                      placement="bottomRight"
                      v-for="item in data.selectApiInfos"
                      :key="item.apiId"
                    >
                      <template #content>
                        <div>
                          {{ item.apiName }}
                        </div>
                        <div>
                          {{ item.apiUri }}
                        </div>
                        <div>
                          {{ item.permissionExpress }}
                        </div>
                      </template>
                      <a-tag
                        closable
                        color="#108ee9"
                        v-if="item.apiName && item.apiName.length > 4"
                        style="margin-bottom: 4px; cursor: pointer"
                        @close="handleCloseApi(item.apiId)"
                      >
                        {{ `${item.apiName.slice(0, 4)}...` }}
                      </a-tag>
                      <a-tag
                        closable
                        v-else
                        color="#108ee9"
                        style="margin-bottom: 4px; cursor: pointer"
                        @close="handleCloseApi(item.apiId)"
                      >
                        {{ `${item.apiName || '---'}` }}
                      </a-tag>
                    </Popover>
                  </template>
                </div>
              </a-col>
            </a-row>
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
  import ResourceList from './ResourceList.vue';
  import ResourceApiList from './ResourceApiList.vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './org.data';
  import { insert, update, getById } from '/@/api/modules/system/rbac/rbacOrg';
  import { Spin, Popover } from 'ant-design-vue';
  import { RbacResourceDto } from '/@/api/modules/system/rbac/model/rbacResourceModel';
  import { PageWrapper } from '/@/components/Page';
  import { ref, reactive, onMounted } from 'vue';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useRoute, useRouter } from 'vue-router';
  const route = useRoute();
  const params = reactive(route.query as any);
  const router = useRouter();
  const activeKey = ref('base-info');
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
  function handleResourceSelect(resource: RbacResourceDto) {
    data.resource = resource;
  }
  function handleChange({ selectedRows, selectedRowKeys }) {
    data.selectApiInfos = selectedRows;
    data.authData.apiIds = selectedRowKeys;
  }
  function handleCloseApi(appId: string) {
    let findIndex = data.selectApiInfos.findIndex((val) => val.appId == appId);
    if (findIndex != -1) {
      data.selectApiInfos.splice(findIndex, 1);
    }
    findIndex = data.authData.apiIds.findIndex((val) => val == appId);
    if (findIndex != -1) {
      data.authData.apiIds.splice(findIndex, 1);
    }
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
  async function handleDetail() {
    resetFields();
    data.selectApiInfos = [];
    data.authData.menuIds = [];
    data.authData.apiIds = [];
    if (params.orgId) {
      title.value = '编辑机构';
      const result = await getById(params.orgId);
      data.selectApiInfos = result.orgResourceInfos || [];
      data.authData.menuIds = result.orgMenuIds || [];
      data.authData.apiIds = result.orgResourceIds || [];
      setFieldsValue(result);
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
