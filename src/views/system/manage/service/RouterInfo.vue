<template>
  <PageWrapper
    @back="goBack"
    :title="'路由信息' + (params.serviceName ? `(${params.serviceName})` : '')"
  >
    <div> 路由 </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { useRoute, useRouter } from 'vue-router';
  import { ref } from 'vue';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { PageWrapper } from '/@/components/Page';
  const route = useRoute();
  const router = useRouter();
  const { closeCurrent } = useTabs();
  const params = ref(route.params);
  function goBack() {
    closeCurrent();
    router.back();
  }
</script>
