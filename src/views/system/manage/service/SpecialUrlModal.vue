<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    width="38%"
  >
    <BasicForm @register="registerForm" style="padding-right: 10px">
      <template #requestMethod="{ model, field }">
        <a-select
          v-model:value="model[field]"
          placeholder="请选择请求方式"
          style="width: 100%"
          mode="multiple"
          :options="requestMethods"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { systemFormSchema } from './service.data';
  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 110,
    schemas: systemFormSchema,
    showActionButtonGroup: false,
  });
  const requestMethods = reactive([
    { label: 'GET', value: 'GET' },
    { label: 'PUT', value: 'PUT' },
    { label: 'DELETE', value: 'DELETE' },
    { label: 'POST', value: 'POST' },
  ]);
  const urlData = ref({});
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      urlData.value = data.data;
      if (urlData.value['requestMethod']) {
        urlData.value['requestMethod'] = urlData.value['requestMethod'].split(',');
      } else {
        urlData.value['requestMethod'] = [];
      }
      setFieldsValue({
        ...urlData.value,
      });
    }
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增url' : '编辑url'));

  async function handleSubmit() {
    const values = await validate();
    values['routeSpecialId'] = urlData.value['routeSpecialId'];
    closeModal();
    const newValue = { ...values };
    if (newValue['requestMethod']) {
      newValue['requestMethod'] = newValue['requestMethod'].toString();
    }
    emit('success', {
      isUpdate: unref(isUpdate),
      values: { ...newValue },
    });
  }
</script>
