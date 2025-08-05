import React, { useContext } from 'react';
import { View } from 'components/layout/View';
import ListItem from '@material-ui/core/ListItem';
import Output from 'components/outputs/Output';
import { ThemeContext } from 'components/app/context';
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import PendingIcon from '@material-ui/icons/HourglassEmpty';
import { Tooltip } from '@material-ui/core';
import { standardizeString } from 'util/general';

const OutputStatus = props => {
  const { value, values, label, onClick, status, disabled } = props;
  const { colors } = useContext(ThemeContext);

  let Icon = null;
  let color;
  let iconProps = { style: { color: '#FAFAFA', fontSize: 18 } };
  if (status === 'pending') {
    color = colors.font;
    Icon = <PendingIcon {...iconProps} />;
  } else if (status === 'verified' || status === 'enabled' || status === true) {
    color = colors.positive;
    Icon = <DoneIcon {...iconProps} />;
  } else {
    Icon = (
      <ErrorIcon
        {...iconProps}
        style={{ color: colors.negative, fontSize: 34 }}
      />
    );
  }

  const left = (
    <Output
      label={label}
      value={value ? value : 'Not yet provided'}
      values={values}
    />
  );
  const right = status && (
    <View aI={'flex-end'} jC={'center'} pl={1}>
      <Tooltip title={standardizeString(status)}>
        <div>
          <View
            aI={'center'}
            jC={'center'}
            style={{
              height: 28,
              width: 28,
              borderRadius: 100,
              backgroundColor: color,
            }}>
            {Icon}
          </View>
        </div>
      </Tooltip>
    </View>
  );

  return (
    <ListItem
      button
      onClick={onClick}
      dense={!label}
      style={{ minHeight: 48 }}
      disabled={disabled}>
      <View w={'100%'} fD={'row'} aI={'space-between'} jC={'center'}>
        {left}
        {right}
      </View>
    </ListItem>
  );
};

export default OutputStatus;
