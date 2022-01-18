import { ChangeEvent, ChangeEventHandler, useCallback, useState } from 'react';

const useInput = (
  initValue: string = '',
): [string, ChangeEventHandler<HTMLInputElement>] => {
  const [input, setInput] = useState(initValue);

  const onInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  return [input, onInputChange];
};

export default useInput;
