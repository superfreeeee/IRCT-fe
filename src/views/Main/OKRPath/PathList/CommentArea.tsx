import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import useInput from '@hooks/useInput';
import { useEnterListener } from '@views/Main/RoomSpace/Chat/hooks';
import React, {
  ForwardRefExoticComponent,
  RefAttributes,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { CommentAreaContainer, CommentInput } from './styles';

export interface CommentAreaRef {
  focusComment: () => void;
}

const CommentArea: ForwardRefExoticComponent<RefAttributes<CommentAreaRef>> =
  React.forwardRef((_, ref) => {
    const [input, onInputChange, { resetInput }] = useInput();
    const onSend = useCallback(() => {
      // temp just do nothing & disabled
      // focusComment();
    }, [input]);
    const { onFocus, onBlur, send } = useEnterListener({
      input,
      onSend,
      resetInput,
    });

    const inputRef = useRef<HTMLInputElement>(null);
    const focusComment = useCallback(() => {
      inputRef.current.focus();
    }, []);

    // ========== outer actions ==========
    useImperativeHandle(
      ref,
      () => {
        return {
          focusComment,
        };
      },
      [],
    );

    return (
      <CommentAreaContainer>
        <CommentInput
          type="text"
          placeholder="Aa"
          ref={inputRef}
          value={input}
          onChange={onInputChange}
          onFocus={onFocus}
          onBlur={onBlur}
          // disabled
        />
        <div className="submitBtn" onClick={send}>
          <BoxIcon type={BoxIconType.MessageDots} size={'xs'} />
        </div>
      </CommentAreaContainer>
    );
  });

export default CommentArea;
