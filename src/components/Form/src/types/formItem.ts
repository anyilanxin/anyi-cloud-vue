/*
 * Copyright (c) 2021-2023 ZHOUXUANHONG(安一老厨)<anyilanxin@aliyun.com>
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
import type { NamePath } from 'ant-design-vue/lib/form/interface';
import type { ColProps } from 'ant-design-vue/lib/grid/Col';
import type { HTMLAttributes, VNodeChild } from 'vue';

export interface FormItem {
  /**
   * Used with label, whether to display : after label text.
   * @default true
   * @type boolean
   */
  colon?: boolean;

  /**
   * The extra prompt message. It is similar to help. Usage example: to display error message and prompt message at the same time.
   * @type any (string | slot)
   */
  extra?: string | VNodeChild | JSX.Element;

  /**
   * Used with validateStatus, this option specifies the validation status icon. Recommended to be used only with Input.
   * @default false
   * @type boolean
   */
  hasFeedback?: boolean;

  /**
   * The prompt message. If not provided, the prompt message will be generated by the validation rule.
   * @type any (string | slot)
   */
  help?: string | VNodeChild | JSX.Element;

  /**
   * Label test
   * @type any (string | slot)
   */
  label?: string | VNodeChild | JSX.Element;

  /**
   * The layout of label. You can set span offset to something like {span: 3, offset: 12} or sm: {span: 3, offset: 12} same as with <Col>
   * @type Col
   */
  labelCol?: ColProps & HTMLAttributes;

  /**
   * Whether provided or not, it will be generated by the validation rule.
   * @default false
   * @type boolean
   */
  required?: boolean;

  /**
   * The validation status. If not provided, it will be generated by validation rule. options: 'success' 'warning' 'error' 'validating'
   * @type string
   */
  validateStatus?: '' | 'success' | 'warning' | 'error' | 'validating';

  /**
   * The layout for input controls, same as labelCol
   * @type Col
   */
  wrapperCol?: ColProps;
  /**
   * Set sub label htmlFor.
   */
  htmlFor?: string;
  /**
   * text align of label
   */
  labelAlign?: 'left' | 'right';
  /**
   * a key of model. In the setting of validate and resetFields method, the attribute is required
   */
  name?: NamePath;
  /**
   * validation rules of form
   */
  rules?: object | object[];
  /**
   * Whether to automatically associate form fields. In most cases, you can setting automatic association.
   * If the conditions for automatic association are not met, you can manually associate them. See the notes below.
   */
  autoLink?: boolean;
  /**
   * Whether stop validate on first rule of error for this field.
   */
  validateFirst?: boolean;
  /**
   * When to validate the value of children node
   */
  validateTrigger?: string | string[] | false;
}
