import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { SimpleImg } from 'react-simple-img';
import Text from 'components/outputs/Text';
import ImageWithFallback from 'components/outputs/ImageWithFallback';
import { orderBy } from 'lodash';

const useStyles = makeStyles(theme => ({
  row: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingTop: theme.spacing(1),
  },
  section: {
    width: '100%',
    paddingTop: theme.spacing(1.5),
    padding: theme.spacing(3),
    // paddingRight: theme.spacing(3),
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    marginBottom: theme.spacing(2),
  },
  image: {
    paddingTop: theme.spacing(2),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  detail: {
    marginLeft: theme.spacing(4),
  },
}));

export default function ProductImages(props) {
  const { item = {} } = props;
  const images = orderBy([...(item?.images ?? [])], item => item?.weight);
  const coverImage = images.shift();
  const classes = useStyles();

  return (
    <div className={classes.section}>
      <Text variant="h6" className={classes.title} id="product_images" />

      <div className={classes.row}>
        <div className={classes.column}>
          <Text
            color="primary"
            variant="caption"
            fontWeight="500"
            id="product_card_image"
          />
          <div className={classes.row}>
            <ImageWithFallback
              src={coverImage?.file}
              name={'product'}
              size={155}
              alt="Product card image"
            />
          </div>
        </div>
        <div className={classes.detail}>
          <Text
            color="primary"
            variant="caption"
            fontWeight="500"
            id="detail_images"
          />
          <div className={classes.row}>
            {images?.length ? (
              images.map((image, index) => (
                <SimpleImg
                  className={classes.image}
                  src={image?.file}
                  height={155}
                  width={155}
                  alt={'Detail image ' + index}
                  key={image?.id}
                />
              ))
            ) : (
              <Text id="no_detail_images" variant="body2" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
