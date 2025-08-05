import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { configSlidesPreAuthSelector } from 'redux/rehive/selectors';
import Slides from 'components/outputs/Slides';

const PreAuthSlidesPage = props => {
  const { onSuccess, setLoading } = props;
  const slides = useSelector(configSlidesPreAuthSelector);

  const showSlider = slides && slides.length && slides.length > 0;

  useEffect(() => {
    if (!showSlider) {
      onSuccess();
    } else {
      setLoading(false);
    }
  }, [onSuccess, setLoading, showSlider]);

  return (
    <Slides
      items={slides}
      fullScreen
      onSuccess={() => onSuccess()}
      showButtons
    />
  );
};

export default PreAuthSlidesPage;
