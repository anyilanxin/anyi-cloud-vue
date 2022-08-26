// noinspection JSUnusedGlobalSymbols
import { useGlobSetting } from '/@/hooks/setting';
import projectSetting from '/@/settings/projectSetting';
import { computed, ref, unref } from 'vue';
import { useWebSocket, UseWebSocketReturn } from '@vueuse/core';
import { getTokenInfo } from '/@/utils/auth';
import { useMessage } from '/@/hooks/web/useMessage';
import { useI18n } from '/@/hooks/web/useI18n';
import { useUserStoreWithOut } from '/@/store/modules/user';

const { createErrorModal } = useMessage();

const result = ref<UseWebSocketReturn<any>>();

const listeners = new Map();

/**
 * 开启 WebSocket 链接，全局只需执行一次
 */
export function connectWebSocket() {
  const globSetting = useGlobSetting();
  const openSocket = globSetting.openSocket;
  if (!unref(getIsOpen) && openSocket) {
    const server = getSocketUrl();
    if (!server) {
      return;
    }
    result.value = useWebSocket(server, {
      autoReconnect: {
        retries: () => {
          // 如果token为空则停止重连
          const token = getTokenInfo();
          if (!token || Object.keys(token).length < 0) {
            return false;
          }
          return true;
        },
        delay: 4000,
      },
      heartbeat: {
        message: 'PING',
        interval: 10000,
      },
      onConnected: (__ws: WebSocket) => {
        onOpen();
      },
      onDisconnected: (__ws: WebSocket, event: CloseEvent) => {
        onClose(event);
      },
      onError: (__ws: WebSocket, event: Event) => {
        onError(event);
      },
      onMessage: (__ws: WebSocket, event: MessageEvent) => {
        onMessage(event);
      },
    });
  }
}

/**
 * 获取socket链接地址
 */
function getSocketUrl() {
  const token = getTokenInfo();
  if (!token || Object.keys(token).length < 0) {
    return '';
  }
  const globSetting = useGlobSetting();
  let socketUrl = projectSetting.socketApi || '';
  if (socketUrl && socketUrl.indexOf('ws') < 0 && socketUrl.indexOf('wss') < 0) {
    socketUrl = globSetting.urlPrefix + globSetting.apiUrl + socketUrl;
    socketUrl = socketUrl;
    const location = window.location;
    if (location.protocol == 'http:') {
      socketUrl = 'ws://' + location.host + socketUrl;
    } else {
      socketUrl = 'wss://' + location.host + socketUrl;
    }
  }
  return socketUrl + '?access_token=' + token.access_token;
}

/**
 * socket打开
 */
function onOpen() {
  console.log('[WebSocket] 连接成功');
}

/**
 * socket关闭
 */
function onClose(e) {
  console.log('[WebSocket] 连接断开：', e);
  // 如果登录过期则断开链接
  if (e.code == 4001) {
    const userStore = useUserStoreWithOut();
    const { t } = useI18n();
    const errMessage = e.reason || 'token无效';
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
  }
}

/**
 * socket发送了错误
 */
function onError(e) {
  console.log('[WebSocket] 连接发生错误: ', e);
}

/**
 * socket消息
 */
function onMessage(e: any) {
  if (e.data.toUpperCase() == 'PING') {
    unref(result)?.send('PONG');
    return;
  }
  if (e.data.toUpperCase() == 'PONG') {
    return;
  }
  try {
    const data = JSON.parse(e.data);
    for (const callback of listeners.keys()) {
      try {
        callback(data);
      } catch (err) {
        console.error(err);
      }
    }
  } catch (err) {
    console.error('[WebSocket] data解析失败：', err);
  }
}

/**
 * 判断 WebSocket 是否是开启状态
 */
export const getIsOpen = computed(() => unref(result.value?.status) == 'OPEN');

/**
 * 添加 WebSocket 消息监听
 * @param callback
 */
export function onWebSocket(callback: (data: object) => any) {
  if (!listeners.has(callback)) {
    if (typeof callback === 'function') {
      listeners.set(callback, null);
    } else {
      console.debug('[WebSocket] 添加 WebSocket 消息监听失败：传入的参数不是一个方法');
    }
  }
}

/**
 * 解除 WebSocket 消息监听
 *
 * @param callback
 */
export function offWebSocket(callback: (data: object) => any) {
  listeners.delete(callback);
}

export function useWebSocketResult() {
  return unref(result);
}
