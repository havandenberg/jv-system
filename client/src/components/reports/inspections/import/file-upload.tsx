import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { pluck, remove } from 'ramda';
import { useDropzone } from 'react-dropzone';
import PulseLoader from 'react-spinners/PulseLoader';
import XLSX, { ParsingOptions } from 'xlsx';

import api from 'api';
import CloseImg from 'assets/images/close';
import useLightbox from 'hooks/use-lightbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import {
  parseDataFile as parsePDIDataFile,
  validateDataFile as validatePDIDataFile,
} from '../peru-departure/data-utils';

const Wrapper = styled(l.Div)({
  background: th.colors.brand.containerBackground,
  border: th.borders.disabled,
  borderRadius: th.borderRadii.default,
  marginBottom: th.spacing.md,
  padding: th.spacing.sm,
  position: 'relative',
});

const PreviewImg = styled(l.Img)({
  cursor: 'pointer',
  height: th.sizes.md,
  marginRight: th.spacing.tn,
});

const ImageCloseWrapper = styled(l.Div)({
  cursor: 'pointer',
  height: 8,
  width: 8,
  '> svg': {
    opacity: th.opacities.secondary,
    transition: th.transitions.default,
    transform: 'translateY(-8px)',
  },
  ':hover': {
    '> svg': {
      opacity: 1,
    },
  },
});

const FileCloseWrapper = styled(l.Div)({
  cursor: 'pointer',
  height: 12,
  width: 12,
  '> svg': {
    opacity: th.opacities.secondary,
    transition: th.transitions.default,
  },
  ':hover': {
    '> svg': {
      opacity: 1,
    },
  },
});

export enum InspectionType {
  PERU_DEPARTURE = 'peru_departure_inspection',
  CHILE_DEPARTURE = 'chile_departure_inspection',
  PSA_ARRIVAL = 'psa_arrival_inspection',
  UNKNOWN = 'unknown',
}

export interface ParsedInspectionData {
  data: any;
  fileName: string;
  images: any[];
  type: InspectionType;
}

const parseInspectionData = (
  file: XLSX.WorkBook,
  fileName: string,
  bufferType: ParsingOptions['type'],
  setFileData: (fileData: ParsedInspectionData) => void,
) => {
  if (validatePDIDataFile(file)) {
    const workbook = XLSX.read(file, {
      sheetRows: 100,
      type: bufferType,
    });
    setFileData({
      data: parsePDIDataFile(workbook),
      fileName,
      images: [],
      type: InspectionType.PERU_DEPARTURE,
    });
  } else {
    setFileData({
      data: undefined,
      fileName,
      images: [],
      type: InspectionType.UNKNOWN,
    });
  }
};

interface Props {
  fileData?: ParsedInspectionData;
  raw?: any;
  removeFile: () => void;
  setFileData: (fileData: ParsedInspectionData) => void;
}

const FileUpload = ({ fileData, raw, removeFile, setFileData }: Props) => {
  const [
    uploadData,
    { data, error, loading },
  ] = api.useCreatePeruDepartureInspection(
    fileData ? { peruDepartureInspection: fileData.data } : {},
  );
  const [
    { imagesError, imagesLoading, imagesSuccess },
    setImagesUploadStatus,
  ] = useState<{
    imagesError: any;
    imagesLoading: boolean;
    imagesSuccess: boolean;
  }>({ imagesError: null, imagesLoading: false, imagesSuccess: false });

  const { Lightbox, openLightbox } = useLightbox(
    fileData ? pluck('preview', fileData.images) || [] : [],
    fileData ? `${fileData.data.containerId} - Preview` : undefined,
  );
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      if (fileData) {
        setFileData({
          ...fileData,
          images: [
            ...fileData.images,
            ...acceptedFiles.map((file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              }),
            ),
          ],
        });
      }
    },
  });

  const handleUpload = () => {
    if (fileData) {
      const imageData = new FormData();
      fileData.images.forEach((image) => {
        imageData.append('image', image);
      });
      uploadData()
        .then(() => {
          setImagesUploadStatus((prevState) => ({
            ...prevState,
            imagesLoading: true,
          }));
          api
            .postPeruDepartureInspectionImages(
              imageData,
              fileData.data.containerId,
            )
            .then(() => {
              setImagesUploadStatus((prevState) => ({
                ...prevState,
                imagesLoading: false,
                imagesSuccess: true,
              }));
            })
            .catch((e) => {
              console.log(e);
              setImagesUploadStatus((prevState) => ({
                ...prevState,
                imagesError: e,
                imagesLoading: false,
              }));
            });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const handleRemoveImage = (idx: number) => {
    if (fileData) {
      setFileData({
        ...fileData,
        images: remove(idx, 1, fileData.images),
      });
    }
  };

  useEffect(() => {
    if (!fileData) {
      const reader = new FileReader();
      const type = !!reader.readAsBinaryString ? 'binary' : 'array';
      reader.onload = (e) => {
        const result = e.target && e.target.result;
        let workbook = XLSX.read(result, { type });
        parseInspectionData(workbook, raw.name, type, setFileData);
      };
      if (type) reader.readAsBinaryString(raw);
      else reader.readAsArrayBuffer(raw);
    }
  }, [fileData, raw, setFileData]);

  if (!fileData) {
    return (
      <ty.CaptionText mb={th.spacing.md} mr={th.spacing.sm} secondary>
        <li>{raw && raw.name}</li>
      </ty.CaptionText>
    );
  }

  return (
    <Wrapper>
      <l.Flex justifyBetween>
        <ty.CaptionText>{fileData.fileName}</ty.CaptionText>
        <FileCloseWrapper onClick={removeFile}>
          <CloseImg fill={th.colors.brand.primary} height={12} width={12} />
        </FileCloseWrapper>
      </l.Flex>
      <l.Flex alignCenter mt={th.spacing.sm}>
        {fileData.images.length > 0 && (
          <l.Flex flexWrap="wrap" mr={th.spacing.sm}>
            {fileData.images.map((img, idx) => (
              <l.Flex
                key={idx}
                height={th.sizes.md}
                mb={th.spacing.sm}
                mr={th.spacing.xs}
              >
                <PreviewImg
                  onClick={() => openLightbox(idx)}
                  src={img.preview}
                />
                <ImageCloseWrapper
                  onClick={() => {
                    handleRemoveImage(idx);
                  }}
                >
                  <CloseImg
                    fill={th.colors.brand.primary}
                    height={8}
                    width={8}
                  />
                </ImageCloseWrapper>
              </l.Flex>
            ))}
          </l.Flex>
        )}
        <l.Div
          cursor="pointer"
          height={th.sizes.fill}
          mb={th.spacing.sm}
          {...getRootProps()}
        >
          <ty.CaptionText link>Add Images</ty.CaptionText>
          <input {...getInputProps()} />
        </l.Div>
      </l.Flex>
      <l.Flex alignCenter justifyEnd width={th.sizes.fill}>
        {error || imagesError ? (
          <ty.CaptionText color={th.colors.status.error} mb={th.spacing.xs}>
            Upload error: {error ? error.message : imagesError.message}
          </ty.CaptionText>
        ) : data && imagesSuccess ? (
          <ty.CaptionText color={th.colors.status.success}>
            Upload success!
          </ty.CaptionText>
        ) : loading || imagesLoading ? (
          <PulseLoader color={th.colors.brand.disabled} size={th.spacing.xs} />
        ) : (
          <ty.CaptionText link onClick={handleUpload}>
            Upload
          </ty.CaptionText>
        )}
      </l.Flex>
      <Lightbox />
    </Wrapper>
  );
};

export default FileUpload;
