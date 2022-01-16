import Avatar from '@components/Avatar';
import styled from 'styled-components';

export const CallModalContainer = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 400px;
  padding: 22px 22px 24px;
  border-radius: 10px;
  color: #fff;
  background-color: rgba(102, 103, 104, 0.7);
  backdrop-filter: blur(2px);
  transform: translate(-50%, -50%);
  z-index: 2000;

  &.hide {
    display: none;
  }

  ${Avatar} {
    width: 70px;
    height: 70px;
  }

  .title {
    font-size: 16px;
  }

  .description {
    font-size: 12px;

    &.loading::after {
      content: '';
      display: inline-block;
      width: 10px;
      animation: loading infinite 1.5s;
    }
  }

  @keyframes loading {
    0% { content: '' }
    25% { content: '.' }
    50% { content: '..' }
    75% { content: '...' }
  }
`;

export const CallModalOptions = styled.div`
  display: flex;
  align-items: center;
  margin-top: 18px;
`;
