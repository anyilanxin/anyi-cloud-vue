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
import type { ButtonProps } from 'ant-design-vue/lib/button/buttonTypes';
import type { CSSProperties, VNodeChild, ComputedRef } from 'vue';
import type { ScrollContainerOptions } from '/@/components/Container/index';

export interface DrawerInstance {
  setDrawerProps: (props: Partial<DrawerProps> | boolean) => void;
  emitVisible?: (visible: boolean, uid: number) => void;
}

export interface ReturnMethods extends DrawerInstance {
  openDrawer: <T = any>(visible?: boolean, data?: T, openOnSet?: boolean) => void;
  closeDrawer: () => void;
  getVisible?: ComputedRef<boolean>;
}

export type RegisterFn = (drawerInstance: DrawerInstance, uuid?: string) => void;

export interface ReturnInnerMethods extends DrawerInstance {
  closeDrawer: () => void;
  changeLoading: (loading: boolean) => void;
  changeOkLoading: (loading: boolean) => void;
  getVisible?: ComputedRef<boolean>;
}

export type UseDrawerReturnType = [RegisterFn, ReturnMethods];

export type UseDrawerInnerReturnType = [RegisterFn, ReturnInnerMethods];

export interface DrawerFooterProps {
  showOkBtn: boolean;
  showCancelBtn: boolean;
  /**
   * Text of the Cancel button
   * @default 'cancel'
   * @type string
   */
  cancelText: string;
  /**
   * Text of the OK button
   * @default 'OK'
   * @type string
   */
  okText: string;

  /**
   * Button type of the OK button
   * @default 'primary'
   * @type string
   */
  okType: 'primary' | 'danger' | 'dashed' | 'ghost' | 'default';
  /**
   * The ok button props, follow jsx rules
   * @type object
   */
  okButtonProps: { props: ButtonProps; on: {} };

  /**
   * The cancel button props, follow jsx rules
   * @type object
   */
  cancelButtonProps: { props: ButtonProps; on: {} };
  /**
   * Whether to apply loading visual effect for OK button or not
   * @default false
   * @type boolean
   */
  confirmLoading: boolean;

  showFooter: boolean;
  footerHeight: string | number;
}
export interface DrawerProps extends DrawerFooterProps {
  isDetail?: boolean;
  loading?: boolean;
  showDetailBack?: boolean;
  visible?: boolean;
  /**
   * Built-in ScrollContainer component configuration
   * @type ScrollContainerOptions
   */
  scrollOptions?: ScrollContainerOptions;
  closeFunc?: () => Promise<any>;
  triggerWindowResize?: boolean;
  /**
   * Whether a close (x) button is visible on top right of the Drawer dialog or not.
   * @default true
   * @type boolean
   */
  closable?: boolean;

  /**
   * Whether to unmount child components on closing drawer or not.
   * @default false
   * @type boolean
   */
  destroyOnClose?: boolean;

  /**
   * Return the mounted node for Drawer.
   * @default 'body'
   * @type any ( HTMLElement| () => HTMLElement | string)
   */
  getContainer?: () => HTMLElement | string;

  /**
   * Whether to show mask or not.
   * @default true
   * @type boolean
   */
  mask?: boolean;

  /**
   * Clicking on the mask (area outside the Drawer) to close the Drawer or not.
   * @default true
   * @type boolean
   */
  maskClosable?: boolean;

  /**
   * Style for Drawer's mask element.
   * @default {}
   * @type object
   */
  maskStyle?: CSSProperties;

  /**
   * The title for Drawer.
   * @type any (string | slot)
   */
  title?: VNodeChild | JSX.Element;
  /**
   * The class name of the container of the Drawer dialog.
   * @type string
   */
  wrapClassName?: string;
  class?: string;
  /**
   * Style of wrapper element which **contains mask** compare to `drawerStyle`
   * @type object
   */
  wrapStyle?: CSSProperties;

  /**
   * Style of the popup layer element
   * @type object
   */
  drawerStyle?: CSSProperties;

  /**
   * Style of floating layer, typically used for adjusting its position.
   * @type object
   */
  bodyStyle?: CSSProperties;
  headerStyle?: CSSProperties;

  /**
   * Width of the Drawer dialog.
   * @default 256
   * @type string | number
   */
  width?: string | number;

  /**
   * placement is top or bottom, height of the Drawer dialog.
   * @type string | number
   */
  height?: string | number;

  /**
   * The z-index of the Drawer.
   * @default 1000
   * @type number
   */
  zIndex?: number;

  /**
   * The placement of the Drawer.
   * @default 'right'
   * @type string
   */
  placement?: 'top' | 'right' | 'bottom' | 'left';
  afterVisibleChange?: (visible?: boolean) => void;
  keyboard?: boolean;
  /**
   * Specify a callback that will be called when a user clicks mask, close button or Cancel button.
   */
  onClose?: (e?: Event) => void;
}
export interface DrawerActionType {
  scrollBottom: () => void;
  scrollTo: (to: number) => void;
  getScrollWrap: () => Element | null;
}
