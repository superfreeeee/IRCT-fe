import styled from 'styled-components';

export const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 22px 28px 26px 20px;
  overflow: hidden;
`;

export const ChatHistory = styled.div`
  flex: 1;
  overflow: auto;
`;

export const ChatInputBar = styled.div`
  display: flex;
  align-items: center;
  padding-top: 6px;
`;

export const SendButton = styled.div`
  margin-left: 10px;
  padding: 6px 15px;
  cursor: pointer;

  &:hover {
    border-radius: 10px;
    background-color: #b7b7b7;
  }

  i {
    transform: translateY(-1px) rotate(-45deg);
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
`;
