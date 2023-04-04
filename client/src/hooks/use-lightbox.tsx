import { useState } from 'react';
import Lightbox, { Slide } from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

const initialState = {
  open: false,
  index: 0,
};

const useLightbox = (slides: Slide[]) => {
  const [{ open, index }, setState] = useState(initialState);

  const closeLightbox = () => {
    setState(initialState);
  };

  const openLightbox = (index: number) => {
    setState({
      open: true,
      index,
    });
  };

  const LightboxComponent = () => (
    <Lightbox
      index={index}
      open={open}
      plugins={[Captions, Thumbnails, Zoom]}
      slides={slides}
      close={closeLightbox}
    />
  );

  return { Lightbox: LightboxComponent, openLightbox };
};

export default useLightbox;
