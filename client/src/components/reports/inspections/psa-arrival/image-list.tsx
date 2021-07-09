import React from 'react';
import { pluck } from 'ramda';

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
  const imageUrls =
    data && data.pictures
      ? pluck('imageUrl', data.pictures.nodes as PsaArrivalPicture[]) || []
      : [];
  const titleList =
    data && data.pictures
      ? (data.pictures.nodes as PsaArrivalPicture[]).map(
          (picture) => `${picture.pictureDescription}`,
        )
      : undefined;

  const { Lightbox, openLightbox } = useLightbox(
    imageUrls,
    '',
    `${api.baseURL}/`,
    titleList,
  );

  return (
    <>
      <ty.CaptionText mb={th.spacing.md} secondary>
        Images ({imageUrls.length || '-'})
      </ty.CaptionText>
      <l.Flex column pr={th.spacing.tn}>
        {imageUrls.map((imageUrl: string, idx: number) => (
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
              src={`${api.baseURL}/${imageUrl}`}
            />
          </l.Div>
        ))}
      </l.Flex>
      <Lightbox />
    </>
  );
};

export default ImageList;
