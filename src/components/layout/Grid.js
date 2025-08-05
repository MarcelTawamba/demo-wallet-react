import React, { useMemo } from 'react';
import './Layout.css';
import { Scrollbars } from 'react-custom-scrollbars-better';
import { View } from 'components/layout/View';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export default function Grid(props) {
  const { children, footer, spacing = 3, columns = 3 } = props;

  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.down(1299));
  const sm = useMediaQuery(theme.breakpoints.down(735));
  const xs = useMediaQuery(theme.breakpoints.down(600));

  const gridCol = useMemo(() => {
    let colValue = columns;
    if (xs) {
      colValue = 1;
    }
    if (sm) {
      colValue = columns > 2 ? 2 : columns;
    } else if (md) {
      colValue = columns > 3 ? 3 : columns;
    }
    return colValue;
  }, [md, sm, xs]);

  return (
    <React.Fragment>
      <Scrollbars
        rtl={document.dir === 'rtl'}
        style={{ overflowX: 'hidden' }}
        renderView={props => <div {...props} />}>
        <View
          grid
          columns={gridCol}
          gap={xs ? 2 : spacing}>
          {children}
        </View>
        {footer}
        <div style={{ height: '25px' }}></div>
      </Scrollbars>
    </React.Fragment>
  );
}
