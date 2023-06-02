/*
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
 *   4.分发源码时候，请注明软件出处 https://github.com/anyilanxin/anyi-cloud-vue；
 *   5.在修改包名，模块名称，项目代码等时，请注明软件出处 https://github.com/anyilanxin/anyi-cloud-vue；
 *   6.本软件不允许在国家法律规定范围外使用，如出现违法行为原作者本人不承担任何法律风险；
 *   7.进行商用时，不得基于AnYi Cloud Vue的基础，修改包装而成一个与AnYi Zeebe EE、AnYi Cloud EE、AnYi Cloud EE Vue功能类似的程序，进行销售或发布，参与同类软件产品市场的竞争；
 *   8.本软件使用的第三方依赖皆为开源软件，如需要修改第三方源码请遵循第三方源码附带开源协议；
 *   9.本软件中使用了bpmn js,使用请遵循bpmn.io开源协议：
 *     https://github.com/bpmn-io/bpmn-js/blob/develop/LICENSE
 *   10.若您的项目无法满足以上几点，可申请商业授权。
 */
import type { Directive } from 'vue';
import './index.less';
export interface RippleOptions {
  event: string;
  transition: number;
}

export interface RippleProto {
  background?: string;
  zIndex?: string;
}

export type EventType = Event & MouseEvent & TouchEvent;

const options: RippleOptions = {
  event: 'mousedown',
  transition: 400,
};

const RippleDirective: Directive & RippleProto = {
  beforeMount: (el: HTMLElement, binding) => {
    if (binding.value === false) return;

    const bg = el.getAttribute('ripple-background');
    setProps(Object.keys(binding.modifiers), options);

    const background = bg || RippleDirective.background;
    const zIndex = RippleDirective.zIndex;

    el.addEventListener(options.event, (event: EventType) => {
      rippler({
        event,
        el,
        background,
        zIndex,
      });
    });
  },
  updated(el, binding) {
    if (!binding.value) {
      el?.clearRipple?.();
      return;
    }
    const bg = el.getAttribute('ripple-background');
    el?.setBackground?.(bg);
  },
};

function rippler({
  event,
  el,
  zIndex,
  background,
}: { event: EventType; el: HTMLElement } & RippleProto) {
  const targetBorder = parseInt(getComputedStyle(el).borderWidth.replace('px', ''));
  const clientX = event.clientX || event.touches[0].clientX;
  const clientY = event.clientY || event.touches[0].clientY;

  const rect = el.getBoundingClientRect();
  const { left, top } = rect;
  const { offsetWidth: width, offsetHeight: height } = el;
  const { transition } = options;
  const dx = clientX - left;
  const dy = clientY - top;
  const maxX = Math.max(dx, width - dx);
  const maxY = Math.max(dy, height - dy);
  const style = window.getComputedStyle(el);
  const radius = Math.sqrt(maxX * maxX + maxY * maxY);
  const border = targetBorder > 0 ? targetBorder : 0;

  const ripple = document.createElement('div');
  const rippleContainer = document.createElement('div');

  // Styles for ripple
  ripple.className = 'ripple';

  Object.assign(ripple.style ?? {}, {
    marginTop: '0px',
    marginLeft: '0px',
    width: '1px',
    height: '1px',
    transition: `all ${transition}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    borderRadius: '50%',
    pointerEvents: 'none',
    position: 'relative',
    zIndex: zIndex ?? '9999',
    backgroundColor: background ?? 'rgba(0, 0, 0, 0.12)',
  });

  // Styles for rippleContainer
  rippleContainer.className = 'ripple-container';
  Object.assign(rippleContainer.style ?? {}, {
    position: 'absolute',
    left: `${0 - border}px`,
    top: `${0 - border}px`,
    height: '0',
    width: '0',
    pointerEvents: 'none',
    overflow: 'hidden',
  });

  const storedTargetPosition =
    el.style.position.length > 0 ? el.style.position : getComputedStyle(el).position;

  if (storedTargetPosition !== 'relative') {
    el.style.position = 'relative';
  }

  rippleContainer.appendChild(ripple);
  el.appendChild(rippleContainer);

  Object.assign(ripple.style, {
    marginTop: `${dy}px`,
    marginLeft: `${dx}px`,
  });

  const {
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
  } = style;
  Object.assign(rippleContainer.style, {
    width: `${width}px`,
    height: `${height}px`,
    direction: 'ltr',
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
  });

  setTimeout(() => {
    const wh = `${radius * 2}px`;
    Object.assign(ripple.style ?? {}, {
      width: wh,
      height: wh,
      marginLeft: `${dx - radius}px`,
      marginTop: `${dy - radius}px`,
    });
  }, 0);

  function clearRipple() {
    setTimeout(() => {
      ripple.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    }, 250);

    setTimeout(() => {
      rippleContainer?.parentNode?.removeChild(rippleContainer);
    }, 850);
    el.removeEventListener('mouseup', clearRipple, false);
    el.removeEventListener('mouseleave', clearRipple, false);
    el.removeEventListener('dragstart', clearRipple, false);
    setTimeout(() => {
      let clearPosition = true;
      for (let i = 0; i < el.childNodes.length; i++) {
        if ((el.childNodes[i] as Recordable).className === 'ripple-container') {
          clearPosition = false;
        }
      }

      if (clearPosition) {
        el.style.position = storedTargetPosition !== 'static' ? storedTargetPosition : '';
      }
    }, options.transition + 260);
  }

  if (event.type === 'mousedown') {
    el.addEventListener('mouseup', clearRipple, false);
    el.addEventListener('mouseleave', clearRipple, false);
    el.addEventListener('dragstart', clearRipple, false);
  } else {
    clearRipple();
  }

  (el as Recordable).setBackground = (bgColor: string) => {
    if (!bgColor) {
      return;
    }
    ripple.style.backgroundColor = bgColor;
  };
}

function setProps(modifiers: Recordable, props: Recordable) {
  modifiers.forEach((item: Recordable) => {
    if (isNaN(Number(item))) props.event = item;
    else props.transition = item;
  });
}

export default RippleDirective;
