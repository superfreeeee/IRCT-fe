import useClosestRef from '@hooks/useClosestRef';
import { noop } from '@utils';
import {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useRef,
  useState,
} from 'react';

/**
 * 输入框
 */
interface UseInputActions {
  resetInput: () => void;
}

export const useInput = (): [
  string,
  ChangeEventHandler<HTMLInputElement>,
  UseInputActions
] => {
  const [input, setInput] = useState('');

  const onInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    setInput(newInput);
  }, []);

  const resetInput = useCallback(() => {
    setInput('');
  }, []);

  return [input, onInputChange, { resetInput }];
};

/**
 * Enter 输入监听
 */
export const useEnterListener = ([input, { onSend, resetInput }]) => {
  // 用户输入 ref
  const inputRef = useClosestRef(input);
  // onSend 方法
  const sendRef = useClosestRef(onSend);
  // removeListener
  const removeListenerRef = useRef(noop);

  /**
   * 发送消息：
   *   调用 onSend 并清空 input 输入
   */
  const send = useCallback(() => {
    const input = inputRef.current;
    const onSend = sendRef.current;

    // TODO clear console
    console.log(`[Chat] send = '${input}'`);

    onSend && onSend(input);
    resetInput();
  }, []);

  // onFocus 时设置监听函数
  const setEnterListener = useCallback(() => {
    // clear last listener
    removeListenerRef.current();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        send();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    removeListenerRef.current = () => {
      document.removeEventListener('keydown', onKeyDown);
      removeListenerRef.current = noop;
    };
  }, []);

  // onBlur 时取消监听
  const removeEnterListener = useCallback(() => {
    removeListenerRef.current();
  }, []);

  return {
    setEnterListener,
    removeEnterListener,
    onFocus: setEnterListener,
    onBlur: removeEnterListener,
    send,
  };
};
