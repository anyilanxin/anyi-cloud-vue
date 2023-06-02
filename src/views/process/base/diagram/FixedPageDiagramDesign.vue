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
 *   7.进行商用时，不得基于AnYi Cloud Vue的基础，修改包装而成一个与AnYi Zeebe EE、AnYi Cloud EE、AnYi Cloud EE Vue功能类似的程序，进行销售或发布，参与同类软件产品市场的竞争；
 *   8.本软件使用的第三方依赖皆为开源软件，如需要修改第三方源码请遵循第三方源码附带开源协议；
 *   9.本软件中使用了bpmn js,使用请遵循bpmn.io开源协议：
 *     https://github.com/bpmn-io/bpmn-js/blob/develop/LICENSE
 *   10.若您的项目无法满足以上几点，可申请商业授权。
 -->
<template>
  <PageWrapper @back="goBack" :title="title">
    <SkillFullBpmnDesigner
      @change="handleChange"
      :high-margin="254"
      @save="handleSaveOk"
      :dataApi="apiInfo"
      ref="designer"
    />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { SkillFullBpmnDesigner } from 'skillfull-process-pro-antvue';
  import { ref, onMounted, reactive } from 'vue';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { useRoute, useRouter } from 'vue-router';
  import { getById, insert, update } from '/@/api/modules/process/base/designModel';
  import { getCategoryList } from '/@/api/modules/process/base/processCategory';
  import { selectPage as selectExpressionPage } from '/@/api/modules/process/base/designExpression';
  import { selectPage as selectRolePage } from '/@/api/modules/system/rbac/rbacRole';
  import { selectPage as selectUserPage } from '/@/api/modules/system/rbac/rbacUser';
  import { selectOrgTreeList } from '/@/api/modules/system/rbac/rbacOrg';
  import { getById as getHistoryById } from '/@/api/modules/process/base/designModelHistory';
  const designer = ref();
  const route = useRoute();
  const title = ref('模型设计');
  const type = ref('新增模型');
  const router = useRouter();
  const { closeCurrent } = useTabs();
  const modelId = ref(route.query?.modelId as string);
  const isCopy = ref(route.query?.isCopy as string);
  const history = ref(route.query?.history as string);
  async function getCategoryData() {
    return await getCategoryList();
  }
  async function getUserPage(params: any) {
    return await selectUserPage(params);
  }
  async function getGroupPage(params: any) {
    return await selectRolePage(params);
  }
  async function getExpressionPage(params: any) {
    return await selectExpressionPage(params);
  }
  async function getOrgTree(params: any) {
    return await selectOrgTreeList(params['type']);
  }
  const apiInfo = reactive({
    categoryApi: getCategoryData,
    userApi: getUserPage,
    groupApi: getGroupPage,
    expressionApi: getExpressionPage,
    orgTreeApi: getOrgTree,
  });
  function goBack() {
    closeCurrent();
    router.back();
  }
  async function handleDetail() {
    if (modelId.value) {
      let data;
      if (!history.value) {
        data = await getById(modelId.value);
      } else {
        data = await getHistoryById(modelId.value);
      }
      type.value = '编辑模型';
      title.value = type.value + (data.diagramNames ? '(' + data.diagramNames + ')' : '');
      designer.value.openBase64Diagram(data.diagramData);
    } else {
      type.value = '新增模型';
      title.value = type.value;
      designer.value.createNewDiagram();
    }
  }
  function handleChange(processInfo: any) {
    if (processInfo) {
      title.value =
        type.value + (processInfo.diagramNames ? '(' + processInfo.diagramNames + ')' : '');
    }
  }
  async function handleSaveOk(processInfo: any) {
    try {
      if (modelId.value && !isCopy.value) {
        await update(processInfo, modelId.value);
      } else {
        await insert(processInfo);
      }
      goBack();
    } catch (e: any) {}
  }
  onMounted(() => {
    handleDetail();
  });
</script>

<style lang="less">
  @import 'bpmn-js-color-picker/colors/color-picker.css';
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
  @import 'bpmn-js/dist/assets/bpmn-js.css';
  @import 'bpmn-js/dist/assets/diagram-js.css';
  @import 'bpmn-js-properties-panel/dist/assets/properties-panel.css';
  @import 'bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css';
  @import 'diagram-js-minimap/assets/diagram-js-minimap.css';
  @import 'bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css';
</style>
