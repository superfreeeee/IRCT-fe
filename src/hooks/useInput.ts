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

type InputElement = HTMLInputElement | HTMLTextAreaElement;

const useInput = (
  initValue: string = '',
): [string, ChangeEventHandler<InputElement>, InputActions] => {
  const [input, setInput] = useState(initValue);

  const onInputChange = useCallback((e: ChangeEvent<InputElement>) => {
    console.log(`onInputChange: ${e.target.value}`, e);
    setInput(e.target.value);
  }, []);

  const resetInput = useCallback(() => {
    setInput('');
  }, []);

  return [input, onInputChange, { setInput, resetInput }];
};

export default useInput;
