import React, { useEffect, useState } from 'react';
import Text from 'components/outputs/Text';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

const CustomTooltip = withStyles(theme => ({
  tooltip: {
    maxWidth: 220,
    border: '1px solid #dadde9',
    marginLeft: 2,
    backgroundColor: '#ffffff !important',
    color: '#000000de !important',
    padding: '4px 16px',
    boxShadow:
      '0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)',
  },
}))(Tooltip);

export default function useCapsLock(element, elementRef) {
  const [isCapsLock, setIsCapsLock] = useState(false);
  const isRtl = document.dir === 'rtl';

  useEffect(() => {
    element.addEventListener('keyup', keyUpEventHandler);
    return () => {
      element.removeEventListener('keyup', keyUpEventHandler);
    };
  }, []);

  const keyUpEventHandler = e => {
    const capsOn = e.getModifierState && e.getModifierState('CapsLock');
    setIsCapsLock(capsOn);
  };

  const warningContent = isCapsLock ? (
    <CustomTooltip
      open
      title={<Text s={14} id="caps_lock_on_title" />}
      placement={isRtl ? 'left-start' : 'right-start'}>
      <span />
    </CustomTooltip>
  ) : null;

  return { isCapsLock, warningContent };
}
