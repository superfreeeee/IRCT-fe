import styled from 'styled-components';

export const HomeContainer = styled.div`
  width: 100vw;
  height: 100vh;

  overflow-x: hidden;
  overflow-y: auto;
  scroll-behavior: smooth;
`;

export const HomePageFrame = styled.section`
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;

  min-height: 70vh;

  .common {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;

    width: 100%;
    padding: 0 115px 0 95px;
  }
`;

export const HomeFooter = styled.section`
  font-size: 30px;
  font-weight: 300;
  text-align: center;

  .content {
    max-width: 80%;
    margin: auto;
  }

  .bottom-padding {
    position: relative;
    height: 400px;
    overflow: hidden;
  }
`;

export const BottomBg = styled.img`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 3300px;
  -webkit-transform: translateY(0);
  -ms-transform: translateY(0);
  transform: translate(-10%, 41%) rotate(10deg);
`;
