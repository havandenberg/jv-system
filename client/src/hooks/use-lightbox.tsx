import { useState } from 'react';
import Lightbox from 'react-image-lightbox';

const initialState = {
  isOpen: false,
  photoIndex: 0,
};

const useLightbox = (
  imageUrls: string[],
  title?: string,
  baseSrc?: string,
  titleList?: string[],
) => {
  const [{ isOpen, photoIndex }, setState] = useState(initialState);

  const closeLightbox = () => {
    setState((prevState) => ({ ...prevState, isOpen: false }));
  };

  const openLightbox = (index: number) => {
    setState((prevState) => ({
      ...prevState,
      isOpen: true,
      photoIndex: index,
    }));
  };

  const nextIndex = () =>
    photoIndex < imageUrls.length - 1 ? photoIndex + 1 : 0;

  const prevIndex = () =>
    photoIndex > 0 ? photoIndex - 1 : imageUrls.length - 1;

  const handleNextPhoto = () => {
    setState((prevState) => ({ ...prevState, photoIndex: nextIndex() }));
  };

  const handlePrevPhoto = () => {
    setState((prevState) => ({ ...prevState, photoIndex: prevIndex() }));
  };

  const LightboxComponent = () =>
    isOpen ? (
      <Lightbox
        animationDuration={0}
        imageCaption={imageUrls[photoIndex]}
        imagePadding={80}
        imageTitle={titleList ? titleList[photoIndex] || title : title}
        mainSrc={`${baseSrc || ''}${imageUrls[photoIndex]}`}
        nextSrc={`${baseSrc || ''}${imageUrls[nextIndex()]}`}
        prevSrc={`${baseSrc || ''}${imageUrls[prevIndex()]}`}
        onCloseRequest={closeLightbox}
        onMoveNextRequest={handleNextPhoto}
        onMovePrevRequest={handlePrevPhoto}
      />
    ) : null;

  return { Lightbox: LightboxComponent, openLightbox };
};

export default useLightbox;
