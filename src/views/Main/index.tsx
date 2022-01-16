import React, { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import StatusBar from './StatusBar';
import IM from './IM';
import RoomSpace from './RoomSpace';
import AppSidebar from './AppSidebar';
import CallModal from './CallModal';
import { MainContainer } from './styles';

import { teamDataListState } from './state/team';
import { roomDataListState } from './state/room';
import { allChatRecordsState } from './state/roomSpace';
import {
  initAllChatRecords,
  initRoomDataList,
  initTeamDataList,
} from './config';

const useInit = () => {
  const setTeamDataList = useSetRecoilState(teamDataListState);
  const setRoomDataList = useSetRecoilState(roomDataListState);
  const setAllChatRecords = useSetRecoilState(allChatRecordsState);
  useRecoilState(allChatRecordsState);

  useEffect(() => {
    // init data

    // 初始化用户信息
    setTeamDataList(initTeamDataList);
    // 初始化房间信息
    setRoomDataList(initRoomDataList);
    // TODO 初始化空间位置信息
    // 初始化聊天记录
    setAllChatRecords(initAllChatRecords);
  }, []);
};

const Main = () => {
  useInit();

  console.log(`>>>>>>>> render Main`);

  return (
    <MainContainer>
      <StatusBar />
      <IM />
      <RoomSpace />
      <AppSidebar />
      <CallModal />
    </MainContainer>
  );
};

export default Main;
