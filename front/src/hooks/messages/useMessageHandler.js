import { useContext } from 'react';
import { MessageContext } from 'contexts/messages';

export const useMessageHandler = () => (
  useContext(MessageContext)
);
