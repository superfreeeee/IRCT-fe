import styled from 'styled-components';

export const CreateMeetingContainer = styled.div`
  min-width: 570px;
`;

const CreateMeetingBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  border-radius: 10px;
  color: #fff;
  background-color: var(--modal_bg);
  backdrop-filter: blur(2px);
`;

export const CreateMeetingHeader = styled(CreateMeetingBox)`
  padding: 16px 0;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
`;

export const CreateMeetingBody = styled(CreateMeetingBox)`
  gap: 15px;
  padding: 35px 120px 24px;
  font-size: 14px;

  .description {
    font-size: 12px;
  }

  .field {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .field.title > input {
    width: 250px;
    padding: 5px 0 5px 10px;
    margin-left: 5px;
    border-radius: 5px;
    color: rgba(255, 255, 255, 0.5);
    background-color: rgba(37, 37, 37, 0.6);
  }

  .field.locked input {
    display: none;
  }

  .field.locked .box {
    width: 20px;
    height: 20px;
    margin-left: 8px;
    border-radius: 5px;
    box-shadow: 0 1px 5px rgb(0, 0, 0, 0.6) inset;
    background-color: rgba(37, 37, 37, 0.6);
  }

  /* checked ... */
  .field.locked input:checked + .box,
  .field.locked input:active + .box {
    box-shadow: none;
    background-color: #444546;
  }

  .field.locked input:checked:active + .box {
    box-shadow: 0 1px 5px rgb(0, 0, 0, 0.6) inset;
    background-color: rgba(37, 37, 37, 0.6);
  }

  .field.locked input:checked + .box::after,
  .field.locked input:active + .box::after {
    content: '\u2713';
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .field.locked input:checked:active + .box::after {
    content: '';
  }
`;

export const CreateMeetingOptions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 80px;
`;

export const CreateMeetingBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 112px;
  padding: 4px 0;
  border: 0;
  border-radius: 6px;
  font-size: 14px;
  color: #fff;
  background-color: #444546;

  &.primary {
    color: #060606;
    background-color: #dedede;
  }
`;
