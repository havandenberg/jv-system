import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { ClipLoader } from 'react-spinners';

import Remove from 'assets/images/remove';
import b from 'ui/button';
import l, { DivProps } from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

interface Props {
  children: ({ hide }: { hide: () => void }) => React.ReactNode;
  trigger: (show: () => void) => React.ReactNode;
}

const Modal = ({ children, trigger }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const hide = () => setIsOpen(false);
  const show = () => setIsOpen(true);

  return (
    <>
      {trigger(show)}
      <ReactModal
        ariaHideApp={false}
        isOpen={isOpen}
        onRequestClose={hide}
        style={{
          overlay: {
            alignItems: 'center',
            background: th.colors.overlay.dark,
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 20,
          },
          content: {
            background: th.colors.background,
            border: th.borders.disabled,
            borderRadius: th.borderRadii.default,
            inset: 0,
            position: 'relative',
            width: '50%',
          },
        }}
      >
        {children({ hide })}
      </ReactModal>
    </>
  );
};

export default Modal;

interface BasicModalProps {
  cancelText?: string;
  content?: React.ReactNode;
  confirmLoading?: boolean;
  confirmText?: string;
  title?: string;
  handleConfirm: () => void;
  shouldConfirm?: boolean;
  triggerButtonProps?: React.HTMLProps<HTMLButtonElement>;
  triggerStyles?: DivProps;
  triggerText?: string;
  triggerType?: 'remove-icon' | 'default';
}

export const BasicModal = ({
  cancelText = 'Cancel',
  content,
  confirmText = 'Confirm',
  confirmLoading,
  title,
  handleConfirm,
  shouldConfirm = true,
  triggerStyles,
  triggerButtonProps,
  triggerText,
  triggerType = 'default',
}: BasicModalProps) => {
  const getTrigger = (show: () => void) => {
    switch (triggerType) {
      case 'remove-icon':
        return (
          <l.HoverButton
            onClick={shouldConfirm ? show : handleConfirm}
            {...triggerStyles}
          >
            <Remove height={th.sizes.xs} width={th.sizes.xs} />
          </l.HoverButton>
        );
      default:
        return (
          <b.Primary
            disabled={confirmLoading}
            onClick={shouldConfirm ? show : handleConfirm}
            {...triggerButtonProps}
            {...triggerStyles}
          >
            {!shouldConfirm && confirmLoading ? (
              <l.Flex alignCenter justifyCenter>
                <ClipLoader
                  color={th.colors.brand.secondary}
                  size={th.sizes.xs}
                />
              </l.Flex>
            ) : (
              triggerText
            )}
          </b.Primary>
        );
    }
  };
  return (
    <Modal trigger={(show) => getTrigger(show)}>
      {({ hide }) => (
        <>
          {title && <ty.TitleText>{title}</ty.TitleText>}
          {content}
          <l.Flex justifyCenter mt={th.spacing.xl}>
            <b.Primary
              disabled={confirmLoading}
              mr={th.spacing.md}
              onClick={hide}
            >
              {cancelText}
            </b.Primary>
            <b.Primary
              disabled={confirmLoading}
              onClick={() => {
                handleConfirm();
                hide();
              }}
            >
              {confirmLoading ? (
                <l.Flex alignCenter justifyCenter>
                  <ClipLoader
                    color={th.colors.brand.secondary}
                    size={th.sizes.xs}
                  />
                </l.Flex>
              ) : (
                confirmText
              )}
            </b.Primary>
          </l.Flex>
        </>
      )}
    </Modal>
  );
};
