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
 */
export default {
  footer: { contactMe: '联系我', onlineDocument: '在线文档', question: '问题反馈' },
  header: {
    // user dropdown
    dropdownItemDoc: '文档',
    dropdownItemLoginOut: '退出系统',
    dropdownItemSwitchOrg: '切换机构',

    // tooltip
    tooltipErrorLog: '错误日志',
    tooltipLock: '锁定屏幕',
    tooltipNotify: '消息通知',

    tooltipEntryFull: '全屏',
    tooltipExitFull: '退出全屏',

    // lock
    lockScreenPassword: '锁屏密码',
    lockScreen: '锁定屏幕',
    lockScreenBtn: '锁定',

    home: '首页',
  },
  multipleTab: {
    reload: '重新加载',
    close: '关闭当前',
    closeLeft: '关闭左侧',
    closeRight: '关闭右侧',
    closeOther: '关闭其它',
    closeAll: '关闭全部',
  },
  setting: {
    // content mode
    contentModeFull: '流式',
    contentModeFixed: '定宽',
    // topMenu align
    topMenuAlignLeft: '居左',
    topMenuAlignRight: '居中',
    topMenuAlignCenter: '居右',
    // menu trigger
    menuTriggerNone: '不显示',
    menuTriggerBottom: '底部',
    menuTriggerTop: '顶部',
    // menu type
    menuTypeSidebar: '左侧菜单模式',
    menuTypeMixSidebar: '左侧菜单混合模式',
    menuTypeMix: '顶部菜单混合模式',
    menuTypeTopMenu: '顶部菜单模式',

    on: '开',
    off: '关',
    minute: '分钟',

    operatingTitle: '操作成功',
    operatingContent: '复制成功,请到 src/settings/projectSetting.ts 中修改配置！',
    resetSuccess: '重置成功！',

    copyBtn: '拷贝',
    clearBtn: '清空缓存并返回登录页',

    drawerTitle: '项目配置',

    darkMode: '主题',
    navMode: '导航栏模式',
    interfaceFunction: '界面功能',
    interfaceDisplay: '界面显示',
    animation: '动画',
    splitMenu: '分割菜单',
    closeMixSidebarOnChange: '切换页面关闭菜单',

    sysTheme: '系统主题',
    headerTheme: '顶栏主题',
    sidebarTheme: '菜单主题',

    menuDrag: '侧边菜单拖拽',
    menuSearch: '菜单搜索',
    menuAccordion: '侧边菜单手风琴模式',
    menuCollapse: '折叠菜单',
    collapseMenuDisplayName: '折叠菜单显示名称',
    topMenuLayout: '顶部菜单布局',
    menuCollapseButton: '菜单折叠按钮',
    contentMode: '内容区域宽度',
    expandedMenuWidth: '菜单展开宽度',

    breadcrumb: '面包屑',
    breadcrumbIcon: '面包屑图标',
    tabs: '标签页',
    tabDetail: '标签详情页',
    tabsQuickBtn: '标签页快捷按钮',
    tabsRedoBtn: '标签页刷新按钮',
    tabsFoldBtn: '标签页折叠按钮',
    sidebar: '左侧菜单',
    header: '顶栏',
    footer: '页脚',
    fullContent: '全屏内容',
    grayMode: '灰色模式',
    colorWeak: '色弱模式',

    progress: '顶部进度条',
    switchLoading: '切换loading',
    switchAnimation: '切换动画',
    animationType: '动画类型',

    autoScreenLock: '自动锁屏',
    notAutoScreenLock: '不自动锁屏',

    fixedHeader: '固定header',
    fixedSideBar: '固定Sidebar',

    mixSidebarTrigger: '混合菜单触发方式',
    triggerHover: '悬停',
    triggerClick: '点击',

    mixSidebarFixed: '固定展开菜单',
  },
};
