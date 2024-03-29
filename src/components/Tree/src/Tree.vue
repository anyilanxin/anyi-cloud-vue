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
<script lang="tsx">
  import type { CSSProperties } from 'vue';
  import type { FieldNames, TreeState, TreeItem, KeyType, CheckKeys, TreeActionType } from './tree';

  import {
    defineComponent,
    reactive,
    computed,
    unref,
    ref,
    watchEffect,
    toRaw,
    watch,
    onMounted,
  } from 'vue';
  import TreeHeader from './TreeHeader.vue';
  import { Tree, Spin, Empty } from 'ant-design-vue';
  import { TreeIcon } from './TreeIcon';
  import { ScrollContainer } from '/@/components/Container';
  import { omit, get, difference, cloneDeep } from 'lodash-es';
  import { isArray, isBoolean, isEmpty, isFunction } from '/@/utils/is';
  import { extendSlots, getSlot } from '/@/utils/helper/tsxHelper';
  import { filter, treeToList, eachTree } from '/@/utils/helper/treeHelper';
  import { useTree } from './useTree';
  import { useContextMenu } from '/@/hooks/web/useContextMenu';
  import { CreateContextOptions } from '/@/components/ContextMenu';
  import { treeEmits, treeProps } from './tree';
  import { createBEM } from '/@/utils/bem';

  export default defineComponent({
    name: 'BasicTree',
    inheritAttrs: false,
    props: treeProps,
    emits: treeEmits,
    setup(props, { attrs, slots, emit, expose }) {
      const [bem] = createBEM('tree');

      const state = reactive<TreeState>({
        checkStrictly: props.checkStrictly,
        expandedKeys: props.expandedKeys || [],
        selectedKeys: props.selectedKeys || [],
        checkedKeys: props.checkedKeys || [],
      });

      const searchState = reactive({
        startSearch: false,
        searchText: '',
        searchData: [] as TreeItem[],
      });

      const treeDataRef = ref<TreeItem[]>([]);

      const [createContextMenu] = useContextMenu();

      const getFieldNames = computed((): Required<FieldNames> => {
        const { fieldNames } = props;
        return {
          children: 'children',
          title: 'title',
          key: 'key',
          ...fieldNames,
        };
      });

      const getBindValues = computed(() => {
        let propsData = {
          blockNode: true,
          ...attrs,
          ...props,
          expandedKeys: state.expandedKeys,
          selectedKeys: state.selectedKeys,
          checkedKeys: state.checkedKeys,
          checkStrictly: state.checkStrictly,
          fieldNames: unref(getFieldNames),
          'onUpdate:expandedKeys': (v: KeyType[]) => {
            state.expandedKeys = v;
            emit('update:expandedKeys', v);
          },
          'onUpdate:selectedKeys': (v: KeyType[]) => {
            state.selectedKeys = v;
            emit('update:selectedKeys', v);
          },
          onCheck: (v: CheckKeys, e) => {
            let currentValue = toRaw(state.checkedKeys) as KeyType[];
            if (isArray(currentValue) && searchState.startSearch) {
              const { key } = unref(getFieldNames);
              currentValue = difference(currentValue, getChildrenKeys(e.node.$attrs.node[key]));
              if (e.checked) {
                currentValue.push(e.node.$attrs.node[key]);
              }
              state.checkedKeys = currentValue;
            } else {
              state.checkedKeys = v;
            }

            const rawVal = toRaw(state.checkedKeys);
            emit('update:value', rawVal);
            emit('check', rawVal, e);
          },
          onRightClick: handleRightClick,
        };
        return omit(propsData, 'treeData', 'class');
      });

      const getTreeData = computed((): TreeItem[] =>
        searchState.startSearch ? searchState.searchData : unref(treeDataRef),
      );

      const getNotFound = computed((): boolean => {
        return !getTreeData.value || getTreeData.value.length === 0;
      });

      const {
        deleteNodeByKey,
        insertNodeByKey,
        insertNodesByKey,
        filterByLevel,
        updateNodeByKey,
        getAllKeys,
        getChildrenKeys,
        getEnabledKeys,
        getSelectedNode,
      } = useTree(treeDataRef, getFieldNames);

      function getIcon(params: Recordable, icon?: string) {
        if (!icon) {
          if (props.renderIcon && isFunction(props.renderIcon)) {
            return props.renderIcon(params);
          }
        }
        return icon;
      }

      async function handleRightClick({ event, node }: Recordable) {
        const { rightMenuList: menuList = [], beforeRightClick } = props;
        let contextMenuOptions: CreateContextOptions = { event, items: [] };

        if (beforeRightClick && isFunction(beforeRightClick)) {
          let result = await beforeRightClick(node, event);
          if (Array.isArray(result)) {
            contextMenuOptions.items = result;
          } else {
            Object.assign(contextMenuOptions, result);
          }
        } else {
          contextMenuOptions.items = menuList;
        }
        if (!contextMenuOptions.items?.length) return;
        contextMenuOptions.items = contextMenuOptions.items.filter((item) => !item.hidden);
        createContextMenu(contextMenuOptions);
      }

      function setExpandedKeys(keys: KeyType[]) {
        state.expandedKeys = keys;
      }

      function getExpandedKeys() {
        return state.expandedKeys;
      }
      function setSelectedKeys(keys: KeyType[]) {
        state.selectedKeys = keys;
      }

      function getSelectedKeys() {
        return state.selectedKeys;
      }

      function setCheckedKeys(keys: CheckKeys) {
        state.checkedKeys = keys;
      }

      function getCheckedKeys() {
        return state.checkedKeys;
      }

      function checkAll(checkAll: boolean) {
        state.checkedKeys = checkAll ? getEnabledKeys() : ([] as KeyType[]);
      }

      function expandAll(expandAll: boolean) {
        state.expandedKeys = expandAll ? getAllKeys() : ([] as KeyType[]);
      }

      function onStrictlyChange(strictly: boolean) {
        state.checkStrictly = strictly;
      }

      watch(
        () => props.searchValue,
        (val) => {
          if (val !== searchState.searchText) {
            searchState.searchText = val;
          }
        },
        {
          immediate: true,
        },
      );

      watch(
        () => props.treeData,
        (val) => {
          if (val) {
            handleSearch(searchState.searchText);
          }
        },
      );

      function handleSearch(searchValue: string) {
        if (searchValue !== searchState.searchText) searchState.searchText = searchValue;
        emit('update:searchValue', searchValue);
        if (!searchValue) {
          searchState.startSearch = false;
          return;
        }
        const { filterFn, checkable, expandOnSearch, checkOnSearch, selectedOnSearch } =
          unref(props);
        searchState.startSearch = true;
        const { title: titleField, key: keyField } = unref(getFieldNames);

        const matchedKeys: string[] = [];
        searchState.searchData = filter(
          unref(treeDataRef),
          (node) => {
            const result = filterFn
              ? filterFn(searchValue, node, unref(getFieldNames))
              : node[titleField]?.includes(searchValue) ?? false;
            if (result) {
              matchedKeys.push(node[keyField]);
            }
            return result;
          },
          unref(getFieldNames),
        );

        if (expandOnSearch) {
          const expandKeys = treeToList(searchState.searchData).map((val) => {
            return val[keyField];
          });
          if (expandKeys && expandKeys.length) {
            setExpandedKeys(expandKeys);
          }
        }

        if (checkOnSearch && checkable && matchedKeys.length) {
          setCheckedKeys(matchedKeys);
        }

        if (selectedOnSearch && matchedKeys.length) {
          setSelectedKeys(matchedKeys);
        }
      }

      function handleClickNode(key: string, children: TreeItem[]) {
        if (!props.clickRowToExpand || !children || children.length === 0) return;
        if (!state.expandedKeys.includes(key)) {
          setExpandedKeys([...state.expandedKeys, key]);
        } else {
          const keys = [...state.expandedKeys];
          const index = keys.findIndex((item) => item === key);
          if (index !== -1) {
            keys.splice(index, 1);
          }
          setExpandedKeys(keys);
        }
      }

      watchEffect(() => {
        treeDataRef.value = props.treeData as TreeItem[];
      });

      onMounted(() => {
        const level = parseInt(props.defaultExpandLevel);
        if (level > 0) {
          state.expandedKeys = filterByLevel(level);
        } else if (props.defaultExpandAll) {
          expandAll(true);
        }
      });

      watchEffect(() => {
        state.expandedKeys = props.expandedKeys;
      });

      watchEffect(() => {
        state.selectedKeys = props.selectedKeys;
      });

      watchEffect(() => {
        state.checkedKeys = props.checkedKeys;
      });

      watch(
        () => props.value,
        () => {
          state.checkedKeys = toRaw(props.value || []);
        },
        { immediate: true },
      );

      watch(
        () => state.checkedKeys,
        () => {
          const v = toRaw(state.checkedKeys);
          emit('update:value', v);
          emit('change', v);
        },
      );

      watchEffect(() => {
        state.checkStrictly = props.checkStrictly;
      });

      const instance: TreeActionType = {
        setExpandedKeys,
        getExpandedKeys,
        setSelectedKeys,
        getSelectedKeys,
        setCheckedKeys,
        getCheckedKeys,
        insertNodeByKey,
        insertNodesByKey,
        deleteNodeByKey,
        updateNodeByKey,
        getSelectedNode,
        checkAll,
        expandAll,
        filterByLevel: (level: number) => {
          state.expandedKeys = filterByLevel(level);
        },
        setSearchValue: (value: string) => {
          handleSearch(value);
        },
        getSearchValue: () => {
          return searchState.searchText;
        },
      };

      function renderAction(node: TreeItem) {
        const { actionList } = props;
        if (!actionList || actionList.length === 0) return;
        return actionList.map((item, index) => {
          let nodeShow = true;
          if (isFunction(item.show)) {
            nodeShow = item.show?.(node);
          } else if (isBoolean(item.show)) {
            nodeShow = item.show;
          }

          if (!nodeShow) return null;

          return (
            <span key={index} class={bem('action')}>
              {item.render(node)}
            </span>
          );
        });
      }

      const treeData = computed(() => {
        const data = cloneDeep(getTreeData.value);
        eachTree(data, (item, _parent) => {
          const searchText = searchState.searchText;
          const { highlight } = unref(props);
          const {
            title: titleField,
            key: keyField,
            children: childrenField,
          } = unref(getFieldNames);

          const icon = getIcon(item, item.icon);
          const title = get(item, titleField);

          const searchIdx = searchText ? title.indexOf(searchText) : -1;
          const isHighlight =
            searchState.startSearch && !isEmpty(searchText) && highlight && searchIdx !== -1;
          const highlightStyle = `color: ${isBoolean(highlight) ? '#f50' : highlight}`;

          const titleDom = isHighlight ? (
            <span class={unref(getBindValues)?.blockNode ? `${bem('content')}` : ''}>
              <span>{title.substr(0, searchIdx)}</span>
              <span style={highlightStyle}>{searchText}</span>
              <span>{title.substr(searchIdx + (searchText as string).length)}</span>
            </span>
          ) : (
            title
          );
          item[titleField] = (
            <span
              class={`${bem('title')} pl-2`}
              onClick={handleClickNode.bind(null, item[keyField], item[childrenField])}
            >
              {slots?.title ? (
                getSlot(slots, 'title', item)
              ) : (
                <>
                  {icon && <TreeIcon icon={icon} />}
                  {titleDom}
                  <span class={bem('actions')}>{renderAction(item)}</span>
                </>
              )}
            </span>
          );
          return item;
        });
        return data;
      });

      expose(instance);

      return () => {
        const { title, helpMessage, toolbar, search, checkable } = props;
        const showTitle = title || toolbar || search || slots.headerTitle;
        const scrollStyle: CSSProperties = { height: 'calc(100% - 38px)' };
        return (
          <div class={[bem(), 'h-full', attrs.class]}>
            {showTitle && (
              <TreeHeader
                checkable={checkable}
                checkAll={checkAll}
                expandAll={expandAll}
                title={title}
                search={search}
                toolbar={toolbar}
                helpMessage={helpMessage}
                onStrictlyChange={onStrictlyChange}
                onSearch={handleSearch}
                searchText={searchState.searchText}
              >
                {extendSlots(slots)}
              </TreeHeader>
            )}
            <Spin spinning={unref(props.loading)} tip="加载中...">
              <ScrollContainer style={scrollStyle} v-show={!unref(getNotFound)}>
                <Tree {...unref(getBindValues)} showIcon={false} treeData={treeData.value} />
              </ScrollContainer>
              <Empty
                v-show={unref(getNotFound)}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                class="!mt-4"
              />
            </Spin>
          </div>
        );
      };
    },
  });
</script>
