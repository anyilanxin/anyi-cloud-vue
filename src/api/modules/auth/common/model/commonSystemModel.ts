import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree';
import { BasePageVo } from '/@/api/model/baseModel';
export interface CommonSystemDto extends TreeDataItem {
  systemId: string;
  systemName: string;
  systemCode: string;
  systemDescribe: string;
  remark: string;
}

export interface CommonSystemVo {
  systemId: string;
}

export interface CommonSystemPageVo extends BasePageVo {
  systemId: string;
}

export interface CommonSystemPageDto {
  systemId: string;
}
