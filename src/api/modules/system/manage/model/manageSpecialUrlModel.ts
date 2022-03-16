import { BasePageVo } from '/@/api/model/baseModel';

export interface ManageSpecialUrlDto {
  routeSpecialId: string;
  businessId: string;
  serviceId: string;
  urlName: string;
  urlType: number;
  specialType: number;
  requestMethod: string;
  url: string;
  limitMethod: number;
  remark: string;
  createUserName: string;
  createTime: string;
  urlDescribe: string;
  specialStatus: number;
}

export interface ManageSpecialUrlPageVo extends BasePageVo {
  businessId: string;
  serviceId: string;
  urlName: string;
  urlType: number;
  specialType: string;
  url: string;
}

export interface ManageSpecialUrlPageDto {
  routeSpecialId: string;
  businessId: string;
  serviceId: string;
  urlName: string;
  urlType: number;
  specialType: number;
  requestMethod: string;
  url: string;
  limitMethod: number;
  remark: string;
  createUserName: string;
  createTime: string;
  urlDescribe: string;
  specialStatus: number;
}

export interface ManageSpecialUrlVo {
  businessId: string;
  serviceId: string;
  urlName: string;
  urlType: number;
  specialType: number;
  requestMethod: string;
  url: string;
  limitMethod: number;
  remark: string;
  urlDescribe: string;
  specialStatus: number;
}

export interface ManageSpecialUrlQueryVo {
  businessId?: string;
  serviceId?: string;
  urlName?: string;
  specialStatus?: number;
}
