<template>
  <PageWrapper
    @back="goBack"
    :title="
      '过滤器信息' +
      (serviceFilterAndUrl['serviceName'] ? `(${serviceFilterAndUrl['serviceName']})` : '')
    "
    :contentClass="prefixCls"
    contentBackground
    contentFullHeight
  >
    <template #extra>
      <a-button
        type="primary"
        preIcon="ant-design:plus-outlined"
        @click="handleCreate"
        :disabled="Object.keys(noCreatefilterTypes).length == 0"
      >
        新增过滤器
      </a-button>
      <a-button type="primary" @click="getAllUrl" :loading="loading"> 查询 </a-button>
    </template>
    <div>
      <a-row
        type="flex"
        justify="start"
        :gutter="8"
        v-if="serviceFilterAndUrl['filterInfos'] && serviceFilterAndUrl['filterInfos'].length > 0"
      >
        <div v-for="filterInfo in serviceFilterAndUrl['filterInfos']" :key="filterInfo.filterId">
          <a-col :span="6">
            <a-card
              hoverable
              style="width: 300px; margin: 10px"
              :title="filterTypeMaps[filterInfo.filterType] || '---'"
            >
              <template class="ant-card-actions" #actions>
                <a-tooltip placement="bottom" title="详情">
                  <InfoCircleOutlined key="info" @click="handleView(filterInfo['filterId'])" />
                </a-tooltip>
                <a-tooltip placement="bottom" title="编辑" @click="handleEdit(filterInfo)">
                  <EditOutlined key="edit" style="color: #1890ff" />
                </a-tooltip>
                <a-tooltip
                  placement="bottom"
                  title="删除"
                  @click="handleDelete(filterInfo['filterId'])"
                >
                  <DeleteOutlined key="delete" style="color: #ff7875" />
                </a-tooltip>
              </template>
              <div style="display: flex; flex-direction: column; justify-content: space-between">
                <div>
                  <a-form :layout="'vertical'" :label-col="{ span: 24 }">
                    <a-form-item
                      :label="filterInfo['filterType'] == 'Blacklist' ? '黑名单:' : '白名单:'"
                      v-if="
                        filterInfo['specialUrlInfos'] && filterInfo['specialUrlInfos'].length > 0
                      "
                    >
                      <div style="display: flex; flex-wrap: wrap">
                        <Popover
                          placement="bottomRight"
                          v-for="urlInfo in filterInfo['specialUrlInfos']"
                          :key="urlInfo['routeSpecialId']"
                        >
                          <template #content>
                            <div>{{ urlInfo.url || '---' }}</div>
                          </template>
                          <a-tag
                            v-if="urlInfo.urlName && urlInfo.urlName.length > 4"
                            :color="
                              filterInfo['filterType'] !== 'Blacklist' ? 'processing' : 'warning'
                            "
                            class="white-list-content"
                          >
                            {{ `${urlInfo.urlName.slice(0, 4)}...` }}
                          </a-tag>
                          <a-tag
                            v-else
                            :color="
                              filterInfo['filterType'] !== 'Blacklist' ? 'processing' : 'warning'
                            "
                            class="white-list-content"
                          >
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
                            handleChangeStatus(filterInfo['filterId'], filterInfo['filterStatus'])
                          "
                          size="small"
                          v-model:value="filterInfo['filterStatus']"
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
    <ServiceFilterModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { InfoCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import { Popover } from 'ant-design-vue';
  import { useRoute, useRouter } from 'vue-router';
  import ServiceFilterModal from './ServiceFilterModal.vue';
  import { ref, reactive, onMounted } from 'vue';
  import { getListByConstantTypes } from '/@/api/modules/system/common/commonConstant';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useModal } from '/@/components/Modal';
  import { PageWrapper } from '/@/components/Page';
  import { ManageServiceFilterUrlDto } from '/@/api/modules/system/manage/model/manageServiceModel';
  import { selectServiceFilterInfo } from '/@/api/modules/system/manage/manageService';
  import { updateStatus, deleteById } from '/@/api/modules/system/manage/manageRouteFilter';
  import { useDesign } from '/@/hooks/web/useDesign';
  const [registerModal, { openModal }] = useModal();
  const { prefixCls } = useDesign('service-filter');
  const { closeCurrent } = useTabs();
  const route = useRoute();
  const router = useRouter();
  const loading = ref(false);
  const serviceId = ref<string>(route.params?.id as string);
  const serviceFilterAndUrl = ref({} as ManageServiceFilterUrlDto);
  function goBack() {
    closeCurrent();
    router.back();
  }
  const filterTypes = reactive({
    arr: [] as any[],
  });
  const filterTypeMaps = reactive({});
  const noCreatefilterTypes = reactive({});
  async function getAllUrl() {
    loading.value = true;

    try {
      serviceFilterAndUrl.value = await selectServiceFilterInfo(serviceId.value);
      serviceFilterAndUrl.value.filterInfos.forEach((item) => {
        delete noCreatefilterTypes[item.filterType];
      });
    } finally {
      loading.value = false;
    }
  }
  function handleCreate() {
    const selectFilterTypes: any[] = [];
    filterTypes.arr.forEach((item) => {
      selectFilterTypes.push({
        value: item.type,
        label: item.typeDescribe,
        disabled: noCreatefilterTypes[item.type] ? false : true,
        urlType: item.extendInfo.specialUrlType,
      });
    });
    openModal(true, {
      isUpdate: false,
      serviceId: serviceId.value,
      filterTypes: selectFilterTypes,
    });
  }
  async function handleChangeStatus(filterId: string, state: number) {
    await updateStatus(filterId, state);
    getAllUrl();
  }
  function handleSuccess() {
    getAllUrl();
  }
  function handleView(filterId: string) {
    console.log('------handleView---------', filterId);
  }
  function handleEdit(filterInfo: any) {
    noCreatefilterTypes[filterInfo.filterType] = filterTypeMaps[filterInfo.filterType];
    const selectFilterTypes: any[] = [];
    filterTypes.arr.forEach((item) => {
      selectFilterTypes.push({
        value: item.type,
        label: item.typeDescribe,
        disabled: noCreatefilterTypes[item.type] ? false : true,
        urlType: item.extendInfo.specialUrlType,
      });
    });
    openModal(true, {
      isUpdate: true,
      serviceId: serviceId.value,
      filterId: filterInfo.filterId,
      filterTypes: selectFilterTypes,
    });
  }
  async function handleDelete(filterId: string) {
    await deleteById(filterId);
    getAllUrl();
  }
  async function getAllEnableFilterTypes() {
    filterTypes.arr = await getListByConstantTypes(
      'Gateway_FilterCustomPreType,Gateway_FilterCustomPostType'
    );
    filterTypes.arr.forEach((item) => {
      filterTypeMaps[item.type] = item.typeDescribe;
      noCreatefilterTypes[item.type] = item.typeDescribe;
    });
  }
  onMounted(() => {
    getAllEnableFilterTypes();
    getAllUrl();
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-service-filter';
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
        margin-bottom: 5px;
      }
    }
  }
</style>
