import React, { FC, useCallback, useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import classNames from 'classnames';

import { selectedRoomIdState, selectedTeamIdState } from '@views/Main/state/im';
import { currentUserIdState } from '@views/Main/state/user';
import {
  chatHistoryFamily,
  chatRecordsFamily,
} from '@views/Main/state/roomSpace';
import { getCurrentTime, scrollToBottom } from '@utils';
import { useEnterListener, useInput } from './hooks';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
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
}

const Chat: FC<ChatProps> = ({ isInRoom = false }) => {
  const userId = useRecoilValue(currentUserIdState);

  const selectedTeamId = useRecoilValue(selectedTeamIdState);
  const selectedRoomId = useRecoilValue(selectedRoomIdState);

  const selectedId = isInRoom ? selectedRoomId : selectedTeamId;
  const chatHistoryRecords = useRecoilValue(chatHistoryFamily(selectedId));

  // 输入框
  const [input, onInputChange, { resetInput }] = useInput();

  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  const focusChatInput = useCallback(() => {
    if (document.activeElement !== chatInputRef.current) {
      chatInputRef.current.focus();
    }
  }, []);

  const [chatRecords, setChatRecords] = useRecoilState(
    chatRecordsFamily(selectedId),
  );
  const sendMessage = (input: string) => {
    console.log(`[Chat] send message = ${input}`);

    // only send when input not empty
    if (input) {
      // 添加记录
      setChatRecords([
        ...chatRecords,
        {
          userId,
          text: input,
          createTime: getCurrentTime(),
        },
      ]);

      // 发出讯息后自动滚动
      setTimeout(() => {
        scrollToBottom(chatHistoryRef.current);
      });
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
        {chatHistoryRecords.map((record, index) => (
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
