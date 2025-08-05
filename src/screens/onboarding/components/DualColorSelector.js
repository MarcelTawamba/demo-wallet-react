/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import ColorSelector from 'components/inputs/ColorSelector';
import { get } from 'lodash';

export default function DualColorSelector(props) {
  const { itemNames, labels, active, onChange } = props;

  const [first, setFirst] = useState(active && active.length && active[0]);
  const [second, setSecond] = useState(active && active.length && active[1]);

  useEffect(() => {
    onChange({
      [get(itemNames, ['0'], 'first')]: first,
      [get(itemNames, ['1'], 'second')]: second,
    });
  }, [first, second]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <ColorSelector
          label={labels && labels.length && labels[0]}
          selectedColor={active && active.length && active[0]}
          onChange={value => setFirst(value)}
        />
      </Grid>
      <Grid item xs={6}>
        <ColorSelector
          label={labels && labels.length && labels[1]}
          selectedColor={active && active.length && active[1]}
          onChange={value => setSecond(value)}
        />
      </Grid>
    </Grid>
  );
}
