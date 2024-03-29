<!--
 * Copyright (c) 2023-present ZHOUXUANHONG(安一老厨)<anyilanxin@aliyun.com>
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
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    :min-height="300"
    width="45%"
  >
    <div style="padding-right: 10px">
      <a-form :label-col="labelCol" :model="routerPredicatInfo.predicatInfo" ref="formRef">
        <a-row>
          <a-col :span="12">
            <a-form-item
              label="断言名称"
              name="predicateName"
              :rules="[
                {
                  required: true,
                  message: '请输入断言名称',
                  trigger: ['change', 'blur'],
                },
              ]"
            >
              <a-input
                v-model:value="routerPredicatInfo.predicatInfo.predicateName"
                allowClear
                placeholder="请输入断言名称"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="断言类型"
              name="predicateType"
              :rules="[
                {
                  required: true,
                  message: '请选择断言类型',
                  trigger: ['change', 'blur'],
                },
              ]"
            >
              <a-select
                style="width: 100%"
                placeholder="请选择断言类型"
                :getPopupContainer="(triggerNode) => triggerNode.parentNode"
                @change="handlePredicateChange"
                v-model:value="routerPredicatInfo.predicatInfo.predicateType"
                :options="
                  routerPredicatInfo.predicateSysTypess.map((item) => ({
                    value: item.type,
                    label: item.typeDescribe,
                  }))
                "
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="备注" name="remark">
              <a-textarea
                v-model:value="routerPredicatInfo.predicatInfo.remark"
                allowClear
                placeholder="请输入备注"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div>
      <a-divider dashed style="border-color: #7cb305">断言规则</a-divider>
      <BasicForm @register="registerForm" style="padding-right: 10px" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref, reactive, onMounted, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { columnJson } from './predicate.data';
  import { getListByConstantTypes } from '/@/api/modules/system/common/commonConstant';
  const emit = defineEmits(['success', 'register']);
  const labelCol = reactive({ span: 8 });
  const isUpdate = ref(true);
  const formRef = ref();
  const routerPredicatInfo = reactive({
    predicatInfo: {},
    predicateSysTypess: [],
    predicateSysTypesMap: {},
  });
  const [registerForm, { resetSchema, validateFields, resetFields, setFieldsValue }] = useForm({
    labelWidth: 130,
    schemas: [],
    showActionButtonGroup: false,
  });
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    formRef.value.resetFields();
    resetFields();
    routerPredicatInfo.predicatInfo = {};
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      routerPredicatInfo.predicatInfo = { ...data.data };
      if (routerPredicatInfo.predicatInfo.predicateType) {
        nextTick(() => {
          handlePredicateChange();
          const rules = routerPredicatInfo.predicatInfo.rules;
          if (rules) {
            setFieldsValue({
              ...rules,
            });
          }
        });
      } else {
        resetSchema([]);
      }
    } else {
      resetSchema([]);
    }
  });
  const getTitle = computed(() => (!unref(isUpdate) ? '新增断言' : '编辑断言'));
  async function handleSubmit() {
    try {
      const values = await formRef.value.validate();
      console.log('----values-----', values);
      const rules = await validateFields();
      if (!routerPredicatInfo.predicatInfo['predicateId']) {
        values['predicateId'] = Date.now();
      } else {
        values['predicateId'] = routerPredicatInfo.predicatInfo['predicateId'];
      }
      values['predicateTypeName'] =
        routerPredicatInfo.predicateSysTypesMap[values.predicateType].typeDescribe;
      values['rules'] = rules;
      closeModal();
      emit('success', {
        values,
      });
    } catch (__error) {
      try {
        await validateFields();
      } catch (__error2) {}
    }
  }
  async function getFilterTypes() {
    routerPredicatInfo.predicateSysTypess = await getListByConstantTypes(
      'gateway-service:PredicateSysType',
    );
    const predicateSysTypesMap = {};
    routerPredicatInfo.predicateSysTypess.map((item) => {
      predicateSysTypesMap[item.type] = item;
    });
    routerPredicatInfo.predicateSysTypesMap = predicateSysTypesMap;
  }
  function handlePredicateChange() {
    resetFields();
    const predicateType = routerPredicatInfo.predicatInfo.predicateType;
    if (predicateType) {
      resetSchema(columnJson[predicateType] || []);
    } else {
      resetSchema([]);
    }
  }
  onMounted(() => {
    getFilterTypes();
  });
</script>
