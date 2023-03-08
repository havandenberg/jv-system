import React from 'react';

import ArrowInCircle from 'assets/images/arrow-in-circle';
import DoubleArrowInCircle from 'assets/images/double-arrow-in-circle';
import l from 'ui/layout';
import th from 'ui/theme';

export const CollapseAllControl = ({
  collapseAllItems,
  expandAllItems,
}: {
  collapseAllItems: () => void;
  expandAllItems: () => void;
}) => (
  <l.Flex alignCenter>
    <l.HoverButton
      borderRadius={th.borderRadii.circle}
      boxShadow={th.shadows.boxLight}
      dark
      ml={th.spacing.sm}
      onClick={collapseAllItems}
    >
      <DoubleArrowInCircle
        fill={th.colors.brand.primary}
        height={th.sizes.xs}
        width={th.sizes.xs}
      />
    </l.HoverButton>
    <l.HoverButton
      borderRadius={th.borderRadii.circle}
      boxShadow={th.shadows.boxLight}
      dark
      ml={th.spacing.sm}
      onClick={expandAllItems}
      transform="scaleY(-1)"
    >
      <DoubleArrowInCircle
        fill={th.colors.brand.primary}
        height={th.sizes.xs}
        width={th.sizes.xs}
      />
    </l.HoverButton>
  </l.Flex>
);

interface Props {
  content: React.ReactNode;
  disabled?: boolean;
  header: React.ReactNode;
  hideToggle?: boolean;
  isOpen: boolean;
  showBorder?: boolean;
  toggleIsOpen: () => void;
}

const Expandable = ({
  content,
  disabled,
  header,
  hideToggle,
  isOpen,
  showBorder,
  toggleIsOpen,
}: Props) => (
  <l.Div>
    <l.Flex
      alignCenter
      borderTop={showBorder ? th.borders.secondary : undefined}
      cursor={disabled ? 'default' : 'pointer'}
      onClick={disabled ? undefined : toggleIsOpen}
      mt={showBorder ? th.spacing.md : undefined}
      pt={showBorder ? th.spacing.md : undefined}
    >
      {hideToggle ? null : disabled ? (
        <l.Div width={th.sizes.xs} />
      ) : (
        <l.Div
          bg={isOpen ? th.colors.brand.primary : th.colors.background}
          borderRadius={th.borderRadii.circle}
          transform={`rotate(${isOpen ? -90 : 180}deg)`}
          height={th.sizes.xs}
          width={th.sizes.xs}
        >
          <ArrowInCircle
            fill={isOpen ? th.colors.text.inv : th.colors.brand.primary}
            height={th.sizes.xs}
            width={th.sizes.xs}
          />
        </l.Div>
      )}
      <l.Div flex={1} ml={th.spacing.sm}>
        {header}
      </l.Div>
    </l.Flex>
    {isOpen && content}
  </l.Div>
);

export default Expandable;
