import React, { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import StatusBar from './StatusBar';
import IM from './IM';
import RoomSpace from './RoomSpace';
import AppSidebar from './AppSidebar';
import CallModal from './modals/CallModal';
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
import CreateMeetingModal from './modals/CreateMeetingModal';
import SelectUserModal from './modals/SelectUserModal';
import Background from './Background';
import OKRPath from './OKRPath';
import OKRList from './OKRList';
import { okrPathVisibleState } from './state/okrPath';

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
      {/* // ! left */}
      <StatusBar />
      <IM />
      <RoomSpace />

      {/* // ! center */}
      <OKRPath />
      <Background />

      {/* // ! right */}
      {/* OKR Path 页面右侧列表 */}
      <OKRList />
      {/* 应用侧边栏(Date, Doc, Todo) */}
      <AppSidebar />

      {/* // ! overhead */}
      {/* 请求语音 Modal */}
      <CallModal />
      {/* 创建永久会议室 Modal */}
      <CreateMeetingModal />
      {/* 选人组件 Modal */}
      <SelectUserModal />
    </MainContainer>
  );
};

export default Main;
