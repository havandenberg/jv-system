import React, { useEffect, useState } from 'react';

import AlertImg from 'assets/images/alert';
import usePrevious from 'hooks/use-previous';
import th from 'ui/theme';
import ty from 'ui/typography';

import InfoPanel, { InfoPanelProps } from './info-panel';

const ErrorPanel = ({
  errors,
  customStyles,
}: Omit<InfoPanelProps, 'content'> & {
  errors: { text: string; value: boolean }[];
}) => {
  const [show, setShow] = useState(true);

  const hasErrors = errors.reduce((acc, { value }) => acc || !!value, false);

  const previousHasErrors = usePrevious(hasErrors);

  useEffect(() => {
    if (!previousHasErrors && hasErrors) {
      setShow(true);
    }
  }, [hasErrors, previousHasErrors]);

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 50);
  }, []);

  if (!hasErrors) {
    return null;
  }

  return (
    <InfoPanel
      content={errors.map(({ text, value }) =>
        value ? (
          <ty.CaptionText
            color={th.colors.status.error}
            key={text}
            p={th.spacing.xs}
            nowrap
          >
            {text}
          </ty.CaptionText>
        ) : null,
      )}
      customStyles={customStyles}
      setShow={setShow}
      show={show}
      triggerIcon={<AlertImg height={20} width={20} />}
      visible
    />
  );
};

export default ErrorPanel;
