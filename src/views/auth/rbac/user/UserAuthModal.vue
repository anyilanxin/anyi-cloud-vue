<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="分配角色"
    @ok="handleSubmit"
    width="40%"
  >
    <a-divider style="border-color: #e4e4e7; font-weight: 400; font-size: 13px" dashed
      >基本信息</a-divider
    >
    <Description @register="registerUserInfo" :column="2" class="ml-16" :data="userData" />
    <a-divider style="border-color: #e4e4e7; font-weight: 400; font-size: 13px" dashed
      >角色信息</a-divider
    >
    <BasicForm @register="registerForm" style="padding-right: 13px" @submit="handleSubmit">
      <template #roleIds>
        <Transfer
          :data-source="dataSource"
          :titles="['未授角色', '已授角色']"
          :target-keys="targetKeys"
          :render="(item) => item.title"
          @change="handleChange"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, useComponentRegister } from '/@/components/Form/index';
  import { userAuth, getById } from '/@/api/modules/auth/rbac/rbacUser';
  import { RbacUserDto } from '/@/api/modules/auth/rbac/model/rbacUserModel';
  import { Description, useDescription } from '/@/components/Description/index';
  import { Transfer } from 'ant-design-vue';
  import { getEffectiveRoles } from '/@/api/modules/auth/rbac/rbacRole';
  import { schemaDetail } from './user.data';
  useComponentRegister('Transfer', Transfer);
  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const userId = ref('');
  const targetKeys = ref<string[]>([]);
  const dataSource = ref<any[]>([]);
  const userData = ref<RbacUserDto>();
  const handleChange = (nextTargetKeys) => {
    targetKeys.value = nextTargetKeys;
  };
  const [registerForm, { resetFields }] = useForm({
    labelWidth: 100,
    schemas: [
      {
        field: 'roleIds',
        label: ' ',
        slot: 'roleIds',
        component: 'Transfer',
      },
    ],
    showActionButtonGroup: false,
    baseColProps: { lg: 24, md: 24 },
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    if (unref(isUpdate)) {
      userId.value = data.userId;
      const detailData = await getById(userId.value);
      const roleData = await getEffectiveRoles();
      const roleDataInfo: any[] = [];
      if (roleData) {
        roleData.forEach((item) => {
          const nowItem = {
            key: item.roleId,
            title: item.roleName,
            ...item,
          };
          roleDataInfo.push(nowItem);
        });
        dataSource.value = roleDataInfo;
      }
      userData.value = detailData;
      if (detailData.roleIds) {
        targetKeys.value = detailData.roleIds;
      }
    }
  });

  async function handleSubmit() {
    try {
      const data = {
        correlateId: userId.value,
        correlateType: 3,
        roleIds: targetKeys.value,
      };
      setModalProps({ confirmLoading: true });
      try {
        await userAuth(data);
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

  const [registerUserInfo] = useDescription({
    title: '',
    bordered: false,
    schema: schemaDetail,
  });
</script>
