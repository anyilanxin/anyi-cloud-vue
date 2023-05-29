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
import type { ErrorMessageMode } from '/#/axios';
import { useMessage } from '/@/hooks/web/useMessage';
import { useI18n } from '/@/hooks/web/useI18n';
import { setSecurityInfo } from '/@/utils/auth';
// import router from '/@/router';
// import { PageEnum } from '/@/enums/pageEnum';
import { useUserStoreWithOut } from '/@/store/modules/user';
// import projectSetting from '/@/settings/projectSetting';
// import { SessionTimeoutProcessingEnum } from '/@/enums/appEnum';

const { createMessage, createErrorModal, notification } = useMessage();
const error = createMessage.error!;
// const stp = projectSetting.sessionTimeoutProcessing;

export function checkStatus(
  status: number,
  msg: string,
  errorMessageMode: ErrorMessageMode = 'message',
): void {
  const { t } = useI18n();
  const userStore = useUserStoreWithOut();
  let errMessage = '';
  switch (status) {
    case 400:
      errMessage = `${msg}`;
      break;
    // 401: Not logged in
    // Jump to the login page if not logged in, and carry the path of the current page
    // Return to the current page after successful login. This step needs to be operated on the login page.
    case 401:
      errMessage = msg || t('sys.api.errMsg401');
      // if (stp === SessionTimeoutProcessingEnum.PAGE_COVERAGE) {
      //   userStore.setTokenInfo(null);
      //   userStore.setSessionTimeout(true);
      // } else {
      //   userStore.logout(true);
      // }
      // userStore.setTokenInfo(null);
      // userStore.setSessionTimeout(true);
      break;
    case 403:
      errMessage = msg || t('sys.api.errMsg403');
      break;
    // 404请求不存在
    case 404:
      errMessage = msg || t('sys.api.errMsg404');
      break;
    case 405:
      errMessage = msg || t('sys.api.errMsg405');
      break;
    case 406:
      setSecurityInfo(null);
      errMessage = msg || t('sys.api.errMsg403');
      break;
    case 408:
      errMessage = msg || t('sys.api.errMsg408');
      break;
    case 500:
      errMessage = msg || t('sys.api.errMsg500');
      break;
    case 501:
      errMessage = msg || t('sys.api.errMsg501');
      break;
    case 502:
      errMessage = msg || t('sys.api.errMsg502');
      break;
    case 503:
      errMessage = msg || t('sys.api.errMsg503');
      break;
    case 504:
      errMessage = msg || t('sys.api.errMsg504');
      break;
    case 505:
      errMessage = msg || t('sys.api.errMsg505');
      break;
    default:
      errMessage = msg || '未知错误';
  }
  if (errMessage) {
    if (status === 401) {
      let secondsToGo = 3;
      let interval: any = null;
      const model = createErrorModal({
        title: t('sys.api.errorTip'),
        content: `${errMessage} ,${secondsToGo}秒后将自动退出登录,确认立马退出!!!`,
        onOk: () => {
          if (interval) {
            clearInterval(interval);
          }
          userStore.setTokenInfo(null);
          userStore.setSessionTimeout(true);
        },
      });
      interval = setInterval(() => {
        secondsToGo -= 1;
        model.update({
          content: `${errMessage} ,${secondsToGo}秒后将自动退出登录,确认立马退出!!!`,
        });
      }, 1000);
      setTimeout(() => {
        if (interval) {
          clearInterval(interval);
        }
        model.destroy();
        userStore.setTokenInfo(null);
        userStore.setSessionTimeout(true);
      }, secondsToGo * 1000);
    } else if (errorMessageMode === 'modal') {
      createErrorModal({ title: t('sys.api.errorTip'), content: errMessage });
    } else if (errorMessageMode === 'message') {
      error({ content: errMessage, key: `global_error_message_status_${status}` });
    } else if (errorMessageMode === 'notification') {
      notification.error({ message: t('sys.api.errorTip'), description: errMessage });
    }
  }
}
