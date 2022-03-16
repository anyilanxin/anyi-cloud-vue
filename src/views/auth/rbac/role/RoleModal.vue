<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" style="padding-right: 10px">
      <template #permission="{ model, field }">
        <BasicTree
          ref="asyncExpandTreeRef"
          v-model:value="model[field]"
          :treeData="treeData"
          checkStrictly
          :replaceFields="{ title: 'metaTitle', key: 'permissionId' }"
          checkable
          toolbar
          title="菜单分配"
        >
          <template #title="item">
            <span style="margin-right: 3px">
              {{ item.metaTitle }}
            </span>
            <a-tag
              v-if="item.permissionType === 2"
              :color="actionType[item.actionType].color"
              style="padding: 0 3px; line-height: 16px"
            >
              {{ permissionType[item.permissionType].text }}({{ actionType[item.actionType].text }})
            </a-tag>
            <a-tag
              v-else
              :color="permissionType[item.permissionType].color"
              style="padding: 0 3px; line-height: 16px"
            >
              {{ permissionType[item.permissionType].text }}
            </a-tag>
          </template>
        </BasicTree>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './role.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeItem } from '/@/components/Tree';
  import { getPermissionTree } from '/@/api/modules/auth/rbac/rbacPermission';
  import { getById, insert, update } from '/@/api/modules/auth/rbac/rbacRole';
  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const roleId = ref('');
  const treeData = ref<TreeItem[]>([]);
  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 90,
    schemas: formSchema,
    showActionButtonGroup: false,
  });
  const asyncExpandTreeRef = ref();
  const permissionType = {
    0: {
      text: '目录',
      color: 'blue',
    },
    1: {
      text: '菜单',
      color: 'cyan',
    },
    2: {
      text: '按钮',
      color: 'green',
    },
  };
  const actionType = {
    1: {
      text: '前端',
      color: 'green',
    },
    2: {
      text: '后端',
      color: 'orange',
    },
    3: {
      text: '通用',
      color: 'red',
    },
  };
  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
    if (treeData.value.length === 0) {
      treeData.value = (await getPermissionTree(2, '', 1)) as any as TreeItem[];
    }
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      roleId.value = data.roleId;
      const record = await getById(roleId.value);
      setFieldsValue({
        ...record,
      });
      // 默认展开一级
      // nextTick(() => {
      //   unref(asyncExpandTreeRef)?.filterByLevel(1);
      // });
    }
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'));
  async function handleSubmit() {
    try {
      const values = await validate();
      if (values.permissionIds && 'checked' in values.permissionIds) {
        const permissionIds = values.permissionIds.checked;
        values.permissionIds = permissionIds;
      }
      setDrawerProps({ confirmLoading: true });
      if (isUpdate.value) {
        await update(values, roleId.value);
      } else {
        await insert(values);
      }
      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
