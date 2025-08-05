import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import context from '../context';
import { colors } from '@material-ui/core';

class Image extends Component {
  state = { imgHeight: 0, imgWidth: 0, loading: true };

  onImgLoad = ({ target: img }) => {
    this.setState({
      imgHeight: img.naturalHeight,
      imgWidth: img.naturalWidth,
      loading: false,
    });
    const { loadingHook } = this.props;
    if (loadingHook) {
      const [loading, setLoading] = loadingHook;
      setLoading(false);
    }
  };

  render() {
    let {
      src,
      height,
      maxWidth,
      colors,
      square,
      backgroundColor,
      width,
      alt = '',
      padding,
      loadingHook = [false],
      href,
      style,
      imageClassName,
      ...restProps
    } = this.props;

    if (!height && maxWidth) {
      height = maxWidth;
    }
    if (!width && maxWidth) {
      width = maxWidth;
    }

    const { imgHeight, imgWidth, loading } = this.state;
    const img = (
      <img
        style={
          imgHeight > imgWidth || maxWidth
            ? {
                height,
                width,
                maxWidth: maxWidth ? maxWidth : width,
                maxHeight: maxWidth ? maxWidth : height,
                padding,
                objectFit: 'cover',
                ...style,
              }
            : {
                maxHeight: height,
                padding,
                objectFit: 'contain',
                ...style,
              }
        }
        alt={alt}
        src={src}
        onLoad={this.onImgLoad}
        className={imageClassName}
      />
    );
    return (
      <div
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height,
          width,
          backgroundColor: backgroundColor
            ? colors[backgroundColor]
            : 'transparent',
        }}>
        {/* {(loading || this.props.loading || (loadingHook && loadingHook[0])) && (
          <div
            style={{
              height,
              width,
              position: 'absolute',
              top: (height !== 'auto' ? height : width) / 2 - 12,
              left: width ? width / 2 - 42 : 0,
            }}>
            <CircularProgress />
          </div>
        )} */}
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {img}
          </a>
        ) : (
          img
        )}
      </div>
    );
  }
}

Image.defaultProps = {
  src: '',
  alt: 'image',
  height: 'auto',
  width: 'auto',
  square: false,
  padding: '0px',
};

export default context(Image);
