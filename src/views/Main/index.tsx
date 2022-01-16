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
  // const setTeamDataList = useSetRecoilState(teamDataListState);
  // const setTeamDataList = useSetRecoilState(teamDataListState);
  const [teamList, setTeamDataList] = useRecoilState(teamDataListState);
  const [roomList, setRoomDataList] = useRecoilState(roomDataListState);
  // const setAllChatRecords = useSetRecoilState(allChatRecordsState);
  const [allChatRecords, setAllChatRecords] =
    useRecoilState(allChatRecordsState);

  useEffect(() => {
    console.log(`teamList`, teamList);
  }, [teamList]);
  useEffect(() => {
    console.log(`roomList`, roomList);
  }, [roomList]);
  useEffect(() => {
    console.log(`allChatRecords`, allChatRecords);
  }, [allChatRecords]);

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
