<template>
  <ConfigProvider :locale="getAntdLocale">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ConfigProvider } from 'ant-design-vue';
  import { onMounted } from 'vue';
  import { AppProvider } from '/@/components/Application';
  import { useTitle } from '/@/hooks/web/useTitle';
  import { useLocale } from '/@/locales/useLocale';
  import { connectWebSocket, onWebSocket } from '/@/hooks/web/useWebSocket';

  import 'dayjs/locale/zh-cn';
  // support Multi-language
  const { getAntdLocale } = useLocale();

  // Listening to page changes and dynamically changing site titles
  useTitle();
  onMounted(() => {
    connectWebSocket();
    onWebSocket(onWebSocketMessage);
  });
  function onWebSocketMessage(data: any) {
    console.log('--------data------------', data);
  }
</script>
