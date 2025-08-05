import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import InlineSVG from 'svg-inline-react';
// import Spinner from './Spinner';
import QRCode from 'qrcode';

export default function QR(props) {
  let { showToast, children, size = 260, encodeUri } = props;
  const classes = useStyles(props);

  const [imageSrc, setImageSrc] = useState();

  useEffect(() => {
    QRCode.toString(encodeUri ? encodeURIComponent(children) : children).then(
      resp => {
        setImageSrc(resp);
      },
    );
  });

  return (
    <div className={classes.qr}>
      {/* <div style={{ display: loading ? 'block' : 'none' }}>
        <Spinner />
      </div> */}
      <InlineSVG src={imageSrc} style={{ width: size }} />
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  qr: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: ({ p = 1 }) => theme.spacing(p),
    height: ({ size = 280 }) => size,
  },
}));
