import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
} from 'react';

interface InputActions {
  setInput: Dispatch<SetStateAction<string>>;
  resetInput: () => void;
}

const useInput = (
  initValue: string = '',
): [string, ChangeEventHandler<HTMLInputElement>, InputActions] => {
  const [input, setInput] = useState(initValue);

  const onInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  const resetInput = useCallback(() => {
    setInput('');
  }, []);

  return [input, onInputChange, { setInput, resetInput }];
};

export default useInput;
