<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    width="45%"
  >
    <div>
      <a-form :label-col="labelCol" :model="filterInfos" ref="formRef">
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="过滤器类型"
              name="filterType"
              :rules="[
                {
                  required: true,
                  message: '请选择过滤器类型',
                  trigger: ['change', 'blur'],
                },
              ]"
            >
              <a-select
                placeholder="请选择类型"
                v-model:value="filterInfos['filterType']"
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                @change="handleFilterTypeChange"
                style="width: 100%"
                :options="selectFilterTypes"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="filter状态"
              name="filterStatus"
              :rules="[
                {
                  required: true,
                  message: '请选择filter状态',
                },
              ]"
            >
              <a-radio-group v-model:value="filterInfos['filterStatus']" button-style="solid">
                <a-radio-button value="0">禁用</a-radio-button>
                <a-radio-button value="1">启用</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="enableUrlType !== 0">
            <a-form-item
              label="是否有特殊url"
              name="haveSpecial"
              :rules="[
                {
                  required: true,
                  message: '请判断是否有特殊url',
                },
              ]"
            >
              <a-radio-group
                v-model:value="filterInfos['haveSpecial']"
                button-style="solid"
                @change="handleHaveSpecialChange"
              >
                <a-radio-button value="0">没有</a-radio-button>
                <a-radio-button value="1">有</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="filterInfos['haveSpecial'] == 1 && enableUrlType !== 0">
            <a-form-item
              label="特殊url类型"
              name="specialUrlType"
              :rules="[
                {
                  required: filterUrls && Object.keys(filterUrls).length > 0,
                  message: '请选择特殊url类型',
                },
              ]"
            >
              <a-radio-group v-model:value="filterInfos['specialUrlType']">
                <a-radio value="1" :disalbed="enableUrlType === 2">白名单</a-radio>
                <a-radio value="2" :disalbed="enableUrlType === 1">黑名单</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="备注" name="remark">
              <a-textarea
                v-model:value="filterInfos['remark']"
                allowClear
                placeholder="请输入版本标签"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-divider
      dashed
      style="border-color: #7cb305"
      v-if="filterInfos['haveSpecial'] == 1 && enableUrlType !== 0"
      >特殊url</a-divider
    >
    <div style="margin: 0 10px" v-if="filterInfos['haveSpecial'] == 1 && enableUrlType !== 0">
      <div
        style="display: flex; flex-wrap: wrap; margin-left: 8px"
        v-if="filterUrls && Object.keys(filterUrls).length > 0"
      >
        <Popover placement="bottomRight" v-for="item in Object.keys(filterUrls)" :key="item">
          <template #content>
            <div>{{ filterUrls[item]['url'] || '---' }}</div>
          </template>
          <a-tag
            v-if="filterUrls[item]['urlName'].length > 4"
            :color="filterUrls[item]['specialType'] == 1 ? 'processing' : 'warning'"
            closable
            style="margin-bottom: 8px; cursor: pointer"
            @close="handleRemoveUrl(item)"
            @click="handleEditUrl(filterUrls[item])"
          >
            {{ `${filterUrls[item]['urlName'].slice(0, 4)}...` }}
          </a-tag>
          <a-tag
            v-else
            closable
            style="margin-bottom: 8px; cursor: pointer"
            @close="handleRemoveUrl(item)"
            @click="handleEditUrl(filterUrls[item])"
            :color="filterUrls[item]['specialType'] == 1 ? 'processing' : 'warning'"
            :title="filterUrls[item]['urlName'] || '--'"
          >
            {{ filterUrls[item]['urlName'] || '--' }}
          </a-tag>
        </Popover>
      </div>
      <div v-else>
        <a-empty />
      </div>
      <a-button block class="mt-5" type="dashed" @click="handelAddUrl"> 新增url </a-button>
    </div>
    <SpecialUrlModal @register="registerUrlModal" @success="handleAddUrlSeccess" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { Popover } from 'ant-design-vue';
  import { ref, computed, unref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getById, insert, update } from '/@/api/modules/system/manage/manageRouteFilter';
  import { useModal } from '/@/components/Modal';
  import SpecialUrlModal from './SpecialUrlModal.vue';
  const [registerUrlModal, { openModal: openUrlModal }] = useModal();
  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const formRef = ref();
  const selectFilterTypes = ref<any[]>([]);
  const selectFilterTypeMap = reactive({});
  const enableUrlType = ref(0);
  const serviceId = ref('');
  const labelCol = reactive({ span: 8 });
  const filterInfos = ref({});
  const filterId = ref('');
  const filterUrls = ref({});
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    formRef.value.resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    console.log('------data--------', data);
    selectFilterTypes.value = data.filterTypes || [];
    selectFilterTypes.value.forEach((item) => {
      selectFilterTypeMap[item.value] = item;
    });
    serviceId.value = data.serviceId;
    if (unref(isUpdate)) {
      filterId.value = data.filterId;
      const detailData = await getById(filterId.value);
      filterInfos.value = { ...detailData };
      if (filterInfos.value['filterStatus']) {
        filterInfos.value['filterStatus'] = filterInfos.value['filterStatus'] + '';
      }
      if (filterInfos.value['haveSpecial']) {
        filterInfos.value['haveSpecial'] = filterInfos.value['haveSpecial'] + '';
      }
      if (filterInfos.value['specialUrlType']) {
        filterInfos.value['specialUrlType'] = filterInfos.value['specialUrlType'] + '';
      }
      handleFilterTypeChange(filterInfos.value['filterType']);
      if (detailData.specialUrlInfos && detailData.specialUrlInfos.length > 0) {
        detailData.specialUrlInfos.forEach((item) => {
          filterUrls.value[item.routeSpecialId] = item;
        });
      }

      console.log('-------unref-----', unref(filterUrls.value));
    }
    console.log('------data---serviceId-----', serviceId.value);
    console.log('------data-----filterId---', filterId.value);
  });
  const getTitle = computed(() => (!unref(isUpdate) ? '新增过滤器' : '编辑过滤器'));
  function handelAddUrl() {
    openUrlModal(true, {
      isUpdate: false,
    });
  }
  function handleFilterTypeChange(value) {
    enableUrlType.value = selectFilterTypeMap[value].urlType || 0;
  }
  function handleHaveSpecialChange(value) {
    console.log('--------------0-----', value);
    if (value.target.value == 0) {
      filterUrls.value = {};
    }
  }
  function handleAddUrlSeccess({ isUpdate, values }) {
    if (!isUpdate) {
      values['routeSpecialId'] = Date.now();
    }
    filterUrls.value[values['routeSpecialId']] = values;
  }
  function handleRemoveUrl(routeSpecialId: string) {
    delete filterUrls.value[routeSpecialId];
  }
  function handleEditUrl(item: any) {
    openUrlModal(true, {
      isUpdate: true,
      data: item,
    });
  }
  async function handleSubmit() {
    try {
      const values = await unref(formRef).validate();
      if (!values) return;
      values['serviceId'] = serviceId.value;
      values['businessId'] = serviceId.value;
      const specialUrlVoList: any[] = [];
      if (filterUrls.value && Object.keys(filterUrls.value).length > 0) {
        for (const key in filterUrls.value) {
          specialUrlVoList.push(filterUrls.value[key]);
        }
      }
      values['specialUrlVoList'] = specialUrlVoList;
      console.log('------values--------', values);
      setModalProps({ confirmLoading: true });
      try {
        if (unref(isUpdate)) {
          await update(values, filterId.value);
        } else {
          await insert(values);
        }
      } catch (error) {
        console.warn(error);
        return;
      }
      closeModal();
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
