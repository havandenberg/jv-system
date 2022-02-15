import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { ClipLoader } from 'react-spinners';

import Remove from 'assets/images/minus-in-circle';
import b from 'ui/button';
import l, { DivProps } from 'ui/layout';
import th from 'ui/theme';
import ty, { TextProps } from 'ui/typography';

export const modalStyles: {
  content?: React.CSSProperties;
  overlay?: React.CSSProperties;
} = {
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
};

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
        style={modalStyles}
      >
        {children({ hide })}
      </ReactModal>
    </>
  );
};

export default Modal;

interface BasicModalProps {
  cancelText?: string;
  confirmDisabled?: boolean;
  confirmLoading?: boolean;
  confirmText?: string;
  content?: React.ReactNode;
  handleConfirm: () => boolean | void;
  onCancel?: () => void;
  shouldConfirm?: boolean;
  title?: string;
  triggerDisabled?: boolean;
  triggerStyles?: DivProps & TextProps;
  triggerText?: string;
  triggerType?: 'remove-icon' | 'default' | 'text';
}

export const BasicModal = ({
  cancelText = 'Cancel',
  confirmDisabled,
  confirmLoading,
  confirmText = 'Confirm',
  content,
  handleConfirm,
  onCancel,
  shouldConfirm = true,
  title,
  triggerDisabled,
  triggerStyles,
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
      case 'text':
        return (
          <ty.TriggerText
            onClick={shouldConfirm ? show : handleConfirm}
            {...triggerStyles}
          >
            {triggerText}
          </ty.TriggerText>
        );
      default:
        return (
          <b.Primary
            disabled={confirmLoading || triggerDisabled}
            onClick={shouldConfirm ? show : handleConfirm}
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
              onClick={() => {
                onCancel && onCancel();
                hide();
              }}
            >
              {cancelText}
            </b.Primary>
            <b.Primary
              disabled={confirmLoading || confirmDisabled}
              onClick={() => {
                const result = handleConfirm();
                if (result !== false) {
                  hide();
                }
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
