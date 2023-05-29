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
  <div :class="prefixCls" :style="{ width: containerWidth }">
    <ImgUpload
      :fullscreen="fullscreen"
      @uploading="handleImageUploading"
      @done="handleDone"
      v-if="showImageUpload"
      v-show="editorRef"
      :disabled="disabled"
    />
    <textarea
      :id="tinymceId"
      ref="elRef"
      :style="{ visibility: 'hidden' }"
      v-if="!initOptions.inline"
    ></textarea>
    <slot v-else></slot>
  </div>
</template>

<script lang="ts">
  import type { Editor, RawEditorSettings } from 'tinymce';
  import tinymce from 'tinymce/tinymce';
  import 'tinymce/themes/silver';
  import 'tinymce/icons/default/icons';
  import 'tinymce/plugins/advlist';
  import 'tinymce/plugins/anchor';
  import 'tinymce/plugins/autolink';
  import 'tinymce/plugins/autosave';
  import 'tinymce/plugins/code';
  import 'tinymce/plugins/codesample';
  import 'tinymce/plugins/directionality';
  import 'tinymce/plugins/fullscreen';
  import 'tinymce/plugins/hr';
  import 'tinymce/plugins/insertdatetime';
  import 'tinymce/plugins/link';
  import 'tinymce/plugins/lists';
  import 'tinymce/plugins/media';
  import 'tinymce/plugins/nonbreaking';
  import 'tinymce/plugins/noneditable';
  import 'tinymce/plugins/pagebreak';
  import 'tinymce/plugins/paste';
  import 'tinymce/plugins/preview';
  import 'tinymce/plugins/print';
  import 'tinymce/plugins/save';
  import 'tinymce/plugins/searchreplace';
  import 'tinymce/plugins/spellchecker';
  import 'tinymce/plugins/tabfocus';
  // import 'tinymce/plugins/table';
  import 'tinymce/plugins/template';
  import 'tinymce/plugins/textpattern';
  import 'tinymce/plugins/visualblocks';
  import 'tinymce/plugins/visualchars';
  import 'tinymce/plugins/wordcount';

  import {
    defineComponent,
    computed,
    nextTick,
    ref,
    unref,
    watch,
    onDeactivated,
    onBeforeUnmount,
  } from 'vue';
  import ImgUpload from './ImgUpload.vue';
  import { toolbar, plugins } from './tinymce';
  import { buildShortUUID } from '/@/utils/uuid';
  import { bindHandlers } from './helper';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { isNumber } from '/@/utils/is';
  import { useLocale } from '/@/locales/useLocale';
  import { useAppStore } from '/@/store/modules/app';

  const tinymceProps = {
    options: {
      type: Object as PropType<Partial<RawEditorSettings>>,
      default: {},
    },
    value: {
      type: String,
    },

    toolbar: {
      type: Array as PropType<string[]>,
      default: toolbar,
    },
    plugins: {
      type: Array as PropType<string[]>,
      default: plugins,
    },
    modelValue: {
      type: String,
    },
    height: {
      type: [Number, String] as PropType<string | number>,
      required: false,
      default: 400,
    },
    width: {
      type: [Number, String] as PropType<string | number>,
      required: false,
      default: 'auto',
    },
    showImageUpload: {
      type: Boolean,
      default: true,
    },
  };

  export default defineComponent({
    name: 'Tinymce',
    components: { ImgUpload },
    inheritAttrs: false,
    props: tinymceProps,
    emits: ['change', 'update:modelValue', 'inited', 'init-error'],
    setup(props, { emit, attrs }) {
      const editorRef = ref<Nullable<Editor>>(null);
      const fullscreen = ref(false);
      const tinymceId = ref<string>(buildShortUUID('tiny-vue'));
      const elRef = ref<Nullable<HTMLElement>>(null);

      const { prefixCls } = useDesign('tinymce-container');

      const appStore = useAppStore();

      const tinymceContent = computed(() => props.modelValue);

      const containerWidth = computed(() => {
        const width = props.width;
        if (isNumber(width)) {
          return `${width}px`;
        }
        return width;
      });

      const skinName = computed(() => {
        return appStore.getDarkMode === 'light' ? 'oxide' : 'oxide-dark';
      });

      const langName = computed(() => {
        const lang = useLocale().getLocale.value;
        return ['zh_CN', 'en'].includes(lang) ? lang : 'zh_CN';
      });

      const initOptions = computed((): RawEditorSettings => {
        const { height, options, toolbar, plugins } = props;
        const publicPath = import.meta.env.VITE_PUBLIC_PATH || '/';
        return {
          selector: `#${unref(tinymceId)}`,
          height,
          toolbar,
          menubar: 'file edit insert view format table',
          plugins,
          language_url: publicPath + 'resource/tinymce/langs/' + langName.value + '.js',
          language: langName.value,
          branding: false,
          default_link_target: '_blank',
          link_title: false,
          object_resizing: false,
          auto_focus: true,
          skin: skinName.value,
          skin_url: publicPath + 'resource/tinymce/skins/ui/' + skinName.value,
          content_css:
            publicPath + 'resource/tinymce/skins/ui/' + skinName.value + '/content.min.css',
          ...options,
          setup: (editor: Editor) => {
            editorRef.value = editor;
            editor.on('init', (e) => initSetup(e));
          },
        };
      });

      const disabled = computed(() => {
        const { options } = props;
        const getdDisabled = options && Reflect.get(options, 'readonly');
        const editor = unref(editorRef);
        if (editor) {
          editor.setMode(getdDisabled ? 'readonly' : 'design');
        }
        return getdDisabled ?? false;
      });

      watch(
        () => attrs.disabled,
        () => {
          const editor = unref(editorRef);
          if (!editor) {
            return;
          }
          editor.setMode(attrs.disabled ? 'readonly' : 'design');
        },
      );

      onMountedOrActivated(() => {
        if (!initOptions.value.inline) {
          tinymceId.value = buildShortUUID('tiny-vue');
        }
        nextTick(() => {
          setTimeout(() => {
            initEditor();
          }, 30);
        });
      });

      onBeforeUnmount(() => {
        destory();
      });

      onDeactivated(() => {
        destory();
      });

      function destory() {
        if (tinymce !== null) {
          tinymce?.remove?.(unref(initOptions).selector!);
        }
      }

      function initEditor() {
        const el = unref(elRef);
        if (el) {
          el.style.visibility = '';
        }
        tinymce
          .init(unref(initOptions))
          .then((editor) => {
            emit('inited', editor);
          })
          .catch((err) => {
            emit('init-error', err);
          });
      }

      function initSetup(e) {
        const editor = unref(editorRef);
        if (!editor) {
          return;
        }
        const value = props.modelValue || '';

        editor.setContent(value);
        bindModelHandlers(editor);
        bindHandlers(e, attrs, unref(editorRef));
      }

      function setValue(editor: Recordable, val: string, prevVal?: string) {
        if (
          editor &&
          typeof val === 'string' &&
          val !== prevVal &&
          val !== editor.getContent({ format: attrs.outputFormat })
        ) {
          editor.setContent(val);
        }
      }

      function bindModelHandlers(editor: any) {
        const modelEvents = attrs.modelEvents ? attrs.modelEvents : null;
        const normalizedEvents = Array.isArray(modelEvents) ? modelEvents.join(' ') : modelEvents;

        watch(
          () => props.modelValue,
          (val: string, prevVal: string) => {
            setValue(editor, val, prevVal);
          },
        );

        watch(
          () => props.value,
          (val: string, prevVal: string) => {
            setValue(editor, val, prevVal);
          },
          {
            immediate: true,
          },
        );

        editor.on(normalizedEvents ? normalizedEvents : 'change keyup undo redo', () => {
          const content = editor.getContent({ format: attrs.outputFormat });
          emit('update:modelValue', content);
          emit('change', content);
        });

        editor.on('FullscreenStateChanged', (e) => {
          fullscreen.value = e.state;
        });
      }

      function handleImageUploading(name: string) {
        const editor = unref(editorRef);
        if (!editor) {
          return;
        }
        editor.execCommand('mceInsertContent', false, getUploadingImgName(name));
        const content = editor?.getContent() ?? '';
        setValue(editor, content);
      }

      function handleDone(name: string, url: string) {
        const editor = unref(editorRef);
        if (!editor) {
          return;
        }
        const content = editor?.getContent() ?? '';
        const val = content?.replace(getUploadingImgName(name), `<img src="${url}"/>`) ?? '';
        setValue(editor, val);
      }

      function getUploadingImgName(name: string) {
        return `[uploading:${name}]`;
      }

      return {
        prefixCls,
        containerWidth,
        initOptions,
        tinymceContent,
        elRef,
        tinymceId,
        handleImageUploading,
        handleDone,
        editorRef,
        fullscreen,
        disabled,
      };
    },
  });
</script>

<style lang="less" scoped></style>

<style lang="less">
  @prefix-cls: ~'@{namespace}-tinymce-container';

  .@{prefix-cls} {
    position: relative;
    line-height: normal;

    textarea {
      z-index: -1;
      visibility: hidden;
    }
  }
</style>
