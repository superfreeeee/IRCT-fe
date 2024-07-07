import Avatar from '@/components/Avatar';
import { I } from '@/components/BoxIcon/styles';
import { EntityType } from '@/views/Main/state/okrDB/type';
import styled from 'styled-components';

const headerBgColorMap: { [type in EntityType]: string } = {
  [EntityType.User]: 'transparent',
  [EntityType.O]: '#8DBBBE',
  [EntityType.KR]: '#8DBBBE',
  [EntityType.Project]: '#9485BF',
  [EntityType.Todo]: '#BC8D73',
};

export const headerPointColorMap: { [type in EntityType]: string } = {
  [EntityType.User]: 'transparent',
  [EntityType.O]: '#B9EBEE',
  [EntityType.KR]: '#B9EBEE',
  [EntityType.Project]: '#C2ADFF',
  [EntityType.Todo]: '#FCB993',
};

export const EditEntityModalMask = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: rgba(23, 23, 23, 0.5);
`;

export const EditEntityModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  min-width: 380px;

  color: #fff;
`;

export const EditEntityModalHeader = styled.div<{ type: EntityType }>`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  width: 100%;
  padding: 15px 0;
  border-radius: 10px;
  background-color: ${({ type }) => headerBgColorMap[type]};

  .actions {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

export const EditEntityModalMain = styled.div`
  border-radius: 10px;
  background-color: rgba(102, 103, 104, 0.9);
  padding: 16px;

  .deleteText {
    margin-bottom: 20px;
    text-align: center;
  }
`;

export const EditEntityModalMainActions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
`;

export const EditEntityModalBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 110px;
  height: 28px;
  border: 0;
  border-radius: 6px;
  color: #fff;
  background-color: #444546;

  &.primary {
    color: #060606;
    background-color: #dedede;
  }
`;

export const EditContentTextArea = styled.textarea`
  display: block;
  width: 100%;
  padding: 6px 10px;
  margin: 0;
  border: 0;
  border-radius: 5px;
  outline: 0;
  color: rgba(255, 255, 255, 0.5);
  background-color: rgba(37, 37, 37, 0.6);
  box-shadow: 0 2px 5px inset rgba(0, 0, 0, 0.32);
  resize: none;
`;

export const EditContentUserList = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;

  padding-left: 10px;
  margin: 6px 0 10px;

  font-size: 12px;

  &.reverIcon > ${I} {
    transform: rotate(180deg);
  }

  ${Avatar} {
    position: relative;

    width: 20px;
    height: 20px;

    .removeMask {
      position: absolute;

      display: none;
      justify-content: center;
      align-items: center;

      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }

    &:hover .removeMask {
      display: flex;
    }
  }

  .addNewBtn {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 20px;
    height: 20px;
    border-radius: 50%;
    color: #fff;
    background-color: #474849;
  }
`;
