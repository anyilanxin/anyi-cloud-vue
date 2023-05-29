<!--
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
 *   7.进行商用时，不得基于AnYi Cloud Vue 的基础，修改包装而成一个与AnYi Zeebe EE、AnYi Cloud EE功能类似的程序，进行销售或发布，参与同类软件产品市场的竞争；
 *   8.本软件使用的第三方依赖皆为开源软件，如需要修改第三方源码请遵循第三方源码附带开源协议；
 *   9.本软件流程部分请遵循camunda开源协议：
 *     https://docs.camunda.org/manual/latest/introduction/third-party-libraries
 *     https://github.com/camunda/camunda-bpm-platform/blob/master/LICENSE
 *   10.若您的项目无法满足以上几点，可申请商业授权。
 -->
<script lang="tsx">
  import { defineComponent, CSSProperties, watch, nextTick } from 'vue';
  import { fileListProps } from './props';
  import { isFunction } from '/@/utils/is';
  import { useModalContext } from '/@/components/Modal/src/hooks/useModalContext';

  export default defineComponent({
    name: 'FileList',
    props: fileListProps,
    setup(props) {
      const modalFn = useModalContext();
      watch(
        () => props.dataSource,
        () => {
          nextTick(() => {
            modalFn?.redoModalHeight?.();
          });
        },
      );
      return () => {
        const { columns, actionColumn, dataSource } = props;
        const columnList = [...columns, actionColumn];
        return (
          <table class="file-table">
            <colgroup>
              {columnList.map((item) => {
                const { width = 0, dataIndex } = item;
                const style: CSSProperties = {
                  width: `${width}px`,
                  minWidth: `${width}px`,
                };
                return <col style={width ? style : {}} key={dataIndex} />;
              })}
            </colgroup>
            <thead>
              <tr class="file-table-tr">
                {columnList.map((item) => {
                  const { title = '', align = 'center', dataIndex } = item;
                  return (
                    <th class={['file-table-th', align]} key={dataIndex}>
                      {title}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {dataSource.map((record = {}, index) => {
                return (
                  <tr class="file-table-tr" key={`${index + record.name || ''}`}>
                    {columnList.map((item) => {
                      const { dataIndex = '', customRender, align = 'center' } = item;
                      const render = customRender && isFunction(customRender);
                      return (
                        <td class={['file-table-td', align]} key={dataIndex}>
                          {render
                            ? customRender?.({ text: record[dataIndex], record })
                            : record[dataIndex]}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        );
      };
    },
  });
</script>
<style lang="less">
  .file-table {
    width: 100%;
    border-collapse: collapse;

    .center {
      text-align: center;
    }

    .left {
      text-align: left;
    }

    .right {
      text-align: right;
    }

    &-th,
    &-td {
      padding: 12px 8px;
    }

    thead {
      background-color: @background-color-light;
    }

    table,
    td,
    th {
      border: 1px solid @border-color-base;
    }
  }
</style>
