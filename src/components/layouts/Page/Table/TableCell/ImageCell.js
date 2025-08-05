import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import { get } from 'lodash';
import Text from 'components/outputs/Text';
import ImageWithFallback from 'components/outputs/ImageWithFallback';

const useStyles = makeStyles(theme => ({
  container: {
    overflow: 'hidden',
    // textOverflow: 'ellipsis',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    // minHeight: 46,
    // height: '100%',
  },
  value: {
    paddingLeft: theme.spacing(2),
    fontSize: 14,
  },
}));

export default function ImageCell(props) {
  const { value = 0, row = {}, imageValue } = props;
  const classes = useStyles();
  let imageUrl = '';
  if (imageValue) {
    const image = get(row, imageValue);
    if (typeof image === 'string') {
      imageUrl = image;
    } else if (Array.isArray(image) && image.length) {
      imageUrl = image[0].file;
    }
  }

  return (
    <TableCell key={value}>
      <div className={classes.container}>
        <ImageWithFallback
          src={imageUrl}
          name={'product'}
          size={60}
          alt="Product image"
        />
        <Text c="fontDark" noWrap className={classes.value}>
          {value}
        </Text>
      </div>
    </TableCell>
  );
}
