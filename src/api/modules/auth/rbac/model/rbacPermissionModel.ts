import { BasePageVo } from '/@/api/model/baseModel';

export interface RbacPermissionPageVo extends BasePageVo {
  metaTitle: string;
  permissionStatus: number;
  systemId: string;
}

export interface RbacPermissionPageDto {
  permissionId: string;
  parentId: string;
  path: string;
  component: string;
  pathName: string;
  permissionType: number;
  iframe: boolean;
  permissionStatus: number;
  metaTitle: string;
  actionType: number;
  actions: string;
  icon: string;
  iconType: number;
  orderNo: number;
  systemId: string;
  enableDelete: number;
  remark: string;
  createUserName: string;
  permissionSysCode: string;
  createTime: string;
  children?: RbacPermissionPageDto[];
  isLeaf: boolean;
  hasChildren: boolean;
}

export interface RbacPermissionTreeDto {
  permissionId: string;
  parentId: string;
  metaTitle: string;
  path: string;
  permissionType: number;
  permissionStatus: number;
  children?: RbacPermissionTreeDto[];
  isLeaf: boolean;
  hasChildren: boolean;
}

export interface RbacPermissionVo {
  parentId?: string;
  path?: string;
  component?: string;
  pathName?: string;
  redirect?: string;
  permissionType: number;
  iframe?: boolean;
  iframeType: number;
  permissionStatus: number;
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
  serviceId?: string;
  hideTab?: boolean;
  hideMenu?: boolean;
  orderNo: number;
  ignoreRoute?: boolean;
  hidePathForChildren?: boolean;
  checkStrategy?: string;
  checkActionUri?: boolean;
  actionUri?: string;
  actions?: string;
  systemId: string;
  remark?: string;
  type?: string;
  content?: string;
  dot?: boolean;
}

export interface RbacPermissionDto {
  permissionId: string;
  parentId?: string;
  path?: string;
  component?: string;
  pathName?: string;
  redirect?: string;
  permissionType: number;
  iframe?: boolean;
  iframeType: number;
  permissionStatus: number;
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
  serviceId?: string;
  hideTab?: boolean;
  hideMenu?: boolean;
  orderNo: number;
  ignoreRoute?: boolean;
  hidePathForChildren?: boolean;
  checkStrategy?: string;
  checkActionUri?: boolean;
  actionUri?: string;
  actionLimitMethod?: boolean;
  actionMethods?: string | string[];
  actions?: string;
  systemId?: string;
  enableDelete: number;
  permissionSysCode: string;
  createUserName: string;
  createTime: string;
  type?: string;
  content?: string;
  dot?: boolean;
  remark?: string;
}
