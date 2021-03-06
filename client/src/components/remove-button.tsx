import React from 'react';

import Remove from 'assets/images/remove';
import b from 'ui/button';
import l, { DivProps } from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import Modal from 'components/modal';

interface Props {
  confirmContent?: React.ReactNode;
  confirmTitle?: string;
  handleRemove: () => void;
  removeText?: string;
  shouldConfirm?: boolean;
  triggerProps?: DivProps;
}

const RemoveButton = ({
  confirmTitle,
  confirmContent,
  handleRemove,
  removeText,
  shouldConfirm,
  triggerProps,
}: Props) => (
  <Modal
    trigger={(show) => (
      <l.HoverButton
        onClick={shouldConfirm ? show : handleRemove}
        {...triggerProps}
      >
        <Remove height={th.sizes.xs} width={th.sizes.xs} />
      </l.HoverButton>
    )}
  >
    {({ hide }) => (
      <>
        {confirmTitle && <ty.TitleText>{confirmTitle}</ty.TitleText>}
        {confirmContent}
        <l.Flex justifyCenter mt={th.spacing.xl}>
          <b.Primary mr={th.spacing.md} onClick={hide}>
            Cancel
          </b.Primary>
          <b.Primary
            onClick={() => {
              handleRemove();
              hide();
            }}
          >
            {removeText}
          </b.Primary>
        </l.Flex>
      </>
    )}
  </Modal>
);

export default RemoveButton;
