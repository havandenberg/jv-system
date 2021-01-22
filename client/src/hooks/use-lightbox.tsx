import { useState } from 'react';
import Lightbox from 'react-image-lightbox';

import api from 'api';

const initialState = {
  isOpen: false,
  photoIndex: 0,
};

const useLightbox = (imageUrls: string[], title?: string) => {
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
        imageTitle={title}
        mainSrc={`${api.baseURL}${imageUrls[photoIndex]}`}
        nextSrc={`${api.baseURL}${imageUrls[nextIndex()]}`}
        prevSrc={`${api.baseURL}${imageUrls[prevIndex()]}`}
        onCloseRequest={closeLightbox}
        onMoveNextRequest={handleNextPhoto}
        onMovePrevRequest={handlePrevPhoto}
      />
    ) : null;

  return { Lightbox: LightboxComponent, openLightbox };
};

export default useLightbox;
