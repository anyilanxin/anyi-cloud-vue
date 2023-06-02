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
import { BasePageVo } from '/@/api/model/baseModel';

export interface RbacMenuPageVo extends BasePageVo {
  metaTitle: string;
  menuStatus: number;
  systemId: string;
}

export interface RbacMenuPageDto {
  menuId: string;
  parentId: string;
  path: string;
  component: string;
  pathName: string;
  menuType: number;
  iframe: boolean;
  menuStatus: number;
  metaTitle: string;
  actions: string;
  icon: string;
  iconType: number;
  orderNo: number;
  systemId: string;
  enableDelete: number;
  remark: string;
  createUserName: string;
  menuSysCode: string;
  createTime: string;
  children?: RbacMenuPageDto[];
  isLeaf: boolean;
  hasChildren: boolean;
}

export interface RbacMenuTreeDto {
  menuId: string;
  parentId: string;
  metaTitle: string;
  path: string;
  menuType: number;
  menuStatus: number;
  children?: RbacMenuTreeDto[];
  isLeaf: boolean;
  hasChildren: boolean;
}

export interface RbacMenuVo {
  parentId?: string;
  path?: string;
  component?: string;
  pathName?: string;
  redirect?: string;
  menuType: number;
  iframe?: boolean;
  iframeType: number;
  menuStatus: number;
  metaTitle: string;
  ignoreKeepAlive: boolean;
  affix: boolean;
  icon?: string;
  iconType?: number;
  frameSrc?: string;
  transitionName?: string;
  hideBreadcrumb?: boolean;
  carryParam?: boolean;
  hideChildrenInMenu?: boolean;
  currentActiveMenu?: string;
  hideTab?: boolean;
  hideMenu?: boolean;
  orderNo: number;
  ignoreRoute?: boolean;
  hidePathForChildren?: boolean;
  buttonAction?: string;
  systemId: string;
  remark?: string;
  type?: string;
  content?: string;
  dot?: boolean;
}

export interface RbacMenuDto {
  MenuId: string;
  parentId?: string;
  path?: string;
  component?: string;
  pathName?: string;
  redirect?: string;
  MenuType: number;
  iframe?: boolean;
  iframeType: number;
  menuStatus: number;
  metaTitle: string;
  ignoreKeepAlive: boolean;
  affix: boolean;
  icon?: string;
  iconType?: number;
  frameSrc?: string;
  transitionName?: string;
  hideBreadcrumb?: boolean;
  carryParam?: boolean;
  hideChildrenInMenu?: boolean;
  currentActiveMenu?: string;
  hideTab?: boolean;
  hideMenu?: boolean;
  orderNo: number;
  ignoreRoute?: boolean;
  hidePathForChildren?: boolean;
  buttonAction?: string;
  systemId?: string;
  enableDelete: number;
  menuSysCode: string;
  createUserName: string;
  createTime: string;
  type?: string;
  content?: string;
  dot?: boolean;
  remark?: string;
}
