import React, { useState, useCallback, useEffect } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';

import { SimpleImg } from 'react-simple-img';
import Text from 'components/outputs/Text';
import CropIcon from '@material-ui/icons/Crop';
import ImageUpload from './ImageUpload';
import IconButton from 'components/inputs/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from 'components/outputs/Tooltip';
import { orderBy } from 'lodash';
import { View } from 'components/layout/View';
import {
  createProductImage,
  deleteProductImage,
  getProduct,
} from 'screens/products_admin/util/rehive';

export default function Images(props) {
  const { setValue, defaultValues, context } = props;
  const defaultImages = orderBy(
    defaultValues?.images.map(item => ({
      preview: item?.file,
      weight: item?.weight,
    })),
    item => item?.weight,
  );
  const classes = useStyles(props);
  const defaultCoverImage = defaultImages.shift();
  const [coverImage, setCoverImage] = useState(defaultCoverImage);
  const [detailImages, setDetailImages] = useState(defaultImages);
  const [tempImages, setTempImages] = useState(null);
  const [productImage, setProductImage] = useState(context?.item?.images);
  const sellerId = context?.sellers?.[0]?.id ?? '';
  const productId = context?.item?.id ?? '';
  useEffect(() => {
    setValue('images', [coverImage].concat(detailImages));
  }, [coverImage, detailImages, setValue]);

  async function handleRemoveDetailImage(index) {
    const temp = [...detailImages];

    const imageToDelete = productImage[index + 1];
    await deleteProductImage(sellerId, productId, imageToDelete?.id);
    const resp = await getProduct(sellerId, productId);
    setProductImage(resp?.data?.images);
    temp.splice(index, 1);
    setDetailImages(temp);
  }

  async function handleAddDetailImages(newImages) {
    const temp = [...detailImages].concat(newImages);
    await createProductImage(
      sellerId,
      productId,
      newImages?.[0]?.file,
      detailImages?.length + 1,
    );
    const resp = await getProduct(sellerId, productId);
    setProductImage(resp?.data?.images);
    setDetailImages(temp);
    setTempImages(null);
  }

  useEffect(() => {
    if (tempImages?.length) {
      handleAddDetailImages(tempImages);
    }
  }, [tempImages]);

  const isRtl = document.dir === 'rtl';

  return (
    <div className={classes.container}>
      <div className={classes.column}>
        <div className={classes.row}>
          <Text variant="h6" id="product_cover_image" />
          <Tooltip id="product_image_crop_help">
            <CropIcon style={{ color: '#707070' }} />
          </Tooltip>
        </div>
        {coverImage ? (
          <div className={classes.detailImages}>
            <ImagePreview
              key={coverImage?.preview ?? coverImage}
              image={coverImage}
              coverImage
              onClear={() => setCoverImage(null)}
            />
          </div>
        ) : (
          <View className={classes.dropArea}>
            <ImageUpload
              imageURL={coverImage?.preview}
              onClear={() => setCoverImage(null)}
              onFileLoad={files => {
                var file = files[0];
                let f = window.URL.createObjectURL(file);
                var reader = new FileReader();
                reader.addEventListener(
                  'load',
                  function () {
                    setCoverImage({ preview: f, file });
                  },
                  false,
                );
                if (file) {
                  reader.readAsDataURL(file);
                }
              }}
            />
          </View>
        )}
      </div>
      <div className={classes.column2}>
        <div className={classes.row}>
          <Text
            variant="h6"
            width="auto"
            style={{
              whiteSpace: 'nowrap',
              [isRtl ? 'paddingLeft' : 'paddingRight']: 16,
            }}
            id="detail_images"
          />
          <Text
            color="error"
            style={{ fontSize: 14 }}
            id="recommended_images"
          />
          <Tooltip id="product_image_crop_help">
            <CropIcon style={{ color: '#707070' }} />
          </Tooltip>
        </div>
        <View fD="row">
          <div className={classes.detailImages}>
            {detailImages.map((image, index) => (
              <ImagePreview
                key={image?.preview ?? image}
                image={image}
                onClear={() => handleRemoveDetailImage(index)}
              />
            ))}
          </div>
          {[
            ...Array(3 - (detailImages?.length > 3 ? 3 : detailImages?.length)),
          ].map((_, i) => (
            <ImageUpload
              key={i}
              multiple
              onFileLoad={async files => {
                let detailFiles = [];
                const promises = files.map(file => {
                  return new Promise((resolve, reject) => {
                    let f = window.URL.createObjectURL(file);
                    var reader = new FileReader();
                    reader.onload = () => {
                      resolve({ preview: f, file });
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                  });
                });
                const loadedFiles = await Promise.all(promises);
                setTempImages(loadedFiles);
              }}
            />
          ))}
        </View>
      </div>
    </div>
  );
}

function ImagePreview(props) {
  const { image, onClear, coverImage } = props;
  const classes = useStyles2(props);

  return (
    <div className={classes.container} key={image?.preview}>
      <IconButton
        onPress={onClear}
        noPadding
        className={coverImage ? classes.coverCrossIcon : classes.icon}>
        <CloseIcon style={{ color: '#707070', fontSize: 18 }} />
      </IconButton>
      <SimpleImg
        className={coverImage ? classes.coverImage : classes.image}
        src={image?.preview}
        alt="img"
      />
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    height: '500px',
    // backgroundColor: '#fafa',
  },
  column: {
    flex: 1,
    width: '50%',
    paddingRight: theme.spacing(3),
    height: 350,
  },
  column2: { flex: 1, width: '50%' },
  row: { flexDirection: 'row', display: 'flex' },
  detailImages: {
    flexDirection: 'row',
    display: 'flex',
    maxHeight: '700px',
    margin: theme.spacing(1),
  },
  dropArea: {
    position: 'relative',
    maxHeight: 265,
    maxWidth: 265,
    // width: '100%',
    // height: '100%',
    height: 265,
    width: 265,

    backgroundColor: '#E5E5E5',
    color: '#848484',
    borderRadius: 20,

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const useStyles2 = makeStyles(theme => ({
  icon: {
    position: 'absolute',
    right: -5,
    top: -5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
    width: 20,
    backgroundColor: 'red',
    borderRadius: 20,
    zIndex: 200,
  },
  coverCrossIcon: {
    position: 'absolute',
    right: -120,
    top: -5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
    width: 20,
    backgroundColor: 'red',
    borderRadius: 20,
    zIndex: 200,
  },
  container: {
    position: 'relative',
    maxHeight: 150,
    maxWidth: 150,
    height: 300,
    width: 300,
    margin: theme.spacing(1),
  },
  image: {
    position: 'relative',
    maxHeight: 150,
    maxWidth: 150,
    height: 150,
    width: 150,
    backgroundColor: '#E5E5E5',
    color: '#848484',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverImage: {
    position: 'relative',
    maxHeight: 265,
    maxWidth: 265,
    height: 265,
    width: 265,
    backgroundColor: '#E5E5E5',
    color: '#848484',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
