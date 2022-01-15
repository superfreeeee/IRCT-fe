import React, { FC, useCallback, useEffect, useRef } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import { AppState } from '@store/reducers';
import { sendChatMessageAction } from '@store/reducers/space';
import { getCurrentTime, scrollToBottom } from '@utils';
import { useEnterListener, useInput } from './hooks';
import ChatRecordEl from './ChatRecordEl';
import {
  ChatContainer,
  ChatHistory,
  ChatInputBar,
  Input,
  SendButton,
} from './styles';

interface ChatProps {
  isInRoom?: boolean;
  onSend?: (message: string) => void;
}

const Chat: FC<ChatProps> = ({ isInRoom = false, onSend }) => {
  const { id: userId, avatar: selfAvatar } = useSelector(
    (state: AppState) => state.user,
  );

  const space = useSelector((state: AppState) => state.space);
  const { selected: selectedTeam, list: userList } = useSelector(
    (state: AppState) => state.team,
  );
  const selectedRoom = useSelector((state: AppState) => state.room.selected);

  const chatHistory = isInRoom ? space.roomChat : space.teamChat;
  const selected = isInRoom ? selectedRoom : selectedTeam;
  const records = chatHistory[selected] || [];

  // 输入框
  const [input, onInputChange, { resetInput }] = useInput();

  const dispatch = useDispatch();
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const focusChatInput = useCallback(() => {
    if (document.activeElement !== chatInputRef.current) {
      chatInputRef.current.focus();
    }
  }, []);
  const sendMessage = (input: string) => {
    console.log(`[Chat] send message = ${input}`);
    if (input) {
      // only send when input not empty
      const sendChatMessage = bindActionCreators(
        sendChatMessageAction,
        dispatch,
      );
      sendChatMessage({
        spaceId: selected,
        record: {
          userId,
          avatar: selfAvatar,
          text: input,
          createTime: getCurrentTime(),
        },
      });

      // 发出讯息后自动滚动
      setTimeout(() => {
        scrollToBottom(chatHistoryRef.current);
      });

      onSend && onSend(input);
    }

    // refocus after sending message
    focusChatInput();
  };

  /**
   * 渲染聊天界面的时候，单击 Enter focus 到输入框上
   */
  useEffect(() => {
    const focusInputWhileEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        focusChatInput();
      }
    };

    document.addEventListener('keydown', focusInputWhileEnter);
    return () => {
      document.removeEventListener('keydown', focusInputWhileEnter);
    };
  }, []);

  /**
   * focus 输入框时监听 enter 输入
   * blur 时删除 enter 监听
   */
  const { setEnterListener, removeEnterListener, send } = useEnterListener({
    input,
    onSend: sendMessage,
    resetInput,
  });

  // init
  useEffect(() => {
    scrollToBottom(chatHistoryRef.current);
  }, []);

  return (
    <ChatContainer className={classNames({ isInRoom })}>
      <ChatHistory ref={chatHistoryRef}>
        {records
          .map((record) => {
            return record;
          })
          .map((record, index) => (
            <ChatRecordEl key={index} isInRoom={isInRoom} record={record} />
          ))}
      </ChatHistory>
      <ChatInputBar>
        <Input
          ref={chatInputRef}
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
