export interface ManageSpecialUrlVo {
  urlName: string;
  urlDescribe: string;
  specialStatus: number;
  urlType: string;
  specialType: string;
  limitMethod: boolean;
  requestMethod: string;
  url: string;
  remark: string;
}

export interface ManageRouteFilterVo {
  serviceId: string;
  businessId: string;
  filterType: string;
  rules: string;
  remark: string;
  filterStatus: number;
  specialUrlVoList: ManageSpecialUrlVo[];
}

export interface ManageSpecialUrlDto {
  routeSpecialId: string;
  businessId: string;
  serviceId: string;
  urlName: string;
  urlType: string;
  specialType: string;
  requestMethod: string;
  url: string;
  limitMethod: boolean;
  remark: string;
  createUserName: string;
  createTime: string;
  specialStatus: string;
  urlDescribe: string;
}
export interface ManageRouteFilterDto {
  filterId: string;
  serviceId: string;
  businessId: string;
  filterType: string;
  rules: string;
  remark: string;
  createUserName: string;
  createTime: string;
  specialUrlInfos: ManageSpecialUrlDto[];
}
