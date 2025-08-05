import React from 'react';

import { standardizeString } from 'util/general';
import { View } from './View';
import { Button } from 'components/inputs/Button';
import Text from 'components/outputs/Text';
import { makeStyles } from '@material-ui/core/styles';

export default function Stepper(props) {
  const { step, steps, setStep } = props;
  const stepIndex = steps.findIndex(item => (item?.id ?? item) === step);

  return (
    <View fD="row" aI="center" pv={0.5}>
      {steps.map((item, index) => (
        <StepperItem
          key={item}
          item={item}
          index={index}
          setStep={setStep}
          currentIndex={stepIndex}
        />
      ))}
    </View>
  );
}

function StepperItem(props) {
  const { item, index, currentIndex, setStep } = props;
  const classes = useStyles(props);

  return (
    <div
      className={classes.stepperItem}
      onClick={
        item?.disabled
          ? null
          : index - currentIndex > 1
          ? null
          : () => setStep(item?.id ?? item)
      }>
      <View
        className={classes.stepNumber}
        bC={index < currentIndex ? 'primary' : 'white'}
        bR={200}
        jC={'center'}
        aI={'center'}>
        <Text
          style={{
            fontSize: 10,
            lineHeight: '1px',
          }}
          width={'fit-content'}
          myColor={
            index < currentIndex
              ? 'white'
              : index > currentIndex
              ? '#BEBEBE'
              : 'primary'
          }>
          {index + 1}
        </Text>
      </View>

      <Text
        variant="body2"
        myColor={index > currentIndex ? '#BEBEBE' : 'primary'}
        id={item?.id ?? item}
      />
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  stepNumber: {
    width: 17,
    height: 17,
    minWidth: 17,
    minHeight: 17,
    display: 'flex',
    marginRight: '8px !important',
    border: props =>
      `1px solid ${
        props?.index <= props?.currentIndex
          ? theme.palette?.primary?.main
          : '#BEBEBE'
      }`,
  },
  stepperItem: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: theme.spacing(2.5),
    cursor: 'pointer',
    alignItems: 'center',
  },
}));
