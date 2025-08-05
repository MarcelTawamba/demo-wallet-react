import React from 'react';
import { View } from 'components/layout/View';
import ListItem from '@material-ui/core/ListItem';
import Output from 'components/outputs/Output';
import { useTheme } from 'components/app/context';
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import PendingIcon from '@material-ui/icons/HourglassEmpty';
import { Tooltip } from '@material-ui/core';
import { standardizeString } from 'util/general';

export default function SettingsOverviewItem(props) {
  const { id, value, values, label, onClick, status, hide } = props;
  const { colors } = useTheme();
  let Icon = null;
  let color;
  if (hide) {
    return null;
  }
  let iconProps = { style: { color: '#FAFAFA', fontSize: 18 } };
  if (status === 'pending') {
    color = colors.font;
    Icon = <PendingIcon {...iconProps} />;
  } else if (status === 'verified' || status === 'enabled' || status === true) {
    color = colors.positive;
    Icon = <DoneIcon {...iconProps} />;
  } else {
    // color = colors.negative;
    Icon = (
      <ErrorIcon
        {...iconProps}
        style={{ color: colors.negative, fontSize: 34 }}
      />
    );
    // contrastColor
  }

  const left = (
    <Output
      label={label ?? id}
      value={value === undefined ? null : value ? value : 'Not yet provided'}
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
      key={id}
      button
      onClick={onClick}
      dense={!label}
      style={{ minHeight: 48 }}>
      <View w={'100%'} fD={'row'} aI={'space-between'} jC={'center'} ph={1}>
        <React.Fragment>
          {left}
          {right}
        </React.Fragment>
      </View>
    </ListItem>
  );
}
