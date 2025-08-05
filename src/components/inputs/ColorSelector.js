/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import { TwitterPicker } from 'react-color';
import { useTheme } from 'components/app/context';
import { makeStyles } from '@material-ui/styles';
import Text from 'components/outputs/Text';
import { View } from 'components/layout/View';
import Icon from 'components/outputs/NewIcon';
import IconButton from './IconButton';

export default function ColorSelector(props) {
  const { selectedColor, label, position, onChange } = props;
  const { colors } = useTheme();
  const classes = useStyles();

  const [display, setDisplay] = useState(false);
  const [selected, setSelected] = useState(selectedColor ?? colors.primary);
  const [selection] = useState([
    selectedColor ?? colors.primary,
    '#FCB900',
    '#7BDCB5',
    '#00D084',
    '#8ED1FC',
    '#0693E3',
    '#ABB8C3',
    '#EB144C',
    '#F78DA7',
    '#9900EF',
  ]);

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setDisplay);

  function handleChange(color) {
    setSelected(color.hex);
    if (onChange) onChange(color.hex);
  }
  const isRtl = document.dir === 'rtl';

  return (
    <div>
      {label ? <Text style={{ marginBottom: '1rem' }} id={label} /> : null}
      <View flex fD={'row'}>
        <View
          bC={selected}
          bR={5}
          w={'80px'}
          h={'80px'}
          mb={1}
          style={{ boxShadow: '4px 2px 8px #dedede' }}></View>

        <View ml={isRtl ? 0 : 0.5} mr={isRtl ? 0.5 : 0} mt={-0.25}>
          <IconButton
            variant="text"
            component="label"
            noPadding
            onPress={() => setDisplay(!display)}
            style={{ minWidth: 0 }}>
            <Icon icon={'create'} size={12} />
          </IconButton>
        </View>
      </View>

      {display ? (
        <div ref={wrapperRef}>
          <TwitterPicker
            triangle={position ?? 'top-left'}
            color={selected}
            colors={selection}
            onChangeComplete={handleChange}
            className={classes.selector}
          />
        </div>
      ) : null}
    </div>
  );
}

function useOutsideAlerter(ref, setDisplay) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) setDisplay(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}

const useStyles = makeStyles(theme => ({
  selector: {
    zIndex: 1,
    position: 'absolute !important',
  },
}));
