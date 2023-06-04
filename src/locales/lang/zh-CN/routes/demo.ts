/*
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
 */
export default {
  charts: {
    baiduMap: '百度地图',
    aMap: '高德地图',
    googleMap: '谷歌地图',
    charts: '图表',
    map: '地图',
    line: '折线图',
    pie: '饼图',
  },
  comp: {
    comp: '组件',
    basic: '基础组件',
    transition: '动画组件',
    countTo: '数字动画',

    scroll: '滚动组件',
    scrollBasic: '基础滚动',
    scrollAction: '滚动函数',
    virtualScroll: '虚拟滚动',

    tree: 'Tree',
    treeBasic: '基础树',
    editTree: '可搜索/工具栏',
    actionTree: '函数操作示例',

    modal: '弹窗扩展',
    drawer: '抽屉扩展',
    desc: '详情组件',

    lazy: '懒加载组件',
    lazyBasic: '基础示例',
    lazyTransition: '动画效果',

    verify: '验证组件',
    verifyDrag: '拖拽校验',
    verifyRotate: '图片还原',

    qrcode: '二维码组件',
    strength: '密码强度组件',
    upload: '上传组件',

    loading: 'Loading',

    time: '相对时间',
    cropperImage: '图片裁剪',
    cardList: '卡片列表',
  },
  editor: {
    editor: '编辑器',
    jsonEditor: 'Json编辑器',
    markdown: 'markdown编辑器',

    tinymce: '富文本',
    tinymceBasic: '基础使用',
    tinymceForm: '嵌入form',
  },
  excel: {
    excel: 'Excel',
    customExport: '选择导出格式',
    jsonExport: 'JSON数据导出',
    arrayExport: 'Array数据导出',
    importExcel: '导入',
  },
  feat: {
    feat: '功能',
    icon: '图标',
    sessionTimeout: '登录过期',
    tabs: '标签页操作',
    tabDetail: '标签详情页',
    print: '打印',
    contextMenu: '右键菜单',
    download: '文件下载',
    clickOutSide: 'ClickOutSide组件',
    imgPreview: '图片预览',
    copy: '剪切板',
    msg: '消息提示',
    watermark: '水印',
    ripple: '水波纹',
    fullScreen: '全屏',
    errorLog: '错误日志',
    tab: 'Tab带参',
    tab1: 'Tab带参1',
    tab2: 'Tab带参2',
    menu: 'Menu带参',
    menu1: 'Menu带参1',
    menu2: 'Menu带参2',
    ws: 'websocket测试',
    breadcrumb: '面包屑导航',
    breadcrumbFlat: '平级模式',
    requestDemo: '测试请求重试',
    breadcrumbFlatDetail: '平级详情',
    breadcrumbChildren: '层级模式',
    breadcrumbChildrenDetail: '层级详情',
  },
  flow: {
    name: '图形编辑器',
    flowChart: '流程图',
  },
  form: {
    form: 'Form',
    basic: '基础表单',
    useForm: 'useForm',
    refForm: 'RefForm',
    advancedForm: '可收缩表单',
    ruleForm: '表单验证',
    dynamicForm: '动态表单',
    customerForm: '自定义组件',
    appendForm: '表单增删示例',
    tabsForm: '标签页+多级field',
  },
  iframe: {
    frame: '外部页面',
    antv: 'antVue文档(内嵌)',
    doc: '项目文档(内嵌)',
    docExternal: '项目文档(外链)',
  },
  level: { level: '多级菜单' },
  page: {
    page: '页面',

    form: '表单页',
    formBasic: '基础表单',
    formStep: '分步表单',
    formHigh: '高级表单',

    desc: '详情页',
    descBasic: '基础详情页',
    descHigh: '高级详情页',

    result: '结果页',
    resultSuccess: '成功页',
    resultFail: '失败页',

    account: '个人页',
    accountCenter: '个人中心',
    accountSetting: '个人设置',

    exception: '异常页',
    netWorkError: '网络错误',
    notData: '无数据',

    list: '列表页',
    listCard: '卡片列表',
    listBasic: '标准列表',
    listSearch: '搜索列表',
  },
  permission: {
    permission: '权限管理',

    front: '基于前端权限',
    frontPage: '页面权限',
    frontBtn: '按钮权限',
    frontTestA: '权限测试页A',
    frontTestB: '权限测试页B',

    back: '基于后台权限',
    backPage: '页面权限',
    backBtn: '按钮权限',
  },
  setup: {
    page: '引导页',
  },
  system: {
    moduleName: '系统管理',
    account: '账号管理',
    account_detail: '账号详情',
    password: '修改密码',
    dept: '部门管理',
    menu: '菜单管理',
    role: '角色管理',
  },
  table: {
    table: 'Table',
    basic: '基础表格',
    treeTable: '树形表格',
    fetchTable: '远程加载示例',
    fixedColumn: '固定列',
    customerCell: '自定义列',
    formTable: '开启搜索区域',
    useTable: 'UseTable',
    refTable: 'RefTable',
    multipleHeader: '多级表头',
    mergeHeader: '合并单元格',
    expandTable: '可展开表格',
    fixedHeight: '定高/头部自定义',
    footerTable: '表尾行合计',
    editCellTable: '可编辑单元格',
    editRowTable: '可编辑行',
    authColumn: '权限列',
    resizeParentHeightTable: '继承父元素高度',
  },
};
