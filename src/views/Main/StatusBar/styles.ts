import styled from 'styled-components';

import { UserState } from '@/views/Main/state/type';
import Avatar from '@/components/Avatar';

export const StatusBarContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 80px;
  height: 100%;
`;

/**
 * 上半部 = 头像 + 状态条
 */
export const AvatarBlock = styled.div`
  width: 40px;
  margin: 30px auto 0;

  ${Avatar} {
    width: 40px;
    height: 40px;
    border-radius: 2px;
  }
`;

const stateToColor = (state: UserState) => `var(--state_${state})`;

export const StateUnderline = styled.div<{ state: UserState }>`
  width: 20px;
  height: 3px;
  margin-top: 2px;
  border-radius: 2px;
  background-color: ${({ state }) => stateToColor(state)};
`;

/**
 * 下半部 = 视频通话按钮 + 会议状态 + 设定 Icon
 */
export const StatusBarBottom = styled.div`
  .setting {
    margin: 25px auto 30px;
    font-size: 40px;
    color: #bbbbbb;
  }
`;

export const MeetingActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

export const MeetingActionBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-radius: 4px;
  font-size: 22px;
  color: #474849;
  background-color: #f1f1f1;
  transition: background-color var(--trans_speed_level2);
  user-select: none;

  &.off {
    color: #fff;
    background-color: #474849;
  }

  &.hangUp {
    color: #fff;
    background-color: #ed5538;
  }

  &.hangUp:active {
    background-color: #d79a8e;
  }

  &.disabled,
  &.disabled:active {
    background-color: #c4c4c4;
  }
`;

export const InMeetingIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 2px;
  font-size: 28px;
  color: #fff;
  background-color: #abd476;
  /* cursor: pointer; */
`;
