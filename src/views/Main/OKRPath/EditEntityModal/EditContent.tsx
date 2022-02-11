import React, { FC, MutableRefObject } from 'react';

import useInput from '@hooks/useInput';
import { EditContentTextArea } from './styles';

interface EditContentProps {
  inputRef?: MutableRefObject<HTMLTextAreaElement>;
}

const EditContent: FC<EditContentProps> = ({ inputRef }) => {
  const [content, onContentChange] = useInput();

  return (
    <EditContentTextArea
      placeholder="Please enter the Objective details"
      rows={4}
      ref={inputRef}
      value={content}
      onChange={onContentChange}
    />
  );
};

export default EditContent;
