<template>
  <div :class="prefixCls">oiuoiuoiuoi</div>
</template>
<script lang="ts" setup>
  import { useDesign } from '/@/hooks/web/useDesign';
  const { prefixCls } = useDesign('header-notice');
</script>
<style lang="less">
  @import './index.less';
</style>
