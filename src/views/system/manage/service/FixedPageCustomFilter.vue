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
  <PageWrapper
    @back="goBack"
    :title="'服务过滤器' + (params.serviceName ? `(${params.serviceName})` : '')"
    :contentClass="prefixCls"
    contentBackground
    contentFullHeight
  >
    <template #extra>
      <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleCreate">
        新增过滤器
      </a-button>
      <a-button type="primary" @click="getCustomFilters" :loading="loading"> 查询 </a-button>
    </template>
    <div>
      <a-row type="flex" justify="start" :gutter="8" v-if="serviceCustomFilter.array.length > 0">
        <div v-for="filterInfo in serviceCustomFilter.array" :key="filterInfo.customFilterId">
          <a-col :span="6">
            <a-card
              hoverable
              :style="
                'width: 300px; margin: 10px;' +
                (filterInfo.filterStatus == 0 ? 'border:1px solid #ffd591' : '')
              "
              :title="filterInfo.filterName + '(' + filterInfo.filterTypeName + ')'"
            >
              <template #actions>
                <a-tooltip placement="bottom" title="详情">
                  <InfoCircleOutlined key="info" @click="handleView(filterInfo.customFilterId)" />
                </a-tooltip>
                <a-tooltip placement="bottom" title="编辑" @click="handleEdit(filterInfo)">
                  <EditOutlined key="edit" style="color: #1890ff" />
                </a-tooltip>
                <a-tooltip
                  placement="bottom"
                  title="删除"
                  @click="handleDelete(filterInfo.customFilterId)"
                >
                  <DeleteOutlined key="delete" style="color: #ff7875" />
                </a-tooltip>
              </template>
              <div style="display: flex; flex-direction: column; justify-content: space-between">
                <div>
                  <a-form :layout="'vertical'" :label-col="{ span: 24 }">
                    <a-form-item
                      label="白名单"
                      v-if="filterInfo.whiteSpecialUrls && filterInfo.whiteSpecialUrls.length > 0"
                    >
                      <div style="display: flex; flex-wrap: wrap; margin-left: 8px">
                        <Popover
                          placement="bottomRight"
                          v-for="urlInfo in filterInfo.whiteSpecialUrls"
                          :key="urlInfo.specialUrlId"
                        >
                          <template #content>
                            <div>{{ urlInfo.url || '---' }}</div>
                          </template>
                          <a-tag
                            v-if="urlInfo.urlName && urlInfo.urlName?.length > 4"
                            color="processing"
                            class="white-list-content"
                          >
                            {{ `${urlInfo.urlName.slice(0, 4)}...` }}
                          </a-tag>
                          <a-tag v-else color="processing" class="white-list-content">
                            {{ urlInfo.urlName || '---' }}
                          </a-tag>
                        </Popover>
                      </div>
                    </a-form-item>
                    <a-form-item
                      label="黑名单"
                      v-if="filterInfo.blackSpecialUrls && filterInfo.blackSpecialUrls.length > 0"
                    >
                      <div style="display: flex; flex-wrap: wrap; margin-left: 8px">
                        <Popover
                          placement="bottomRight"
                          v-for="urlInfo in filterInfo.blackSpecialUrls"
                          :key="urlInfo.specialUrlId"
                        >
                          <template #content>
                            <div>{{ urlInfo.url || '---' }}</div>
                          </template>
                          <a-tag
                            v-if="urlInfo.urlName && urlInfo.urlName?.length > 4"
                            color="warning"
                            class="white-list-content"
                          >
                            {{ `${urlInfo.urlName.slice(0, 4)}...` }}
                          </a-tag>
                          <a-tag v-else color="warning" class="white-list-content">
                            {{ urlInfo.urlName || '---' }}
                          </a-tag>
                        </Popover>
                      </div>
                    </a-form-item>
                    <a-form-item label="状态:">
                      <div style="margin-left: 8px">
                        <a-radio-group
                          button-style="solid"
                          @change="
                            handleChangeStatus(filterInfo.customFilterId, filterInfo.filterStatus)
                          "
                          size="small"
                          v-model:value="filterInfo.filterStatus"
                        >
                          <a-radio-button :value="1">启用</a-radio-button>
                          <a-radio-button :value="0">禁用</a-radio-button>
                        </a-radio-group>
                      </div>
                    </a-form-item>
                  </a-form>
                </div>
                <div style="margin-top: 8px">
                  <a-row type="flex" justify="space-around">
                    <a-col :span="12">{{ filterInfo.createUserName }}</a-col>
                    <a-col :span="12">{{ filterInfo.createTime }}</a-col>
                  </a-row>
                </div>
              </div>
            </a-card>
          </a-col>
        </div>
      </a-row>
      <div v-else>
        <a-empty />
      </div>
    </div>
    <ModalCustomFilter @register="registerModal" @success="getCustomFilters" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { InfoCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import { Popover } from 'ant-design-vue';
  import { useRoute, useRouter } from 'vue-router';
  import ModalCustomFilter from './ModalCustomFilter.vue';
  import { ref, reactive, onMounted } from 'vue';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useModal } from '/@/components/Modal';
  import { PageWrapper } from '/@/components/Page';
  import { ManageCustomFilterDto } from '/@/api/modules/system/manage/model/manageCustomFilterModel';
  import {
    selectList,
    updateStatus,
    deleteById,
  } from '/@/api/modules/system/manage/manageCustomFilter';
  import { useDesign } from '/@/hooks/web/useDesign';
  const [registerModal, { openModal }] = useModal();
  const { prefixCls } = useDesign('custom-filter');
  const { closeCurrent } = useTabs();
  const route = useRoute();
  const params = reactive(route.query);
  const router = useRouter();
  const loading = ref(false);
  const serviceCustomFilter = reactive({
    array: [] as ManageCustomFilterDto[],
  });
  function goBack() {
    closeCurrent();
    router.back();
  }
  async function getCustomFilters() {
    loading.value = true;
    try {
      serviceCustomFilter.array = (await selectList(params.serviceId)) || [];
    } finally {
      loading.value = false;
    }
  }
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
      serviceId: params.serviceId,
    });
  }
  async function handleChangeStatus(customFilterId: string, state: number) {
    await updateStatus(customFilterId, state);
    getCustomFilters();
  }
  function handleView(customFilterId: string) {
    console.log('------handleView---------', customFilterId);
  }
  function handleEdit(filterInfo: ManageCustomFilterDto) {
    openModal(true, {
      isUpdate: true,
      serviceId: params.serviceId,
      customFilterId: filterInfo.customFilterId,
    });
  }
  async function handleDelete(customFilterId: string) {
    await deleteById(customFilterId);
    getCustomFilters();
  }
  onMounted(() => {
    getCustomFilters();
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-custom-filter';
  .@{prefix-cls} {
    padding: 10px;

    .ant-card-head {
      min-height: 36px;

      .ant-card-head-title {
        padding: 5px 0;
      }
    }

    .ant-card-actions > li {
      margin: 5px 0;
    }

    .ant-card-body {
      padding: 8px;

      .ant-form-item {
        margin-bottom: 8px;

        .ant-form-item-label {
          font-weight: 500;
        }
      }

      .white-list-content {
        margin-bottom: 4px;
      }
    }
  }
</style>
