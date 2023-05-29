/*
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
 */
export default {
  app: {
    searchNotData: '暂无搜索结果',
    toSearch: '确认',
    toNavigate: '切换',
  },
  countdown: {
    normalText: '获取验证码',
    sendText: '{0}秒后重新获取',
  },
  cropper: {
    selectImage: '选择图片',
    uploadSuccess: '上传成功',
    modalTitle: '头像上传',
    okText: '确认并上传',
    btn_reset: '重置',
    btn_rotate_left: '逆时针旋转',
    btn_rotate_right: '顺时针旋转',
    btn_scale_x: '水平翻转',
    btn_scale_y: '垂直翻转',
    btn_zoom_in: '放大',
    btn_zoom_out: '缩小',
    preview: '预览',
  },
  drawer: {
    loadingText: '加载中...',
    cancelText: '关闭',
    okText: '确认',
  },
  excel: {
    exportModalTitle: '导出数据',
    fileType: '文件类型',
    fileName: '文件名',
  },
  form: {
    putAway: '收起',
    unfold: '展开',

    maxTip: '字符数应小于{0}位',

    apiSelectNotFound: '请等待数据加载完成...',
  },
  icon: {
    placeholder: '点击选择图标',
    search: '搜索图标',
    copy: '复制图标成功!',
  },
  menu: {
    search: '菜单搜索',
  },
  modal: {
    cancelText: '关闭',
    okText: '确认',
    close: '关闭',
    maximize: '最大化',
    restore: '还原',
  },
  table: {
    settingDens: '密度',
    settingDensDefault: '默认',
    settingDensMiddle: '中等',
    settingDensSmall: '紧凑',
    settingColumn: '列设置',
    settingColumnShow: '列展示',
    settingIndexColumnShow: '序号列',
    settingSelectColumnShow: '勾选列',
    settingFixedLeft: '固定到左侧',
    settingFixedRight: '固定到右侧',
    settingFullScreen: '全屏',

    index: '序号',

    total: '共 {total} 条数据',
  },
  time: {
    before: '前',
    after: '后',
    just: '刚刚',
    seconds: '秒',
    minutes: '分钟',
    hours: '小时',
    days: '天',
  },
  tree: {
    selectAll: '选择全部',
    unSelectAll: '取消选择',
    expandAll: '展开全部',
    unExpandAll: '折叠全部',
    checkStrictly: '层级关联',
    checkUnStrictly: '层级独立',
  },
  upload: {
    save: '保存',
    upload: '上传',
    imgUpload: '图片上传',
    uploaded: '已上传',

    operating: '操作',
    del: '删除',
    download: '下载',
    saveWarn: '请等待文件上传后，保存!',
    saveError: '没有上传成功的文件，无法保存!',

    preview: '预览',
    choose: '选择文件',

    accept: '支持{0}格式',
    acceptUpload: '只能上传{0}格式文件',
    maxSize: '单个文件不超过{0}MB',
    maxSizeMultiple: '只能上传不超过{0}MB的文件!',
    maxNumber: '最多只能上传{0}个文件',

    legend: '略缩图',
    fileName: '文件名',
    fileSize: '文件大小',
    fileStatue: '状态',

    startUpload: '开始上传',
    uploadSuccess: '上传成功',
    uploadError: '上传失败',
    uploading: '上传中',
    uploadWait: '请等待文件上传结束后操作',
    reUploadFailed: '重新上传失败文件',
  },
  verify: {
    error: '验证失败！',
    time: '验证校验成功,耗时{time}秒！',

    redoTip: '点击图片可刷新',

    dragText: '请按住滑块拖动',
    successText: '验证通过',
  },
};
