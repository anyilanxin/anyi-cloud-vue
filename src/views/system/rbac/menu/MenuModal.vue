<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    destroyOnClose
    :title="getTitle"
    @ok="handleSubmit"
    width="47%"
    :min-height="370"
  >
    <BasicForm @register="registerForm" style="padding-right: 20px">
      <template #buttonExpress="{ model, field }">
        <a-textarea v-model:value="model[field]" placeholder="请输入鉴权SpEl表达式" allowClear />
        <div style="margin-top: 5px">
          常见表达式：
          <a-tag
            style="cursor: pointer; margin-right: 8px"
            @click="handleAddExpression('hasRole()')"
            >拥有角色</a-tag
          >
          <a-tag
            color="warning"
            style="cursor: pointer; margin-right: 8px"
            @click="handleAddExpression('hasAnyRole()')"
            >拥有任意一个角色</a-tag
          >
          <a-tag
            color="success"
            style="cursor: pointer; margin-right: 8px"
            @click="handleAddExpression('hasAuthority()')"
            >拥有权限</a-tag
          >
          <a-tag
            color="processing"
            style="cursor: pointer"
            @click="handleAddExpression('hasAnyAuthority()')"
            >拥有任意一个权限</a-tag
          >
        </div>
        <div style="margin-top: 5px">
          常见鉴权：
          <a-tag
            style="cursor: pointer; margin-right: 8px"
            @click="handleAddExpression('permitAll()')"
            >所有放行</a-tag
          >
          <a-tag
            color="warning"
            style="cursor: pointer; margin-right: 8px"
            @click="handleAddExpression('denyAll()')"
            >所有都拒绝</a-tag
          >
          <a-tag
            color="success"
            style="cursor: pointer; margin-right: 8px"
            @click="handleAddExpression('isAnonymous()')"
            >匿名可访问</a-tag
          >
          <a-tag
            color="processing"
            style="cursor: pointer"
            @click="handleAddExpression('isAuthenticated()')"
            >授权可访问</a-tag
          >
        </div>
        <div style="margin-top: 5px">
          常见规则：
          <a-tag style="cursor: pointer; margin-right: 8px" @click="handleAddExpression(' && ')"
            >并且</a-tag
          >
          <a-tag
            color="warning"
            style="cursor: pointer; margin-right: 8px"
            @click="handleAddExpression(' || ')"
            >或</a-tag
          >
        </div>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { createFormSchemas } from './menu.data';
  import { getMenuTree, getById, insert, update } from '/@/api/modules/system/rbac/rbacMenu';
  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(false);
  const menuId = ref('');
  const systemId = ref('');
  const apiGetMenuTree = (params: {
    menuType: string | undefined;
    status: number | undefined;
    systemId: string;
  }) => {
    return getMenuTree(params.menuType as string, params.systemId, params.status);
  };
  const [registerForm, { setFieldsValue, resetFields, validate, getFieldsValue }] = useForm({
    labelWidth: 120,
    schemas: createFormSchemas(apiGetMenuTree, isUpdate, systemId),
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  });
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    systemId.value = data?.systemId;
    menuId.value = data?.menuId;
    if (unref(isUpdate)) {
      const detailData = await getById(menuId.value);
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
      setModalProps({ confirmLoading: true });
      try {
        if (unref(isUpdate)) {
          await update(values, menuId.value);
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
        values: { ...values, menuId: menuId.value },
      });
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
  function handleAddExpression(value: string) {
    const modelInfo = getFieldsValue();
    if (!modelInfo.buttonExpress) {
      modelInfo.buttonExpress = '';
    }
    modelInfo.buttonExpress += value;
    setFieldsValue({
      ...modelInfo,
    });
  }
</script>
