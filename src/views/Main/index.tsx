import React, { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import StatusBar from './StatusBar';
import IM from './IM';
import RoomSpace from './RoomSpace';
import AppSidebar from './AppSidebar';
import CallModal from './CallModal';
import { MainContainer } from './styles';

import { teamDataListState } from './state/team';
import { roomDataListState } from './state/room';
import { allChatRecordsState, allRoomSpaceInfoState } from './state/roomSpace';
import {
  initAllChatRecords,
  initAllRoomSpaceInfo,
  initRoomDataList,
  initTeamDataList,
} from './config';
import CreateMeetingModal from './CreateMeetingModal';

const useInit = () => {
  const setTeamDataList = useSetRecoilState(teamDataListState);
  const setRoomDataList = useSetRecoilState(roomDataListState);
  const setAllChatRecords = useSetRecoilState(allChatRecordsState);
  const setAllRoomSpaceInfo = useSetRecoilState(allRoomSpaceInfoState);

  // init data
  useEffect(() => {
    // 初始化用户信息
    setTeamDataList(initTeamDataList);
    // 初始化房间信息
    setRoomDataList(initRoomDataList);
    // 初始化空间位置信息
    setAllRoomSpaceInfo(initAllRoomSpaceInfo);
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
      {/* 请求语音 Modal */}
      <CallModal />
      {/* 创建永久会议室 Modal */}
      <CreateMeetingModal />
    </MainContainer>
  );
};

export default Main;
