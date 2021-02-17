import React, { useState } from 'react';
import ReactModal from 'react-modal';

import th from 'ui/theme';

interface Props {
  children: React.ReactNode;
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
            height: '70%',
            width: '50%',
          },
        }}
      >
        {children}
      </ReactModal>
    </>
  );
};

export default Modal;
