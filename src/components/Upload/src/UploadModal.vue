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
    width="800px"
    :title="t('component.upload.upload')"
    :okText="t('component.upload.save')"
    v-bind="$attrs"
    @register="register"
    @ok="handleOk"
    :closeFunc="handleCloseFunc"
    :maskClosable="false"
    :keyboard="false"
    class="upload-modal"
    :okButtonProps="getOkButtonProps"
    :cancelButtonProps="{ disabled: isUploadingRef }"
  >
    <template #centerFooter>
      <a-button
        @click="handleStartUpload"
        color="success"
        :disabled="!getIsSelectFile"
        :loading="isUploadingRef"
      >
        {{ getUploadBtnText }}
      </a-button>
    </template>

    <div class="upload-modal-toolbar">
      <Alert :message="getHelpText" type="info" banner class="upload-modal-toolbar__text" />

      <Upload
        :accept="getStringAccept"
        :multiple="multiple"
        :before-upload="beforeUpload"
        :show-upload-list="false"
        class="upload-modal-toolbar__btn"
      >
        <a-button type="primary">
          {{ t('component.upload.choose') }}
        </a-button>
      </Upload>
    </div>
    <FileList :dataSource="fileListRef" :columns="columns" :actionColumn="actionColumn" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, toRefs, unref, computed, PropType } from 'vue';
  import { Upload, Alert } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  //   import { BasicTable, useTable } from '/@/components/Table';
  // hooks
  import { useUploadType } from './useUpload';
  import { useMessage } from '/@/hooks/web/useMessage';
  //   types
  import { FileItem, UploadResultStatus } from './typing';
  import { basicProps } from './props';
  import { createTableColumns, createActionColumn } from './data';
  // utils
  import { checkImgType, getBase64WithFile } from './helper';
  import { buildUUID } from '/@/utils/uuid';
  import { isFunction } from '/@/utils/is';
  import { warn } from '/@/utils/log';
  import FileList from './FileList.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  export default defineComponent({
    components: { BasicModal, Upload, Alert, FileList },
    props: {
      ...basicProps,
      previewFileList: {
        type: Array as PropType<string[]>,
        default: () => [],
      },
    },
    emits: ['change', 'register', 'delete'],
    setup(props, { emit }) {
      const state = reactive<{ fileList: FileItem[] }>({
        fileList: [],
      });

      //   是否正在上传
      const isUploadingRef = ref(false);
      const fileListRef = ref<FileItem[]>([]);
      const { accept, helpText, maxNumber, maxSize } = toRefs(props);

      const { t } = useI18n();
      const [register, { closeModal }] = useModalInner();

      const { getStringAccept, getHelpText } = useUploadType({
        acceptRef: accept,
        helpTextRef: helpText,
        maxNumberRef: maxNumber,
        maxSizeRef: maxSize,
      });

      const { createMessage } = useMessage();

      const getIsSelectFile = computed(() => {
        return (
          fileListRef.value.length > 0 &&
          !fileListRef.value.every((item) => item.status === UploadResultStatus.SUCCESS)
        );
      });

      const getOkButtonProps = computed(() => {
        const someSuccess = fileListRef.value.some(
          (item) => item.status === UploadResultStatus.SUCCESS,
        );
        return {
          disabled: isUploadingRef.value || fileListRef.value.length === 0 || !someSuccess,
        };
      });

      const getUploadBtnText = computed(() => {
        const someError = fileListRef.value.some(
          (item) => item.status === UploadResultStatus.ERROR,
        );
        return isUploadingRef.value
          ? t('component.upload.uploading')
          : someError
          ? t('component.upload.reUploadFailed')
          : t('component.upload.startUpload');
      });

      // 上传前校验
      function beforeUpload(file: File) {
        const { size, name } = file;
        const { maxSize } = props;
        // 设置最大值，则判断
        if (maxSize && file.size / 1024 / 1024 >= maxSize) {
          createMessage.error(t('component.upload.maxSizeMultiple', [maxSize]));
          return false;
        }

        const commonItem = {
          uuid: buildUUID(),
          file,
          size,
          name,
          percent: 0,
          type: name.split('.').pop(),
        };
        // 生成图片缩略图
        if (checkImgType(file)) {
          // beforeUpload，如果异步会调用自带上传方法
          // file.thumbUrl = await getBase64(file);
          getBase64WithFile(file).then(({ result: thumbUrl }) => {
            fileListRef.value = [
              ...unref(fileListRef),
              {
                thumbUrl,
                ...commonItem,
              },
            ];
          });
        } else {
          fileListRef.value = [...unref(fileListRef), commonItem];
        }
        return false;
      }

      // 删除
      function handleRemove(record: FileItem) {
        const index = fileListRef.value.findIndex((item) => item.uuid === record.uuid);
        index !== -1 && fileListRef.value.splice(index, 1);
        emit('delete', record);
      }

      // 预览
      // function handlePreview(record: FileItem) {
      //   const { thumbUrl = '' } = record;
      //   createImgPreview({
      //     imageList: [thumbUrl],
      //   });
      // }

      async function uploadApiByItem(item: FileItem) {
        const { api } = props;
        if (!api || !isFunction(api)) {
          return warn('upload api must exist and be a function');
        }
        try {
          item.status = UploadResultStatus.UPLOADING;
          const { data } = await props.api?.(
            {
              data: {
                ...(props.uploadParams || {}),
              },
              file: item.file,
              name: props.name,
              filename: props.filename,
            },
            function onUploadProgress(progressEvent: ProgressEvent) {
              const complete = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
              item.percent = complete;
            },
          );
          item.status = UploadResultStatus.SUCCESS;
          item.responseData = data;
          return {
            success: true,
            error: null,
          };
        } catch (e) {
          console.log(e);
          item.status = UploadResultStatus.ERROR;
          return {
            success: false,
            error: e,
          };
        }
      }

      // 点击开始上传
      async function handleStartUpload() {
        const { maxNumber } = props;
        if ((fileListRef.value.length + props.previewFileList?.length ?? 0) > maxNumber) {
          return createMessage.warning(t('component.upload.maxNumber', [maxNumber]));
        }
        try {
          isUploadingRef.value = true;
          // 只上传不是成功状态的
          const uploadFileList =
            fileListRef.value.filter((item) => item.status !== UploadResultStatus.SUCCESS) || [];
          const data = await Promise.all(
            uploadFileList.map((item) => {
              return uploadApiByItem(item);
            }),
          );
          isUploadingRef.value = false;
          // 生产环境:抛出错误
          const errorList = data.filter((item: any) => !item.success);
          if (errorList.length > 0) throw errorList;
        } catch (e) {
          isUploadingRef.value = false;
          throw e;
        }
      }

      //   点击保存
      function handleOk() {
        const { maxNumber } = props;

        if (fileListRef.value.length > maxNumber) {
          return createMessage.warning(t('component.upload.maxNumber', [maxNumber]));
        }
        if (isUploadingRef.value) {
          return createMessage.warning(t('component.upload.saveWarn'));
        }
        const fileList: string[] = [];

        for (const item of fileListRef.value) {
          const { status, responseData } = item;
          if (status === UploadResultStatus.SUCCESS && responseData) {
            fileList.push(responseData.url);
          }
        }
        // 存在一个上传成功的即可保存
        if (fileList.length <= 0) {
          return createMessage.warning(t('component.upload.saveError'));
        }
        fileListRef.value = [];
        closeModal();
        emit('change', fileList);
      }

      // 点击关闭：则所有操作不保存，包括上传的
      async function handleCloseFunc() {
        if (!isUploadingRef.value) {
          fileListRef.value = [];
          return true;
        } else {
          createMessage.warning(t('component.upload.uploadWait'));
          return false;
        }
      }

      return {
        columns: createTableColumns() as any[],
        actionColumn: createActionColumn(handleRemove) as any,
        register,
        closeModal,
        getHelpText,
        getStringAccept,
        getOkButtonProps,
        beforeUpload,
        // registerTable,
        fileListRef,
        state,
        isUploadingRef,
        handleStartUpload,
        handleOk,
        handleCloseFunc,
        getIsSelectFile,
        getUploadBtnText,
        t,
      };
    },
  });
</script>
<style lang="less">
  .upload-modal {
    .ant-upload-list {
      display: none;
    }

    .ant-table-wrapper .ant-spin-nested-loading {
      padding: 0;
    }

    &-toolbar {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      &__btn {
        margin-left: 8px;
        text-align: right;
        flex: 1;
      }
    }
  }
</style>
