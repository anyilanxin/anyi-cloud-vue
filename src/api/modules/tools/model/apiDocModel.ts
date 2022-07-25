import { BasePageVo } from '/@/api/model/baseModel';

export interface DesignExpressionPageVo extends BasePageVo {
  keyword: string;
  handleType: number;
  expressionType: number;
  expressionState: number;
}

export interface ApiInfoParseParamsModel {
  swaggerInfo: string;
  requestPrefix: string;
  type: number;
  docType: string;
}
