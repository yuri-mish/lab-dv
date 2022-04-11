import { useState, useEffect, useCallback, useRef } from 'react';
import { useHistory, useParams } from 'react-router';
import { useDocChangeListener } from '.';
import { NEW_DOC_ID } from 'app-constants';
import { showError, showSuccess } from 'utils/notify';
import { messages } from 'messages';
import { isEqual } from 'lodash';

export const useDocState = ({
  className,
  defaultData,
  isDocNew,
  load,
  update,
  onLoaded,
  onUpdated,
  onError,
}) => {
  const { id } = useParams();
  const history = useHistory();
  isDocNew = isDocNew ?? (id === NEW_DOC_ID);
  const [ state, setState ] = useState({
    loading: true,
    data: defaultData,
  });

  const skip = useRef(false);

  const handleError = useCallback((e) => {
    console.error(e);
    if (onError) {
      onError(e);
    } else {
      showError(messages.PAGE_LOAD_FAILED);
      history.goBack();
    }
  }, []);

  const handelUpdate = useCallback(() => {
    showSuccess(messages.DOC_UPDATED);
  }, []);

  const loaded = useCallback(() => {
    setState((prev) => ({ ...prev, loading: false }));
  }, []);


  const loadDoc = (cb, loadFunc) => {
    Promise.resolve(loadFunc(id))
      .then((data) => {
        Promise.resolve(update(state.data, data))
          .then((newData) => {
            if (!isEqual(newData, state.data)) {
              setState((prev) => ({ ...prev, data: newData }));
              cb?.(newData);
            }
            loaded();
          })
          .catch((e) => handleError(e));
      })
      .catch((e) => {
        handleError(e);
        loaded();
      });
  };

  useDocChangeListener(className, () => {
    if (skip.current) {
      skip.current = false;
    } else {
      loadDoc(onUpdated ? onUpdated : handelUpdate, load);
    }
  }, id);

  const preSave = () => {
    skip.current = true;
  };

  const setData = useCallback((update) => {
    setState((prev) => ({ ...prev, data: update(prev.data) }));
  }, [ setState ]);

  useEffect(() => {
    if (isDocNew) {
      loadDoc(null, () => defaultData);
    } else {
      loadDoc(onLoaded, load);
    }
  }, [ id ]);

  return [
    state.data,
    setData,
    { loading: state.loading, isDocNew, preSave },
  ];
};

