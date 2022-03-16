import { BasePageVo } from '/@/api/model/baseModel';
import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree';
export interface RbacOrgTreeDto extends TreeDataItem {
  orgId: string;
  parentId: string;
  orgName: string;
  orgNameEn: string;
  orgNameAbbr: string;
  orgOrder: number;
  orgType: number;
  orgCode: string;
  orgSysCode: string;
  orgStatus: string;
  autoBind: string;
  phone: string;
  fax: string;
  address: string;
  remark: string;
}

export interface RbacOrgPageVo extends BasePageVo {
  orgName: string;
  orgCode: string;
  orgStatus: string;
}

export interface RbacOrgTreePageDto {
  orgId: string;
  parentId: string;
  orgName: string;
  orgNameEn: string;
  orgNameAbbr: string;
  orgOrder: number;
  orgType: number;
  orgCode: string;
  orgSysCode: string;
  orgStatus: string;
  autoBind: string;
  phone: string;
  fax: string;
  address: string;
  remark: string;
  createUserId: string;
  createUserName: string;
  createTime: string;
  children?: RbacOrgTreePageDto[];
  isLeaf: boolean;
  hasChildren: boolean;
}

export interface RbacOrgVo {
  parentId: string;
  orgName: string;
  orgNameEn: string;
  orgNameAbbr: string;
  orgOrder: number;
  orgType: number;
  orgCode: string;
  orgStatus: string;
  autoBind: string;
  phone: string;
  fax: string;
  address: string;
  remark: string;
}
