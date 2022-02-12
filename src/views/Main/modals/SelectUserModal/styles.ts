import styled from 'styled-components';

import Avatar from '@components/Avatar';
import { I } from '@components/BoxIcon/styles';
import StatusPoint from '@components/StatusPoint';

export const SELECT_USER_MODAL_WIDTH = 150;
const OUTER_PADDING = 5;

export const SelectUserModalContainer = styled.div`
  position: fixed;

  display: none;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;

  width: ${SELECT_USER_MODAL_WIDTH}px;
  max-height: 200px;
  border-radius: 5px;
  border: 1px solid #626466;

  color: #fff;
  background-color: #2e2e2f;
  overflow: hidden;
  z-index: var(--z_index_level2);

  &.visible {
    display: flex;
  }
`;

export const SearchBar = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  margin: ${OUTER_PADDING}px;
  border-radius: 5px;
  color: #dbdbdb;
  background-color: rgba(37, 37, 37, 0.6);
  overflow: hidden;

  ${I} {
    margin: 3px 3px 3px 5px;
  }

  #search-candidate {
    width: 110px;
    font-size: 12px;
    color: #dbdbdb;
    background-color: transparent;
  }
`;

export const CandidatesList = styled.ul`
  flex: 1;
  padding: 0 4px;
  margin-bottom: ${OUTER_PADDING}px;
  margin-top: 3px;
  overflow: auto;
`;

export const CandidateWrapper = styled.li`
  display: flex;
  align-items: center;
  padding: 3px 4px;
  border-radius: 3px;

  ${CandidatesList}.selectable &:hover {
    background-color: #474849;
  }

  .info {
    flex: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .name {
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  ${Avatar} {
    flex-shrink: 0;
    width: 23px;
    height: 23px;
    margin-right: 6px;
  }

  ${StatusPoint} {
    margin: 0 6px;
  }
`;
