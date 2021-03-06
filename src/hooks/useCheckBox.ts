import { ChangeEvent, ChangeEventHandler, useCallback, useState } from 'react';

const useCheckbox = (
  initChecked: boolean = false,
): [boolean, ChangeEventHandler<HTMLInputElement>] => {
  const [checked, setChecked] = useState(initChecked);

  const onCheckboxChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  }, []);

  return [checked, onCheckboxChange];
};

export default useCheckbox;
