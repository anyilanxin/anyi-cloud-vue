<!--
 * Copyright (c) 2023-present ZHOUXUANHONG(安一老厨)<anyilanxin@aliyun.com>
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
 *   7.进行商用时，不得基于AnYi Cloud Vue的基础，修改包装而成一个与AnYi Cloud EE、AnYi Zeebe EE、AnYi Standalone EE功能类似的程序，进行销售或发布，参与同类软件产品市场的竞争；
 *   8.本软件使用的第三方依赖皆为开源软件，如需要修改第三方源码请遵循第三方源码附带开源协议；
 *   9.本软件中使用了bpmn js,使用请遵循bpmn.io开源协议：
 *     https://github.com/bpmn-io/bpmn-js/blob/develop/LICENSE
 *   10.若您的项目无法满足以上几点，可申请商业授权。
 -->
<template>
  <div>
    <input
      ref="inputRef"
      type="file"
      v-show="false"
      accept=".xlsx, .xls"
      @change="handleInputClick"
    />
    <div @click="handleUpload">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import * as XLSX from 'xlsx';
  import { dateUtil } from '/@/utils/dateUtil';

  import type { ExcelData } from './typing';
  export default defineComponent({
    name: 'ImportExcel',
    props: {
      // 日期时间格式。如果不提供或者提供空值，将返回原始Date对象
      dateFormat: {
        type: String,
      },
      // 时区调整。实验性功能，仅为了解决读取日期时间值有偏差的问题。目前仅提供了+08:00时区的偏差修正值
      // https://github.com/SheetJS/sheetjs/issues/1470#issuecomment-501108554
      timeZone: {
        type: Number,
        default: 8,
      },
    },
    emits: ['success', 'error'],
    setup(props, { emit }) {
      const inputRef = ref<HTMLInputElement | null>(null);
      const loadingRef = ref<Boolean>(false);

      /**
       * @description: 第一行作为头部
       */
      function getHeaderRow(sheet: XLSX.WorkSheet) {
        if (!sheet || !sheet['!ref']) return [];
        const headers: string[] = [];
        // A3:B7=>{s:{c:0, r:2}, e:{c:1, r:6}}
        const range = XLSX.utils.decode_range(sheet['!ref']);

        const R = range.s.r;
        /* start in the first row */
        for (let C = range.s.c; C <= range.e.c; ++C) {
          /* walk every column in the range */
          const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
          /* find the cell in the first row */
          let hdr = 'UNKNOWN ' + C; // <-- replace with your desired default
          if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
          headers.push(hdr);
        }
        return headers;
      }

      /**
       * @description: 获得excel数据
       */
      function getExcelData(workbook: XLSX.WorkBook) {
        const excelData: ExcelData[] = [];
        const { dateFormat, timeZone } = props;
        for (const sheetName of workbook.SheetNames) {
          const worksheet = workbook.Sheets[sheetName];
          const header: string[] = getHeaderRow(worksheet);
          let results = XLSX.utils.sheet_to_json(worksheet, {
            raw: true,
            dateNF: dateFormat, //Not worked
          }) as object[];
          results = results.map((row: object) => {
            for (let field in row) {
              if (row[field] instanceof Date) {
                if (timeZone === 8) {
                  row[field].setSeconds(row[field].getSeconds() + 43);
                }
                if (dateFormat) {
                  row[field] = dateUtil(row[field]).format(dateFormat);
                }
              }
            }
            return row;
          });

          excelData.push({
            header,
            results,
            meta: {
              sheetName,
            },
          });
        }
        return excelData;
      }

      /**
       * @description: 读取excel数据
       */
      function readerData(rawFile: File) {
        loadingRef.value = true;
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const data = e.target && e.target.result;
              const workbook = XLSX.read(data, { type: 'array', cellDates: true });
              // console.log(workbook);
              /* DO SOMETHING WITH workbook HERE */
              const excelData = getExcelData(workbook);
              emit('success', excelData);
              resolve('');
            } catch (error) {
              reject(error);
              emit('error');
            } finally {
              loadingRef.value = false;
            }
          };
          reader.readAsArrayBuffer(rawFile);
        });
      }

      async function upload(rawFile: File) {
        const inputRefDom = unref(inputRef);
        if (inputRefDom) {
          // fix can't select the same excel
          inputRefDom.value = '';
        }
        await readerData(rawFile);
      }

      /**
       * @description: 触发选择文件管理器
       */
      function handleInputClick(e: Event) {
        const files = e && (e.target as HTMLInputElement).files;
        const rawFile = files && files[0]; // only setting files[0]
        if (!rawFile) return;
        upload(rawFile);
      }

      /**
       * @description: 点击上传按钮
       */
      function handleUpload() {
        const inputRefDom = unref(inputRef);
        inputRefDom && inputRefDom.click();
      }

      return { handleUpload, handleInputClick, inputRef };
    },
  });
</script>
