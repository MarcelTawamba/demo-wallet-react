import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const Hidden = ({ size, up, children }) => {
  const theme = useTheme();
  const matches = useMediaQuery(
    up ? theme.breakpoints.up(size) : theme.breakpoints.down(size),
  );

  return matches ? children : null;
};

export default Hidden;
