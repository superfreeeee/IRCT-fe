import React, { FC, MutableRefObject, useEffect, useRef } from 'react';

import useInput from '@/hooks/useInput';
import { EditContentTextArea } from './styles';
import useClosestRef from '@/hooks/useClosestRef';
import { useRecoilValue } from 'recoil';
import { editEntityModalVisibleState } from '@/views/Main/state/modals/editEntityModal';

interface EditContentProps {
  content: { content: string };
  contentRef: MutableRefObject<string>;
}

const EditContent: FC<EditContentProps> = ({
  content: originContent,
  contentRef,
}) => {
  const [content, onContentChange, { setInput }] = useInput();
  useClosestRef(content, contentRef);

  // sync content
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    setInput(originContent.content);
  }, [originContent]);

  // auto focus
  const modalVisible = useRecoilValue(editEntityModalVisibleState);
  useEffect(() => {
    if (modalVisible) {
      textAreaRef.current.focus();
    }
  }, [modalVisible]);

  return (
    <EditContentTextArea
      placeholder="Please enter the Objective details"
      rows={4}
      ref={textAreaRef}
      value={content}
      onChange={onContentChange}
    />
  );
};

export default EditContent;
