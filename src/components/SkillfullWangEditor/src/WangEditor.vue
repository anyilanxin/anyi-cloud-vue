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
  <div ref="editor" style="height: 100%"></div>
</template>

<script lang="ts" setup>
  import { getTokenInfo, getSecurityInfo } from '/@/utils/auth';
  import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
  import WangEditor from 'wangeditor';
  import { useGlobSetting } from '/@/hooks/setting';
  import { SysUrlPrefix } from '/@/api/sysPrefix';
  import { buildLongUUID } from '/@/utils/uuid';
  let instance: WangEditor | null;
  const globSetting = useGlobSetting();
  const props = defineProps({
    isClear: {
      type: Boolean,
      default: false,
    },
    // 设置该值会返回结果去掉VITE_GLOB_API_URL值，同时显示时会自动加上(只针对上传图片与视频)
    clearGlobApiUrl: {
      type: Boolean,
      default: true,
    },
    modelValue: {
      type: String,
    },
  });
  const emit = defineEmits(['update:modelValue', 'change']);
  const editor = ref();
  watch(
    () => props.isClear,
    (val) => {
      if (val) {
        if (instance) {
          instance.txt.clear();
        }
      }
    },
  );
  watch(
    () => props.modelValue,
    (val) => {
      if (instance) {
        if (val !== instance.txt.html()) {
          instance.txt.html(props.modelValue);
        }
      }
    },
  );
  onMounted(() => {
    initEdit();
    if (instance) {
      instance.txt.html(props.modelValue);
    }
  });

  function initEdit() {
    instance = new WangEditor(editor.value);
    // 图片上传设置
    instance.config.uploadImgServer =
      globSetting.apiUrl + SysUrlPrefix.STORAGE + '/local/file/upload';
    instance.config.uploadImgHeaders = getUploadHeaders();
    instance.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
    instance.config.uploadFileName = 'file';
    instance.config.uploadImgMaxSize = 10 * 1024 * 1024; // 将图片大小限制为 2M
    instance.config.uploadImgMaxLength = 3; // 限制一次最多上传 3 张图片
    instance.config.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间
    instance.config.uploadImgHooks = {
      fail: (_xhr: any, _editor: any, _result: any) => {
        // 插入图片失败回调
      },
      success: (_xhr: any, _editor: any, _result: any) => {
        // 图片上传成功回调
      },
      timeout: (_xhr: any, _editor: any) => {
        // 网络超时的回调
      },
      error: (_xhr: any, _editor: any) => {
        // 图片上传错误的回调
      },
      customInsert: (inserImg: (this: any, src: string) => void, result: any, _editor: any) => {
        let url = globSetting.apiUrl + result.data.previewPath;
        inserImg(url);
      },
    };
    // 视频上传设置
    instance.config.uploadImgTimeout = 180000;
    instance.config.uploadVideoAccept = ['mp4'];
    instance.config.uploadVideoHeaders = getUploadHeaders();
    instance.config.uploadVideoMaxSize = 500 * 1024 * 1024; // 将图片大小限制为 500M
    instance.config.uploadVideoName = 'file';
    instance.config.uploadVideoServer =
      globSetting.apiUrl + SysUrlPrefix.STORAGE + '/local/file/upload';
    instance.config.uploadVideoHooks = {
      fail: (_xhr: any, _editor: any, _result: any) => {
        // 插入视频失败回调
      },
      success: (_xhr: any, _editor: any, _result: any) => {
        // 视频上传成功回调
      },
      timeout: (_xhr: any, _editor: any) => {
        // 网络超时的回调
      },
      error: (_xhr: any, _editor: any) => {
        // 视频上传错误的回调
      },
      customInsert: (inserVideo: (this: any, src: string) => void, result: any, _editor: any) => {
        let url = globSetting.apiUrl + result.data.previewPath;
        inserVideo(url);
      },
    };
    instance.config.onchange = (html: any) => {
      let value = html;
      // 将内容同步到父组件中
      emit('change', value);
      // 将内容同步到父组件中
      emit('update:modelValue', value);
    };
    instance.create();
  }
  function getUploadHeaders() {
    const token = getTokenInfo();
    const headers = {
      'X-Request-Id': buildLongUUID() + '-' + new Date().getTime(),
    };
    if (token && Object.keys(token).length > 0) {
      // jwt token
      headers[token.tokenHeaderKey] = token.tokenHeaderStartWith + token.token;
    }
    // 处理添加请求序列
    const securityInfo = getSecurityInfo();
    if (securityInfo && Object.keys(securityInfo).length > 0) {
      headers[securityInfo.serialNumberKey] = securityInfo.serialNumber;
    }
    return headers;
  }
  onBeforeUnmount(() => {
    if (instance) {
      instance.destroy();
    }
    instance = null;
  });
</script>
