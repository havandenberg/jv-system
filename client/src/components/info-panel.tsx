import React from 'react';
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
  ({
    hasFilters,
    show,
    visible,
  }: {
    hasFilters: boolean;
    show: boolean;
    visible: boolean;
  }) => ({
    background: th.colors.background,
    opacity:
      hasFilters || show
        ? 1
        : visible
        ? th.opacities.secondary
        : th.opacities.disabled,
    transition: th.transitions.default,
    ':hover': {
      opacity: 1,
    },
  }),
);

export interface InfoPanelProps {
  content: React.ReactNode;
  customStyles?: DivProps;
}
interface Props extends InfoPanelProps {
  hasFilters?: boolean;
  setShow: (show: boolean) => void;
  show: boolean;
  triggerIcon?: React.ReactNode;
  visible: boolean;
}

const InfoPanel = ({
  content,
  customStyles,
  hasFilters = false,
  setShow,
  show,
  triggerIcon,
  visible,
}: Props) => {
  const ref = useOutsideClickRef(() => {
    setShow(false);
  });

  const toggleShow = () => {
    setShow(!show);
  };

  return (
    <l.Div relative ref={ref}>
      {triggerIcon && (
        <Trigger
          hasFilters={hasFilters}
          onClick={toggleShow}
          show={show}
          visible={visible}
        >
          {triggerIcon}
        </Trigger>
      )}
      {show && <Panel {...customStyles}>{content}</Panel>}
    </l.Div>
  );
};

export default InfoPanel;
