<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    width="47%"
  >
    <BasicForm @register="registerForm" style="padding-right: 20px" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { createFormSchemas } from './permission.data';
  import {
    getPermissionTree,
    getById,
    insert,
    update,
  } from '/@/api/modules/auth/rbac/rbacPermission';
  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(false);
  const permissionId = ref('');
  const systemId = ref('');
  const apiGetPermissionTree = (params: {
    permissionType: number | undefined;
    status: number | undefined;
  }) => {
    return getPermissionTree(params.permissionType, systemId.value, params.status);
  };
  const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 120,
    schemas: createFormSchemas(apiGetPermissionTree, isUpdate),
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  });
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    systemId.value = data?.systemId;
    permissionId.value = data?.permissionId;
    if (unref(isUpdate)) {
      const detailData = await getById(permissionId.value);
      if (detailData.actionMethods) {
        detailData['actionMethods'] = (detailData.actionMethods as string).split(',');
      } else {
        detailData['actionMethods'] = [];
      }
      setFieldsValue({
        ...detailData,
      });
    }
  });
  const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'));

  async function handleSubmit() {
    try {
      const values = await validate();
      values.systemId = systemId.value;
      if (values['actionMethods']) {
        values['actionMethods'] = values.actionMethods.toString();
      }
      setModalProps({ confirmLoading: true });
      try {
        if (unref(isUpdate)) {
          await update(values, permissionId.value);
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
        values: { ...values, permissionId: permissionId.value },
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
