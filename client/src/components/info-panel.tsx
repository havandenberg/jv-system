import React, { useState } from 'react';
import styled from '@emotion/styled';

import useOutsideClickRef from 'hooks/use-outside-click-ref';
import l, { DivProps, divPropsSet } from 'ui/layout';
import th from 'ui/theme';

const Panel = styled(l.Div)(
  {
    borderRadius: th.borderRadii.default,
    border: th.borders.secondary,
    background: th.colors.background,
    boxShadow: th.shadows.box,
    cursor: 'default',
    maxHeight: 300,
    left: `-${th.spacing.xs}`,
    padding: th.spacing.sm,
    opacity: 1,
    position: 'absolute',
    top: 24,
    width: 300,
    zIndex: 5,
  },
  divPropsSet,
);

const Trigger = styled(l.Div)(
  ({ show, visible }: { show: boolean; visible: boolean }) => ({
    background: th.colors.background,
    opacity: show ? 1 : visible ? th.opacities.secondary : 0,
    transition: th.transitions.default,
    ':hover': {
      opacity: 1,
    },
  }),
);

export interface InfoPanelProps {
  content: ({
    show,
    setShow,
  }: {
    show: boolean;
    setShow: (show: boolean) => void;
  }) => React.ReactNode;
  customStyles?: DivProps;
}
interface Props extends InfoPanelProps {
  triggerIcon: React.ReactNode;
  visible: boolean;
}

const InfoPanel = ({ content, customStyles, triggerIcon, visible }: Props) => {
  const [show, setShow] = useState(false);

  const ref = useOutsideClickRef(() => {
    setShow(false);
  });

  const toggleShow = () => {
    setShow(!show);
  };

  return (
    <l.Div relative ref={ref}>
      <Trigger onClick={toggleShow} show={show} visible={visible}>
        {triggerIcon}
      </Trigger>
      {show && <Panel {...customStyles}>{content({ show, setShow })}</Panel>}
    </l.Div>
  );
};

export default InfoPanel;
