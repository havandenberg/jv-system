import React from 'react';

import api from 'api';
import useLightbox from 'hooks/use-lightbox';
import { Maybe, PsaArrivalPicture } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

const ImageList = ({
  data,
}: {
  data: { pictures: { nodes: Maybe<PsaArrivalPicture>[] } };
}) => {
  const slides = data
    ? ((data.pictures.nodes || []) as PsaArrivalPicture[]).map(
        ({ imageUrl, palletId, pictureDescription }) => ({
          description: pictureDescription,
          src: `${api.baseURL}/${imageUrl}`,
          title: palletId,
        }),
      )
    : [];

  const { Lightbox, openLightbox } = useLightbox(slides);

  return (
    <>
      <ty.CaptionText mb={th.spacing.md} secondary>
        Images ({slides.length || '-'})
      </ty.CaptionText>
      <l.Flex column pr={th.spacing.tn}>
        {slides.map(({ src }, idx: number) => (
          <l.Div
            cursor="pointer"
            key={idx}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openLightbox(idx);
            }}
          >
            <l.Img
              width={th.sizes.fill}
              py={th.spacing.tn}
              mr={th.spacing.tn}
              src={src}
            />
          </l.Div>
        ))}
      </l.Flex>
      <Lightbox />
    </>
  );
};

export default ImageList;
