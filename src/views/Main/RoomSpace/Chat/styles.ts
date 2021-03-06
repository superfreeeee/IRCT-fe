import styled from 'styled-components';

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 22px 17px 23px;
  overflow: hidden;

  &.isInRoom {
    min-height: 200px;
  }
`;

export const ChatHistory = styled.div`
  flex: 1;
  padding-right: 14px;
  overflow: auto;
`;

interface ChatRecordWrapperProps {
  isSelf?: boolean;
}

const recordTextBg = ({ isSelf = false }) => {
  const suffix = isSelf ? 'self' : 'other';
  return `var(--room_space_chat_record_bg_${suffix})`;
};

export const ChatRecordWrapper = styled.div<ChatRecordWrapperProps>`
  display: flex;
  align-items: flex-start;
  justify-content: ${({ isSelf }) => (isSelf ? 'flex-end' : 'flex-start')};
  margin-bottom: 26px;
  color: #fff;

  &.simple {
    justify-content: flex-start;
    margin-bottom: 6px;
  }

  .avatar {
    width: 30px;
    height: 30px;
    ${({ isSelf }) => (isSelf ? 'margin-left' : 'margin-right')}: 12px;
    order: ${({ isSelf }) => (isSelf ? 3 : 1)};
  }

  .text {
    order: 2;
    max-width: calc(100% - 84px);
    padding: 8px 14px;
    border-radius: 10px;
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.16);
    background-color: ${recordTextBg};
    white-space: pre-line;
  }
`;

export const ChatInputBar = styled.div`
  display: flex;
  align-items: center;
  padding-top: 6px;
`;

export const SendButton = styled.div`
  margin-left: 10px;
  padding: 6px;
  color: #fff;
  /* cursor: pointer; */

  &:hover {
    border-radius: 10px;
    background-color: rgb(71, 72, 73);
  }

  & > i {
    transform: translate(2px, -1px) rotate(-45deg);
  }
`;

export const Input = styled.input`
  flex: 1;
  height: 32px;
  padding: 6px 12px;
  border: 0;
  outline: 0;
  border-radius: 10px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  background-color: #474849;
`;
