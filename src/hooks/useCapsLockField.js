import { useState } from 'react';

export default function useCapsLockField(props) {
  const [focused, setFocused] = useState(false);
  const handleFocus = () => setFocused(true);
  const handleBlur = e => {
    setFocused(false);
    typeof props?.onBlur === 'function' && props.onBlur(e);
  };

  return { focused, handleFocus, handleBlur };
}
