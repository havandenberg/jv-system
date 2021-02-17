import React, { useState } from 'react';
import styled from '@emotion/styled';
import { groupBy, omit, pluck, values } from 'ramda';
import { useDropzone } from 'react-dropzone';
import PulseLoader from 'react-spinners/PulseLoader';

import Modal from 'components/modal';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import FileUpload, {
  InspectionType,
  ParsedInspectionData,
} from './file-upload';

const Dropzone = styled(l.Flex)({
  alignItems: 'center',
  justifyContent: 'center',
  background: th.colors.brand.containerBackground,
  border: th.borders.disabled,
  borderRadius: th.borderRadii.default,
  cursor: 'pointer',
  height: th.spacing.xxl,
  marginBottom: th.spacing.lg,
  transition: th.transitions.default,
  ':hover': {
    background: th.colors.brand.containerBackgroundAccent,
    border: th.borders.secondary,
  },
});

const ImportInspectionsModal = () => {
  const [parsedFiles, setParsedFiles] = useState<{
    [key: string]: ParsedInspectionData;
  }>({});
  const [acceptedFiles, setAcceptedFiles] = useState<any[]>([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: '.xlsx',
    onDrop: (newFiles) => {
      setAcceptedFiles([
        ...acceptedFiles,
        ...newFiles.filter(
          (file) => !pluck('name', acceptedFiles).includes(file.name),
        ),
      ]);
    },
  });
  const loadingFiles = acceptedFiles.filter((file) => !parsedFiles[file.name]);

  const groupedFiles = groupBy(
    (parsedFile) => parsedFile.type,
    values(parsedFiles),
  );

  const setFileData = (fileName: string) => (data: ParsedInspectionData) => {
    setParsedFiles((prevState) => ({ ...prevState, [fileName]: data }));
  };

  const removeFile = (fileName: string) => () => {
    setAcceptedFiles((prevState) =>
      prevState.filter((file) => file.name !== fileName),
    );
    setParsedFiles((prevState) => omit([fileName], prevState));
  };

  return (
    <Modal trigger={(show) => <b.Primary onClick={show}>Import</b.Primary>}>
      <ty.TitleText>Import Inspections</ty.TitleText>
      <ty.BodyText mb={th.spacing.lg}>
        Import .xlsx inspection files below. Accepts arrival inspections from
        PSA and departure inspections from Peru and Chile. You can import any
        number of files at once. Inspection type is detected automatically.
      </ty.BodyText>
      <Dropzone {...getRootProps()}>
        <ty.CaptionText secondary>
          Drag & drop files here, or click to select
        </ty.CaptionText>
        <input {...getInputProps()} />
      </Dropzone>
      {loadingFiles.length > 0 && (
        <l.Div mb={th.spacing.md}>
          <l.Flex alignCenter mb={th.spacing.md}>
            <ty.BodyText italic mr={th.spacing.md}>
              Processing data files
            </ty.BodyText>
            <PulseLoader
              color={th.colors.brand.disabled}
              size={th.spacing.xs}
            />
          </l.Flex>
          {loadingFiles.map((fileData) => (
            <FileUpload
              key={fileData.name}
              raw={fileData}
              removeFile={removeFile(fileData.name)}
              setFileData={setFileData(fileData.name)}
            />
          ))}
        </l.Div>
      )}
      {groupedFiles[InspectionType.PERU_DEPARTURE] && (
        <>
          <ty.BodyText mb={th.spacing.md} secondary>
            Peru Departure Inspections:
          </ty.BodyText>
          {groupedFiles[InspectionType.PERU_DEPARTURE].map((fileData) => (
            <FileUpload
              key={fileData.fileName}
              fileData={fileData}
              removeFile={removeFile(fileData.fileName)}
              setFileData={setFileData(fileData.fileName)}
            />
          ))}
        </>
      )}
    </Modal>
  );
};

export default ImportInspectionsModal;
