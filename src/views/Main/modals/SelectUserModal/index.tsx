import React, { useCallback, useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { CandidatesList, SearchBar, SelectUserModalContainer } from './styles';
import classNames from 'classnames';

import { selectUserModalControllerInfoState } from '@views/Main/state/modals/selectUserModal';
import { TeamData } from '@views/Main/state/team';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import useInput from '@hooks/useInput';
import useClickDetect from '@hooks/useClickDetect';
import useKeyDetect from '@hooks/useKeyDetect';
import Candidate from './Candidate';

/**
 * 选人组件
 */
const SelectUserModal = () => {
  const [{ visible, position, selectable, candidateUsers }, setControllerInfo] =
    useRecoilState(selectUserModalControllerInfoState);

  const [searchText, onTextChange] = useInput();

  const filteredUsers = searchText
    ? candidateUsers.filter((user) => user.name.includes(searchText))
    : candidateUsers;

  const onSelected = useCallback(
    (user: TeamData) => {
      if (selectable) {
        console.log(`[SelectUserModal] select ${user.id}`, user);
        setControllerInfo({
          visible: false,
          selectedUserId: user.id,
        });
      }
    },
    [selectable],
  );

  const cancel = () => {
    // cancel selection
    setControllerInfo({
      visible: false,
      selectedUserId: '',
    });
  };

  const containerRef = useRef<HTMLDivElement>(null);
  useClickDetect(
    containerRef,
    (isOutside) => {
      if (isOutside) {
        cancel();
      }
    },
    visible,
  );

  useKeyDetect(
    'Escape',
    () => {
      cancel();
    },
    visible,
  );

  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (visible) {
      // 新打开时回滚到顶部
      if (listRef.current.scrollTop > 0) {
        listRef.current.scrollTop = 0;
      }
    }
  }, [visible]);

  return (
    <SelectUserModalContainer
      ref={containerRef}
      className={classNames({ visible })}
      style={{ ...position }}
    >
      {/* 搜索框 */}
      <SearchBar>
        <BoxIcon type={BoxIconType.Search} />
        <input
          id="search-candidate"
          placeholder="Search for member"
          type="text"
          value={searchText}
          onChange={onTextChange}
        />
      </SearchBar>
      <CandidatesList ref={listRef} className={classNames({ selectable })}>
        {filteredUsers.map(({ id: userId }) => (
          <Candidate key={userId} userId={userId} onSelected={onSelected} />
        ))}
      </CandidatesList>
    </SelectUserModalContainer>
  );
};

export default SelectUserModal;
