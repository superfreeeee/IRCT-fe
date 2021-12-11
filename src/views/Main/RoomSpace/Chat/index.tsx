import React, { FC, useEffect } from 'react';

import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import {
  ChatContainer,
  ChatHistory,
  ChatInputBar,
  Input,
  SendButton,
} from './styles';
import { useEnterListener, useInput } from './hooks';

interface ChatProps {
  isInRoom?: boolean;
  onSend?: (message: string) => void;
}

const Chat: FC<ChatProps> = ({ isInRoom = false, onSend }) => {
  const [input, onInputChange, { resetInput }] = useInput();

  useEffect(() => {
    console.log(`[Chat] input = ${input}`);
  }, [input]);

  const { setEnterListener, removeEnterListener, send } = useEnterListener([
    input,
    { onSend, resetInput },
  ]);

  return (
    <ChatContainer>
      <ChatHistory>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
        <div>Chat...</div>
      </ChatHistory>
      <ChatInputBar>
        <Input
          value={input}
          onChange={onInputChange}
          onFocus={setEnterListener}
          onBlur={removeEnterListener}
        />
        <SendButton onClick={send}>
          <BoxIcon type={BoxIconType.Send} size={'sm'} />
        </SendButton>
      </ChatInputBar>
    </ChatContainer>
  );
};

export default Chat;
