import React, { FC, useEffect, useRef } from 'react';

import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import {
  ChatContainer,
  ChatHistory,
  ChatInputBar,
  Input,
  SendButton,
} from './styles';
import { useEnterListener, useInput } from './hooks';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@store/reducers';
import ChatRecordEl from './ChatRecordEl';
import { sendChatMessageAction } from '@store/reducers/space';
import { bindActionCreators } from 'redux';
import { scrollToBottom } from '@utils';

interface ChatProps {
  isInRoom?: boolean;
  onSend?: (message: string) => void;
}

const Chat: FC<ChatProps> = ({ isInRoom = false, onSend }) => {
  const userId = useSelector((state: AppState) => state.user.id);

  const space = useSelector((state: AppState) => state.space);
  const selectedTeam = useSelector((state: AppState) => state.team.selected);
  const selectedRoom = useSelector((state: AppState) => state.room.selected);

  const chatHistory = isInRoom ? space.roomChat : space.teamChat;
  const selected = isInRoom ? selectedRoom : selectedTeam;
  const records = chatHistory[selected] || [];

  // TODO clear console
  useEffect(() => {
    console.log(
      `[Chat] space.${isInRoom ? 'room' : 'team'}Chat[${selected}] records =`,
      records
    );
  }, [chatHistory[selected]]);

  const [input, onInputChange, { resetInput }] = useInput();

  const dispatch = useDispatch();
  const sendChatMessage = bindActionCreators(sendChatMessageAction, dispatch);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const sendMessage = (input: string) => {
    console.log(`[Chat] send message = ${input}`);

    sendChatMessage({
      spaceId: selected,
      record: {
        userId,
        text: input,
      },
    });

    setTimeout(() => {
      scrollToBottom(chatHistoryRef.current);
    });

    onSend && onSend(input);
  };

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
    <ChatContainer>
      <ChatHistory ref={chatHistoryRef}>
        {records.map((record, index) => (
          <ChatRecordEl key={index} record={record} />
        ))}
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
