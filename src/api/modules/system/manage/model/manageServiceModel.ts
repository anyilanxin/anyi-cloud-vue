import { BasePageVo } from '/@/api/model/baseModel';

export interface ValidServiceInfoDto {
  label: string;
  value: string;
  disabled: string;
}

export interface ManageServicePageVo extends BasePageVo {
  serviceCode: string;
  serviceName: string;
  serviceState: number;
}

export interface ManageServicePageDto {
  serviceId: string;
  swaggerTag: string;
  swaggerDocUri: string;
  serviceCode: string;
  serviceName: string;
  isLoadBalancer: number;
  subscribeChange: number;
  noticeChange: number;
  noticeType: number;
  serviceMetadataJson: string;
  serviceState: number;
  noticeTemplateId: string;
  headUserName: string;
  headUserId: string;
  remark: string;
  createUserName: string;
  createTime: string;
  instanceNum: number;
  healthyNum: number;
  unhealthyNum: number;
}

export interface ManageServiceVo {
  swaggerTag: string;
  swaggerDocUri: string;
  serviceCode: string;
  serviceName: string;
  isLoadBalancer: number;
  subscribeChange: number;
  noticeChange: number;
  noticeType: number;
  serviceMetadataJson: string;
  serviceState: number;
  noticeTemplateId: string;
  headUserName: string;
  headUserId: string;
  remark: string;
}

export interface SpecialUrlInfo {
  routeSpecialId: string;
  urlName: string;
  businessId?: string;
  urlType: string;
  specialType: number;
  requestMethod?: string;
  url: string;
  limitMethod: boolean;
  specialStatus: number;
  remark?: string;
}

export interface FilterInfo {
  filterId: string;
  filterType: string;
  rules: string;
  businessId: string;
  remark: string;
  createUserName: string;
  createTime: string;
  specialUrlInfos: SpecialUrlInfo[];
}

export interface ManageServiceFilterUrlDto {
  serviceId: string;
  swaggerTag: string;
  swaggerDocUri: string;
  serviceCode: string;
  serviceName: string;
  isLoadBalancer: number;
  subscribeChange: number;
  noticeChange: number;
  noticeType: number;
  serviceMetadataJson: string;
  serviceState: number;
  noticeTemplateId: string;
  headUserName: string;
  headUserId: string;
  remark: string;
  createUserName: string;
  createTime: string;
  filterInfos: FilterInfo[];
}

export interface ManageServiceDto {
  serviceId: string;
  swaggerTag: string;
  swaggerDocUri: string;
  serviceCode: string;
  serviceName: string;
  isLoadBalancer: number;
  subscribeChange: number;
  noticeChange: number;
  noticeType: number;
  serviceMetadataJson: string;
  serviceState: number;
  noticeTemplateId: string;
  headUserName: string;
  headUserId: string;
  remark: string;
  createUserName: string;
  createTime: string;
  instanceNum: number;
  healthyNum: number;
  unhealthyNum: number;
}

export interface SystemStatDto {
  manageTotalService: number;
  notManageTotalService: number;
  healthyInstanceCount: number;
  noHealthyInstanceCount: number;
}
