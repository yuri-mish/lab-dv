import { useContext, useEffect, useState } from 'react';
import { MessageContext } from 'contexts/messages';

export const useMessageVars = (varNames = [], skip = false) => {
  const messageHandler = useContext(MessageContext);
  const [ values, setValues ] = useState(messageHandler.getVars(varNames));

  useEffect(() => {
    let unsubscribe;
    if (!skip) {
      unsubscribe = messageHandler.subscribeVars(varNames, (vals) => {
        setValues(vals);
      });
    }

    return () => {
      unsubscribe?.();
    };
  }, [ ...varNames, skip ]);

  return values;
};
