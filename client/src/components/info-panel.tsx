import React from 'react';
import styled from '@emotion/styled';
import OutsideClickHandler from 'react-outside-click-handler';

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

const Trigger = styled(l.Flex)(
  ({
    hasFilters,
    show,
    visible,
  }: {
    hasFilters: boolean;
    show: boolean;
    visible: boolean;
  }) => ({
    alignItems: 'center',
    justifyContent: 'center',
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
  const toggleShow = () => {
    setShow(!show);
  };

  return (
    <l.Div relative>
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
      {show && (
        <OutsideClickHandler
          onOutsideClick={() => {
            setShow(false);
          }}
        >
          <Panel {...customStyles}>{content}</Panel>
        </OutsideClickHandler>
      )}
    </l.Div>
  );
};

export default InfoPanel;
