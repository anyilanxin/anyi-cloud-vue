<template>
  <span :class="`${prefixCls}- flex items-center `">
    <Icon
      v-if="getIcon && getIconType == 0"
      :icon="getIcon"
      :size="18"
      :class="`${prefixCls}-wrapper__icon mr-2`"
    />
    <div
      :class="`${prefixCls}-wrapper__icon mr-2`"
      v-else-if="getIcon && getIconType == 1"
      style="display: -webkit-flex; display: flex; align-items: center"
    >
      <a-image width="18px" height="18px" :src="getIcon" />
    </div>
    {{ getI18nName }}
  </span>
</template>
<script lang="ts">
  import { computed, defineComponent } from 'vue';

  import Icon from '/@/components/Icon/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { contentProps } from '../props';
  const { t } = useI18n();

  export default defineComponent({
    name: 'MenuItemContent',
    components: {
      Icon,
    },
    props: contentProps,
    setup(props) {
      const { prefixCls } = useDesign('basic-menu-item-content');
      const getI18nName = computed(() => t(props.item?.name));
      const getIcon = computed(() => props.item?.icon);
      const getIconType = computed(() => props.item?.iconType || 0);
      return {
        prefixCls,
        getIconType,
        getI18nName,
        getIcon,
      };
    },
  });
</script>
