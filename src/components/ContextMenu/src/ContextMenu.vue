<!--
 * Copyright (c) 2021-present ZHOUXUANHONG(安一老厨)<anyilanxin@aliyun.com>
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
 -->
<script lang="tsx">
  import type { ContextMenuItem, ItemContentProps, Axis } from './typing';
  import type { FunctionalComponent, CSSProperties } from 'vue';
  import { defineComponent, nextTick, onMounted, computed, ref, unref, onUnmounted } from 'vue';
  import Icon from '/@/components/Icon';
  import { Menu, Divider } from 'ant-design-vue';

  const prefixCls = 'context-menu';

  const props = {
    width: { type: Number, default: 156 },
    customEvent: { type: Object as PropType<Event>, default: null },
    styles: { type: Object as PropType<CSSProperties> },
    showIcon: { type: Boolean, default: true },
    axis: {
      // The position of the right mouse button click
      type: Object as PropType<Axis>,
      default() {
        return { x: 0, y: 0 };
      },
    },
    items: {
      // The most important list, if not, will not be displayed
      type: Array as PropType<ContextMenuItem[]>,
      default() {
        return [];
      },
    },
  };

  const ItemContent: FunctionalComponent<ItemContentProps> = (props) => {
    const { item } = props;
    return (
      <span
        style="display: inline-block; width: 100%; "
        class="px-4"
        onClick={props.handler.bind(null, item)}
      >
        {props.showIcon && item.icon && <Icon class="mr-2" icon={item.icon} />}
        <span>{item.label}</span>
      </span>
    );
  };

  export default defineComponent({
    name: 'ContextMenu',
    props,
    setup(props) {
      const wrapRef = ref(null);
      const showRef = ref(false);

      const getStyle = computed((): CSSProperties => {
        const { axis, items, styles, width } = props;
        const { x, y } = axis || { x: 0, y: 0 };
        const menuHeight = (items || []).length * 40;
        const menuWidth = width;
        const body = document.body;

        const left = body.clientWidth < x + menuWidth ? x - menuWidth : x;
        const top = body.clientHeight < y + menuHeight ? y - menuHeight : y;
        return {
          ...styles,
          position: 'absolute',
          width: `${width}px`,
          left: `${left + 1}px`,
          top: `${top + 1}px`,
          zIndex: 9999,
        };
      });

      onMounted(() => {
        nextTick(() => (showRef.value = true));
      });

      onUnmounted(() => {
        const el = unref(wrapRef);
        el && document.body.removeChild(el);
      });

      function handleAction(item: ContextMenuItem, e: MouseEvent) {
        const { handler, disabled } = item;
        if (disabled) {
          return;
        }
        showRef.value = false;
        e?.stopPropagation();
        e?.preventDefault();
        handler?.();
      }

      function renderMenuItem(items: ContextMenuItem[]) {
        const visibleItems = items.filter((item) => !item.hidden);
        return visibleItems.map((item) => {
          const { disabled, label, children, divider = false } = item;

          const contentProps = {
            item,
            handler: handleAction,
            showIcon: props.showIcon,
          };

          if (!children || children.length === 0) {
            return (
              <>
                <Menu.Item disabled={disabled} class={`${prefixCls}__item`} key={label}>
                  <ItemContent {...contentProps} />
                </Menu.Item>
                {divider ? <Divider key={`d-${label}`} /> : null}
              </>
            );
          }
          if (!unref(showRef)) return null;

          return (
            <Menu.SubMenu key={label} disabled={disabled} popupClassName={`${prefixCls}__popup`}>
              {{
                title: () => <ItemContent {...contentProps} />,
                default: () => renderMenuItem(children),
              }}
            </Menu.SubMenu>
          );
        });
      }
      return () => {
        if (!unref(showRef)) {
          return null;
        }
        const { items } = props;
        return (
          <div class={prefixCls}>
            <Menu inlineIndent={12} mode="vertical" ref={wrapRef} style={unref(getStyle)}>
              {renderMenuItem(items)}
            </Menu>
          </div>
        );
      };
    },
  });
</script>
<style lang="less">
  @default-height: 42px !important;

  @small-height: 36px !important;

  @large-height: 36px !important;

  .item-style() {
    li {
      display: inline-block;
      width: 100%;
      height: @default-height;
      margin: 0 !important;
      line-height: @default-height;

      span {
        line-height: @default-height;
      }

      > div {
        margin: 0 !important;
      }

      &:not(.ant-menu-item-disabled):hover {
        color: @text-color-base;
        background-color: @item-hover-bg;
      }
    }
  }

  .context-menu {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    display: block;
    width: 156px;
    margin: 0;
    list-style: none;
    background-color: @component-background;
    border: 1px solid rgb(0 0 0 / 8%);
    border-radius: 0.25rem;
    box-shadow: 0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 10%),
      0 1px 5px 0 rgb(0 0 0 / 6%);
    background-clip: padding-box;
    user-select: none;

    &__item {
      margin: 0 !important;
    }
    .item-style();

    .ant-divider {
      margin: 0;
    }

    &__popup {
      .ant-divider {
        margin: 0;
      }

      .item-style();
    }

    .ant-menu-submenu-title,
    .ant-menu-item {
      padding: 0 !important;
    }
  }
</style>
