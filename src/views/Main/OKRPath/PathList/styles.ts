import styled from 'styled-components';

import Avatar from '@components/Avatar';
import { EntityType } from '@views/Main/state/okrDB/type';

// ========== config ==========
enum TypePointExpandColor {
  None = 'transparent',
  O = '#6A7D7E',
  KR = '#6A7D7E',
  Project = '#665D7E',
  Todo = '#7D6253',
}

export const typePointExpandColorMap: {
  [type in EntityType]: TypePointExpandColor;
} = {
  [EntityType.User]: TypePointExpandColor.None,
  [EntityType.O]: TypePointExpandColor.O,
  [EntityType.KR]: TypePointExpandColor.KR,
  [EntityType.Project]: TypePointExpandColor.Project,
  [EntityType.Todo]: TypePointExpandColor.Todo,
};

enum TitleExpandColor {
  None = 'transparent',
  O = '#6A7D7E',
  KR = '#6A7D7E',
  Project = '#665D7E',
  Todo = '#7D6253',
}

const titleExpandColorMap: { [type in EntityType]: TitleExpandColor } = {
  [EntityType.User]: TitleExpandColor.None,
  [EntityType.O]: TitleExpandColor.O,
  [EntityType.KR]: TitleExpandColor.KR,
  [EntityType.Project]: TitleExpandColor.Project,
  [EntityType.Todo]: TitleExpandColor.Todo,
};

// ========== components ==========
export const OKRListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 280px;
  height: 100%;
  border-radius: 10px;
  color: #fff;
  background-color: var(--container_bg);

  &.hide {
    display: none;
  }
`;

export const OKRListHeader = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 26px;
  margin-bottom: 5px;

  ${Avatar} {
    width: 32px;
    height: 32px;
  }

  .info {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
  }
`;

export const OKRListContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

/**
 * O, KR, Project, Todo 详情
 */
export const DetailList = styled.div`
  position: relative;
  flex: 1;
  padding: 0 26px 36px 35px; // 多空一行半
  overflow-x: visible;
  overflow-y: auto;
`;

export const DetailLayer = styled.div`
  position: relative;
  font-size: 12px;
`;

export const DetailLayerBanner = styled.div<{ type: EntityType }>`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 24px;
  user-select: none;

  & > .title {
    padding: 0 3px;
    border-radius: 5px;
    font-size: 14px;
    transition: background-color var(--trans_speed_level2);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    /* // TODO change to active */
    &:hover {
      background-color: ${({ type }) =>
        titleExpandColorMap[type] || 'transparent'};
    }
  }
`;

export const DetailLayerContent = styled.div`
  flex: 1;
  display: flex;
  gap: 6px;

  &.hide {
    height: 0;
  }

  .expandLine {
    align-self: stretch;
    min-width: 1px;
    background-color: rgba(219, 219, 219, 0.5);
    margin: 0 7px;

    &.hide {
      background-color: transparent;
    }
  }

  .detail {
    flex: 1;
    overflow: hidden;
  }
`;

export const RelativeUsers = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

/**
 * 评论区
 */
export const CommentAreaContainer = styled.div`
  height: 250px;
`;
