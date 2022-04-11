import { useEffect, useImperativeHandle, useRef, useState } from 'react';

export const useSearchDatagridHandler = (
  ref, searchField, onSelectionChanged,
) => {
  const [ dataReady, setDataReady ] = useState(false);
  const currentRowDataRef = useRef(null);
  const gridRef = useRef();
  const focusElementRef = useRef();

  useEffect(() => {
    const instance = gridRef.current.instance;
    dataReady ? instance.endCustomLoading() : instance.beginCustomLoading();
  }, [ dataReady ]);

  useImperativeHandle(ref, () => ({
    loadData() {
      setDataReady(true);
    },

    search(value) {
      const instance = gridRef.current.instance;
      if (!value) {
        // Will return true if compare with dx empty filterValue
        value = null;
      }
      if (instance.columnOption(searchField, 'filterValue') !== value) {
        instance.columnOption(searchField, 'filterValue', value);
      }
    },

    moveDown() {
      const instance = gridRef.current.instance;
      let index = instance.getRowIndexByKey(instance.getSelectedRowKeys()[0]);
      index = Math.max(0, Math.min(instance.totalCount() - 1, index + 1));

      instance.selectRowsByIndexes(index);
      instance.navigateToRow(instance.getSelectedRowKeys()[0]);
    },

    moveUp() {
      const instance = gridRef.current.instance;
      let index = instance.getRowIndexByKey(instance.getSelectedRowKeys()[0]);
      index = Math.max(0, index - 1);

      instance.selectRowsByIndexes(index);
      instance.navigateToRow(instance.getSelectedRowKeys()[0]);
    },

    selectCurrent() {
      const instance = gridRef.current.instance;
      const index = instance.getRowIndexByKey(instance.getSelectedRowKeys()[0]);
      if (index >= 0) {
        const row = instance.getSelectedRowsData()[0];
        onSelectionChanged?.(row);
        currentRowDataRef.current = null;
      }
    },

    focus() {
      focusElementRef.current?.firstChild?.focus();
    },
  }), []);

  const onCurrentRowChange = (row) => {
    currentRowDataRef.current = row;
  };

  return {
    dataReady,
    gridRef,
    focusElementRef,
    onCurrentRowChange,
  };
};
