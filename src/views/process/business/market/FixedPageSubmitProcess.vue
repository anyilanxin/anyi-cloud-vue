<!--
 * Copyright (c) 2021-2023 ZHOUXUANHONG(安一老厨)<anyilanxin@aliyun.com>
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
 *   1.请不要删除和修改根目录下的LICENSE文件；
 *   2.请不要删除和修改 AnYi Cloud Vue 源码头部的版权声明；
 *   3.请保留源码和相关描述文件的项目出处，作者声明等；
 *   4.分发源码时候，请注明软件出处 https://github.com/anyilanxin/anyi-cloud；
 *   5.在修改包名，模块名称，项目代码等时，请注明软件出处 https://github.com/anyilanxin/anyi-cloud；
 *   6.本软件不允许在国家法律规定范围外使用，如出现违法行为原作者本人不承担任何法律风险；
 *   7.进行商用时，不得基于AnYi Cloud Vue的基础，修改包装而成一个与AnYi Zeebe EE、AnYi Cloud EE功能类似的程序，进行销售或发布，参与同类软件产品市场的竞争；
 *   8.本软件使用的第三方依赖皆为开源软件，如需要修改第三方源码请遵循第三方源码附带开源协议；
 *   9.本软件流程部分请遵循camunda开源协议：
 *     https://docs.camunda.org/manual/latest/introduction/third-party-libraries
 *     https://github.com/camunda/camunda-bpm-platform/blob/master/LICENSE
 *   10.若您的项目无法满足以上几点，可申请商业授权。
 -->
<template>
  <PageWrapper @back="goBack" :title="data.title || '提交流程'" contentFullHeight>
    <a-card style="width: 100%; min-height: 73vh">
      <a-tabs v-model:activeKey="activeKey" @change="handleChangeTag">
        <a-tab-pane key="form" tab="基本信息" />
        <a-tab-pane key="attachment" tab="附件" />
        <a-tab-pane key="diagram" tab="流程图" />
        <template #tabBarExtraContent>
          <a-button
            type="primary"
            @click="handleSubmit"
            :loading="data.loading"
            :preIcon="data.loading ? '' : 'ant-design:thunderbolt-outlined'"
            >提交</a-button
          >
        </template>
      </a-tabs>
      <div v-show="activeKey == 'form'"> 表单 </div>
      <div v-show="activeKey == 'attachment'" class="submit-attachment">
        <Form :model="attachmentInfo" v-bind="layout">
          <FormItem name="remark" label="附件内容说明">
            <Textarea v-model:value="attachmentInfo.remark" />
          </FormItem>
          <FormItem name="attachments" label="附件信息">
            <Upload
              :action="getUploadAction()"
              v-model:file-list="attachmentInfo.attachments"
              :headers="getUploadHeaders()"
              @change="handleChange"
              name="file"
            >
              <a-button>
                <UploadOutlined />
                点击选择附件上传
              </a-button>
            </Upload>
          </FormItem>
        </Form>
      </div>
      <div v-show="activeKey == 'diagram'">
        <SkillFullBpmnPreview ref="bpmnPreviewDomRef" :high-margin="370" />
      </div>
    </a-card>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { Form, FormItem, Upload, Input } from 'ant-design-vue';
  import { UploadOutlined } from '@ant-design/icons-vue';
  import { PageWrapper } from '/@/components/Page';
  import { message } from 'ant-design-vue';
  import { SkillFullBpmnPreview } from 'skillfull-process-pro-antvue';
  import { ref, reactive, nextTick, onMounted } from 'vue';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { getUploadAction, getUploadHeaders } from '/@/api/modules/storage/storageInfoFile';
  import { getDeploymentDetail } from '/@/api/modules/process/manage/definitionManage';
  import { submitProcess } from '/@/api/modules/process/business/processBusiness';
  import { useRoute, useRouter } from 'vue-router';
  import type { UploadChangeParam } from 'ant-design-vue';
  const route = useRoute();
  const Textarea = Input.TextArea;
  const bpmnPreviewDomRef = ref();
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };
  const router = useRouter();
  const { closeCurrent } = useTabs();
  const activeKey = ref('form');
  const params = reactive(route.query as any);
  const data = reactive({
    title: '提交流程',
    diagramData: '',
    loading: false,
  });
  const formData = reactive({});
  const attachmentInfo = reactive({
    remark: '',
    attachments: [] as any[],
  });
  function goBack() {
    closeCurrent();
    router.back();
  }
  async function handleInitData() {
    const diagramInfo = await getDeploymentDetail(params.processDefinitionKey);
    data.title = '提交' + diagramInfo.deploymentName + '申请';
    data.diagramData = diagramInfo.diagramData;
  }
  function handleChangeTag(key: string) {
    activeKey.value = key;
    if (key == 'diagram') {
      nextTick(() => {
        bpmnPreviewDomRef.value.viewBase64Bpmn(data.diagramData);
      });
    }
  }
  async function handleSubmit() {
    try {
      data.loading = true;
      const submitData = {
        processDefinitionKey: params.processDefinitionKey,
        requireCallback: false,
      };
      if (attachmentInfo.attachments.length > 0) {
        const attachments: any[] = [];
        attachmentInfo.attachments.forEach((item) => {
          if (item.response) {
            attachments.push(item.response.data);
          }
        });
        const attachmentData = {
          remark: attachmentInfo.remark,
          attachments: attachments,
        };
        submitData['attachmentInfo'] = attachmentData;
      }
      await submitProcess(submitData);
      goBack();
    } finally {
      data.loading = false;
    }
  }
  function handleChange(info: UploadChangeParam) {
    if (info.file.status === 'done') {
      const response = info.file?.response;
      if (response && response.success) {
        message.success(`${info.file.name} 文件上传成功`);
      } else {
        message.error(`${info.file.name} 文件上传失败:${response.message}`);
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.${info.file?.response.message}`);
    }
  }
  onMounted(() => {
    handleInitData();
  });
</script>

<style lang="less">
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
  @import 'bpmn-js/dist/assets/bpmn-js.css';
  @import 'bpmn-js/dist/assets/diagram-js.css';
  @import 'diagram-js-minimap/assets/diagram-js-minimap.css';

  .skillfull-bpmn-preview {
    background-color: @component-background !important;
  }

  .skillfull-bpmn-preview-content-diagram {
    overflow-y: hidden !important;
  }

  .submit-attachment {
    margin-top: 20px;
  }
</style>
