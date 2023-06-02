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
 *   1.请不要删除和修改根目录下的LICENSE.txt文件；
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
  import type { Ref } from 'vue';
  import { defineComponent, ref, computed, unref, reactive, watch, watchEffect } from 'vue';
  import { useTimeoutFn } from '/@/hooks/core/useTimeout';
  import { useEventListener } from '/@/hooks/event/useEventListener';
  import { basicProps } from './props';
  import { getSlot } from '/@/utils/helper/tsxHelper';
  import { CheckOutlined, DoubleRightOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    name: 'BaseDargVerify',
    props: basicProps,
    emits: ['success', 'update:value', 'change', 'start', 'move', 'end'],
    setup(props, { emit, slots, expose }) {
      const state = reactive({
        isMoving: false,
        isPassing: false,
        moveDistance: 0,
        toLeft: false,
        startTime: 0,
        endTime: 0,
      });

      const wrapElRef = ref<HTMLDivElement | null>(null);
      const barElRef = ref<HTMLDivElement | null>(null);
      const contentElRef = ref<HTMLDivElement | null>(null);
      const actionElRef = ref(null) as Ref<HTMLDivElement | null>;

      useEventListener({
        el: document,
        name: 'mouseup',
        listener: () => {
          if (state.isMoving) {
            resume();
          }
        },
      });

      const getActionStyleRef = computed(() => {
        const { height, actionStyle } = props;
        const h = `${parseInt(height as string)}px`;
        return {
          left: 0,
          width: h,
          height: h,
          ...actionStyle,
        };
      });

      const getWrapStyleRef = computed(() => {
        const { height, width, circle, wrapStyle } = props;
        const h = parseInt(height as string);
        const w = `${parseInt(width as string)}px`;
        return {
          width: w,
          height: `${h}px`,
          lineHeight: `${h}px`,
          borderRadius: circle ? h / 2 + 'px' : 0,
          ...wrapStyle,
        };
      });

      const getBarStyleRef = computed(() => {
        const { height, circle, barStyle } = props;
        const h = parseInt(height as string);
        return {
          height: `${h}px`,
          borderRadius: circle ? h / 2 + 'px 0 0 ' + h / 2 + 'px' : 0,
          ...barStyle,
        };
      });

      const getContentStyleRef = computed(() => {
        const { height, width, contentStyle } = props;
        const h = `${parseInt(height as string)}px`;
        const w = `${parseInt(width as string)}px`;

        return {
          height: h,
          width: w,
          ...contentStyle,
        };
      });

      watch(
        () => state.isPassing,
        (isPassing) => {
          if (isPassing) {
            const { startTime, endTime } = state;
            const time = (endTime - startTime) / 1000;
            emit('success', { isPassing, time: time.toFixed(1) });
            emit('update:value', isPassing);
            emit('change', isPassing);
          }
        },
      );

      watchEffect(() => {
        state.isPassing = !!props.value;
      });

      function getEventPageX(e: MouseEvent | TouchEvent) {
        return (e as MouseEvent).pageX || (e as TouchEvent).touches[0].pageX;
      }

      function handleDragStart(e: MouseEvent | TouchEvent) {
        if (state.isPassing) {
          return;
        }
        const actionEl = unref(actionElRef);
        if (!actionEl) return;
        emit('start', e);
        state.moveDistance = getEventPageX(e) - parseInt(actionEl.style.left.replace('px', ''), 10);
        state.startTime = new Date().getTime();
        state.isMoving = true;
      }

      function getOffset(el: HTMLDivElement) {
        const actionWidth = parseInt(el.style.width);
        const { width } = props;
        const widthNum = parseInt(width as string);
        const offset = widthNum - actionWidth - 6;
        return { offset, widthNum, actionWidth };
      }

      function handleDragMoving(e: MouseEvent | TouchEvent) {
        const { isMoving, moveDistance } = state;
        if (isMoving) {
          const actionEl = unref(actionElRef);
          const barEl = unref(barElRef);
          if (!actionEl || !barEl) return;
          const { offset, widthNum, actionWidth } = getOffset(actionEl);
          const moveX = getEventPageX(e) - moveDistance;

          emit('move', {
            event: e,
            moveDistance,
            moveX,
          });
          if (moveX > 0 && moveX <= offset) {
            actionEl.style.left = `${moveX}px`;
            barEl.style.width = `${moveX + actionWidth / 2}px`;
          } else if (moveX > offset) {
            actionEl.style.left = `${widthNum - actionWidth}px`;
            barEl.style.width = `${widthNum - actionWidth / 2}px`;
            if (!props.isSlot) {
              checkPass();
            }
          }
        }
      }

      function handleDragOver(e: MouseEvent | TouchEvent) {
        const { isMoving, isPassing, moveDistance } = state;
        if (isMoving && !isPassing) {
          emit('end', e);
          const actionEl = unref(actionElRef);
          const barEl = unref(barElRef);
          if (!actionEl || !barEl) return;
          const moveX = getEventPageX(e) - moveDistance;
          const { offset, widthNum, actionWidth } = getOffset(actionEl);
          if (moveX < offset) {
            if (!props.isSlot) {
              resume();
            } else {
              setTimeout(() => {
                if (!props.value) {
                  resume();
                } else {
                  const contentEl = unref(contentElRef);
                  if (contentEl) {
                    contentEl.style.width = `${parseInt(barEl.style.width)}px`;
                  }
                }
              }, 0);
            }
          } else {
            actionEl.style.left = `${widthNum - actionWidth}px`;
            barEl.style.width = `${widthNum - actionWidth / 2}px`;
            checkPass();
          }
          state.isMoving = false;
        }
      }

      function checkPass() {
        if (props.isSlot) {
          resume();
          return;
        }
        state.endTime = new Date().getTime();
        state.isPassing = true;
        state.isMoving = false;
      }

      function resume() {
        state.isMoving = false;
        state.isPassing = false;
        state.moveDistance = 0;
        state.toLeft = false;
        state.startTime = 0;
        state.endTime = 0;
        const actionEl = unref(actionElRef);
        const barEl = unref(barElRef);
        const contentEl = unref(contentElRef);
        if (!actionEl || !barEl || !contentEl) return;
        state.toLeft = true;
        useTimeoutFn(() => {
          state.toLeft = false;
          actionEl.style.left = '0';
          barEl.style.width = '0';
          //  The time is consistent with the animation time
        }, 300);
        contentEl.style.width = unref(getContentStyleRef).width;
      }

      expose({
        resume,
      });

      return () => {
        const renderBar = () => {
          const cls = [`darg-verify-bar`];
          if (state.toLeft) {
            cls.push('to-left');
          }
          return <div class={cls} ref={barElRef} style={unref(getBarStyleRef)} />;
        };

        const renderContent = () => {
          const cls = [`darg-verify-content`];
          const { isPassing } = state;
          const { text, successText } = props;

          isPassing && cls.push('success');

          return (
            <div class={cls} ref={contentElRef} style={unref(getContentStyleRef)}>
              {getSlot(slots, 'text', isPassing) || (isPassing ? successText : text)}
            </div>
          );
        };

        const renderAction = () => {
          const cls = [`darg-verify-action`];
          const { toLeft, isPassing } = state;
          if (toLeft) {
            cls.push('to-left');
          }
          return (
            <div
              class={cls}
              onMousedown={handleDragStart}
              onTouchstart={handleDragStart}
              style={unref(getActionStyleRef)}
              ref={actionElRef}
            >
              {getSlot(slots, 'actionIcon', isPassing) ||
                (isPassing ? (
                  <CheckOutlined class={`darg-verify-action__icon`} />
                ) : (
                  <DoubleRightOutlined class={`darg-verify-action__icon`} />
                ))}
            </div>
          );
        };

        return (
          <div
            class="darg-verify"
            ref={wrapElRef}
            style={unref(getWrapStyleRef)}
            onMousemove={handleDragMoving}
            onTouchmove={handleDragMoving}
            onMouseleave={handleDragOver}
            onMouseup={handleDragOver}
            onTouchend={handleDragOver}
          >
            {renderBar()}
            {renderContent()}
            {renderAction()}
          </div>
        );
      };
    },
  });
</script>
<style lang="less">
  @radius: 4px;

  .darg-verify {
    position: relative;
    overflow: hidden;
    text-align: center;
    background-color: rgb(238 238 238);
    border: 1px solid #ddd;
    border-radius: @radius;

    &-bar {
      position: absolute;
      width: 0;
      height: 36px;
      background-color: @success-color;
      border-radius: @radius;

      &.to-left {
        width: 0 !important;
        transition: width 0.3s;
      }
    }

    &-content {
      position: absolute;
      top: 0;
      font-size: 12px;
      text-size-adjust: none;
      background-color: -webkit-gradient(
        linear,
        left top,
        right top,
        color-stop(0, #333),
        color-stop(0.4, #333),
        color-stop(0.5, #fff),
        color-stop(0.6, #333),
        color-stop(1, #333)
      );
      animation: slidetounlock 3s infinite;
      background-clip: text;
      user-select: none;

      &.success {
        -webkit-text-fill-color: @white;
      }

      & > * {
        -webkit-text-fill-color: #333;
      }
    }

    &-action {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      cursor: move;
      background-color: @white;
      border-radius: @radius;
      justify-content: center;
      align-items: center;

      &__icon {
        cursor: inherit;
      }

      &.to-left {
        left: 0 !important;
        transition: left 0.3s;
      }
    }
  }

  @keyframes slidetounlock {
    0% {
      background-position: -120px 0;
    }

    100% {
      background-position: 120px 0;
    }
  }
</style>
