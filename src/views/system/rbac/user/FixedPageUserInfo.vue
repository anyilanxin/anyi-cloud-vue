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
  <PageWrapper @back="goBack" :title="title || '用户信息'" contentFullHeight>
    <template #extra>
      <a-button preIcon="ant-design:close-outlined" @click="goBack" size="middle"> 取消 </a-button>
    </template>
    <Spin tip="加载中" :spinning="data.pageLoading" size="large">
      <a-card style="width: 100%; min-height: 73vh">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="base-info" tab="基本信息">
            <BasicForm @register="registerForm" style="padding-right: 10px" autocomplete="off" />
          </a-tab-pane>
          <a-tab-pane key="menu-auth" tab="用户角色">
            <a-row type="flex" justify="start">
              <a-col :span="18">
                <UserRoleList
                  :roleInfos="data.roleInfos"
                  v-model:value="data.authData.roleIds"
                  @change="handleRoleChange"
                />
              </a-col>
              <a-col :span="6" style="max-height: 60vh; overflow-y: auto">
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
                  <template v-if="data.roleInfos && data.roleInfos">
                    <Popover
                      placement="bottomRight"
                      v-for="item in data.roleInfos"
                      :key="item.roleId"
                    >
                      <template #content>
                        <div>
                          {{ item.roleName }}
                        </div>
                        <div>
                          {{ item.roleCode }}
                        </div>
                      </template>
                      <a-tag
                        closable
                        color="#108ee9"
                        v-if="item.roleName && item.roleName.length > 4"
                        style="margin-bottom: 4px; cursor: pointer"
                        @close="handleCloseRole(item.roleId)"
                      >
                        {{ `${item.roleName.slice(0, 4)}...` }}
                      </a-tag>
                      <a-tag
                        closable
                        v-else
                        color="#108ee9"
                        style="margin-bottom: 4px; cursor: pointer"
                        @close="handleCloseRole(item.roleId)"
                      >
                        {{ `${item.roleName || '---'}` }}
                      </a-tag>
                    </Popover>
                  </template>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="resource-auth" tab="部门角色" v-if="params.orgId">
            <a-row type="flex" justify="start">
              <a-col :span="18">
                <OrgRoleList
                  :roleInfos="data.orgRoleInfos"
                  v-model:value="data.authData.orgRoleIds"
                  @change="handleDeptRoleChange"
                />
              </a-col>
              <a-col :span="6" style="max-height: 60vh; overflow-y: auto">
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
                  <template v-if="data.orgRoleInfos && data.orgRoleInfos">
                    <Popover
                      placement="bottomRight"
                      v-for="item in data.orgRoleInfos"
                      :key="item.roleId"
                    >
                      <template #content>
                        <div>
                          {{ item.roleName }}
                        </div>
                        <div>
                          {{ item.roleCode }}
                        </div>
                      </template>
                      <a-tag
                        closable
                        color="#108ee9"
                        v-if="item.roleName && item.roleName.length > 4"
                        style="margin-bottom: 4px; cursor: pointer"
                        @close="handleDeptCloseRole(item.roleId)"
                      >
                        {{ `${item.roleName.slice(0, 4)}...` }}
                      </a-tag>
                      <a-tag
                        closable
                        v-else
                        color="#108ee9"
                        style="margin-bottom: 4px; cursor: pointer"
                        @close="handleDeptCloseRole(item.roleId)"
                      >
                        {{ `${item.roleName || '---'}` }}
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
  import OrgRoleList from './OrgRoleList.vue';
  import UserRoleList from './UserRoleList.vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { accountFormSchema } from './user.data';
  import { insert, update, getById } from '/@/api/modules/system/rbac/rbacUser';
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
    orgRoleInfos: [] as any[],
    roleInfos: [] as any[],
    authData: {
      orgRoleIds: [] as string[],
      roleIds: [] as string[],
    },
  });

  const [registerForm, { resetFields, setFieldsValue, removeSchemaByFiled, validate }] = useForm({
    labelWidth: 120,
    schemas: accountFormSchema,
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  });
  const { closeCurrent } = useTabs();
  const title = ref(params.userId ? '编辑用户' : '新增用户');
  function goBack() {
    closeCurrent();
    router.back();
  }
  async function handleSubmit() {
    try {
      data.submitLoading = true;
      const values = await validate();
      if (params.orgId) {
        values.orgRoleIds = data.authData.orgRoleIds;
      }
      values.roleIds = data.authData.roleIds;
      if (params.userId) {
        await update(values, params.userId);
      } else {
        await insert(values);
      }
      goBack();
    } finally {
      data.submitLoading = false;
    }
  }
  function handleCloseRole(roleId: string) {
    let findIndex = data.roleInfos.findIndex((val) => val.roleId == roleId);
    if (findIndex != -1) {
      data.roleInfos.splice(findIndex, 1);
    }
    findIndex = data.authData.roleIds.findIndex((val) => val == roleId);
    if (findIndex != -1) {
      data.authData.roleIds.splice(findIndex, 1);
    }
  }
  function handleRoleChange({ selectedRows, selectedRowKeys }) {
    data.roleInfos = selectedRows;
    data.authData.roleIds = selectedRowKeys;
  }
  function handleDeptCloseRole(roleId: string) {
    let findIndex = data.orgRoleInfos.findIndex((val) => val.roleId == roleId);
    if (findIndex != -1) {
      data.orgRoleInfos.splice(findIndex, 1);
    }
    findIndex = data.authData.orgRoleIds.findIndex((val) => val == roleId);
    if (findIndex != -1) {
      data.authData.orgRoleIds.splice(findIndex, 1);
    }
  }
  function handleDeptRoleChange({ selectedRows, selectedRowKeys }) {
    data.orgRoleInfos = selectedRows;
    data.authData.orgRoleIds = selectedRowKeys;
  }
  async function handleDetail() {
    if (params.userId) {
      try {
        resetFields();
        data.pageLoading = true;
        const userInfo = await getById(params.userId, params.orgId);
        data.authData = userInfo;
        data.orgRoleInfos = userInfo.orgRoleInfos || [];
        data.roleInfos = userInfo.roleInfos || [];
        removeSchemaByFiled('password');
        setFieldsValue({
          ...data.authData,
        });
      } finally {
        data.pageLoading = false;
      }
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
