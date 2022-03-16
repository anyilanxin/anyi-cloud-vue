<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    width="47%"
  >
    <BasicForm @register="registerForm" style="padding-right: 10px" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { accountFormSchema } from './user.data';
  import { update, insert, getById } from '/@/api/modules/auth/rbac/rbacUser';

  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const userId = ref('');
  const [registerForm, { setFieldsValue, resetFields, validate, updateSchema }] = useForm({
    labelWidth: 100,
    schemas: accountFormSchema,
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  });
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    isUpdate.value = !!data?.isUpdate;
    resetFields();
    setModalProps({ confirmLoading: false });
    if (unref(isUpdate)) {
      userId.value = data.userId;
      const detailData = await getById(userId.value);
      if (!detailData.roleIds || detailData.roleIds.length == 0) {
        detailData.roleIds = [];
      }
      if (!detailData.positionIds || detailData.positionIds.length == 0) {
        detailData.positionIds = [];
      }
      setFieldsValue({
        ...detailData,
      });
    }
    updateSchema([
      {
        field: 'password',
        ifShow: !unref(isUpdate),
      },
    ]);
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增用户' : '编辑用户'));

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      try {
        if (unref(isUpdate)) {
          await update(values, userId.value);
        } else {
          await insert(values);
        }
      } catch (error) {
        console.warn(error);
        return;
      }
      closeModal();
      emit('success', {
        isUpdate: unref(isUpdate),
        values: { ...values, userId: userId.value },
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
