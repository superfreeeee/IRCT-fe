import { AppIconWrapper } from '@components/AppIcon';
import Avatar from '@components/Avatar';
import styled from 'styled-components';

export const VideoRoomContainer = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
  max-height: 100%;
  padding: 0 30px 83px;
  z-index: 1;
  overflow: auto;
`;

export const VideoBlockContainer = styled.div`
  overflow: hidden;
  transform: translateX(0);
  transition: transform var(--trans_speed_level3), opacity var(--trans_speed_level2);
  animation: fadeIn 0.4s ease-in;

  @keyframes fadeIn {
    0% {
      transform: translateX(-100px);
    }

    100% {
      transform: translateX(0);
    }
  }

  /* 外部宽度 773 */
  /* 3 列 = 773 + 230 * 3 + 10 * 2 */
  @media (min-width: 1483px) {
    width: calc(33% - 7px);

    &.sm {
      width: calc(21% - 2px);
    }
  }
  /* 2 列 = 773 + 230 * 2 + 10 */
  @media (min-width: 1243px) and (max-width: 1483px) {
    width: calc(50% - 5px);

    &.sm {
      width: calc(32.5% - 2.5px);
    }
  }
  /* 1 列 = 773 + _ */
  @media (max-width: 1243px) {
    width: 100%;

    &.sm {
      width: 65%;
    }
  }

  &.hidden {
    transform: translateY(-100%);
    animation: none;
    opacity: 0;
  }
`;

export const VideoBlockWrapper = styled.div`
  position: relative;
  padding-top: 56.25%;
`;

export const VideoBlockContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-color: #666666;
  overflow: hidden;
  transition: all var(--trans_speed_level3);

  &.hide {
    background-color: #171717;
  }

  /* 位于中央的 Avatar */
  & > ${Avatar} {
    width: 70px;
    height: 70px;
    animation: showAvatar 0.25s linear;
  }

  @keyframes showAvatar {
    0% {
      width: 0;
      height: 0;
    }

    100% {
      width: 70px;
      height: 70px;
    }
  }

  .video {
    width: 100%;
  }

  ${AppIconWrapper} {
    right: 5px;
    bottom: 5px;
  }
`;

export const VideoBlockTitle = styled.div`
  position: absolute;
  left: 10px;
  bottom: 6px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 12px;
  line-height: 20px;
  color: #fff;

  ${Avatar} {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    transition: all var(--trans_speed_level3);

    &.hideVideo {
      width: 0;
      height: 0;
      margin: 0;
    }
  }
`;

export const VideoRoomControllerContainer = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  box-sizing: content-box;
  width: 100%;
  height: 40px;
  padding: 20px 0 23px;
  background-color: var(--container_bg);
`;
